![Eisenstecken-Logo](/src/assets/icons/eisenstecken.bmp)

# Eisenstecken - Eibel

## How to build:

### Installer:

First we need to build the electron app:

We have to think about the following variables:

- [environment.prod.ts](/src/environments/environment.prod.ts) check if apiBasePath points to the correct endpoint
  `https://api.app.eisenstecken.it`
- [angular.json](/angular.json) service worker has to be set to `false`

#### EXE + MSI:

Run the build script

````
  npm run electron:build   
````

Then open `build_installer_msi.js` search for the `version` tag and increase the version number The MSI-Installer can
then be generated with this comment:

````
npm run package:msi
````

The Installer can be found in `/release/windows_installer/eisenstecken.msi`

#### EXE (with deploy):

First you have to export the GitHub token

macOS/linux:

`export GH_TOKEN="<YOUR_TOKEN_HERE>"`

windows:

`[Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")`

IMPORTANT: Restart Terminal/IDE to reload environment variables.

The build and deploy with:
`npm run postversion` or `npm run version:[patch|minor|major]`
`npm run electron:deploy`

Go to GitHub open the release and release it

Note: please look at [Updating](#updating)

### Hour register Website (with Serviceworker)

First we have to build the angular app:

We have to think about the following variables:

- [environment.prod.ts](/src/environments/environment.prod.ts) check if apiBasePath points to the correct endpoint
  `https://api.app.eisenstecken.it`
- [angular.json](/angular.json) service worker has to be set to `true`

  Run the build script to generate html files:

````
npm run build:prod
````

Take the files in the `/dist` directory and upload them to the web server

To make the Website available we need a Webserver and to secure it, we need a Reverse Proxy Both can be archived with
the following example configuration on apache2:

````
<IfModule mod_ssl.c>
<VirtualHost *:443>
        ServerName SERVERNAME
        ServerAlias SERVERALIAS
        ServerAdmin MAIL

        DocumentRoot DOCUMENTROOT

        ErrorLog ${APACHE_LOG_DIR}/time_eisenstecken.error.log
        CustomLog ${APACHE_LOG_DIR}/time_eisenstecken.access.log combined

        RewriteEngine On
        # If an existing asset or directory is requested go to it as it is
        RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
        RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
        RewriteRule ^ - [L]

        # If the requested resource doesn't exist, use index.html
        RewriteRule ^ /index.html

        <Directory /home/kalle/eisenstecken-gui/dist><
                Options FollowSymLinks
                AllowOverride None
                Require all denied
        </Directory>

        SSLCertificateFile PATH_TO_FULLCHAIN
        SSLCertificateKeyFile  PATH_TO_KEY
        Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
````

The Directory we apply our ruleset differ from the DocumentRoot, because the DocumentRoot's owner www-data is most of
the time not accessible by others, which makes regular uploads a real struggle.

## Updating

To increase the Version please use the `version:[patch|minor|major]` scripts, this runs the preversion & version & postversion hooks:

These do:

- `preversion`: replace the version in `app/main.ts`, `src/main.ts` and `app/package.json` and checks if there are patch-notes in the `src/app/home/info-dialog/info-dialog.component.ts`
- `postversion`: builds the project with the new version, inject sentry DEBUG ID's and uploads the sourcemaps to sentry

INFO: login to sentry-cli via sentry-cli --url https://sentry.kivi.bz.it login (i did not open the browser but entered the token manually)

Token needs the scopes org:read, project:read, project:releases

Add the server to ~/.sentryclirc:

url = https://sentry.kivi.bz.it

If you make code changes after you increase the version, you can still run the `npm run postversion` script to regenerate the sentry sourcemaps.

IMPORTANT: This have to run before a `npm run electron:deploy`

Manual version change in `package.json` has been disabled via husky hook to prevent releasing with wrong version numbers or without release notes

## Fixed the import not being possible for openapi-generate-client:

npx -y @openapitools/openapi-generator-cli@latest version-manager list
npx -y @openapitools/openapi-generator-cli@latest version-manager set 7.10.0

## Unregistered Service Worker like this:

navigator.serviceWorker.getRegistrations().then(regs => {
console.log('Registrations before unregister:', regs);
return Promise.all(regs.map(r => r.unregister()));
}).then(results => {
console.log('Unregister results:', results);
});

## Local path

### Windows

1. SSHFS-Win installieren:

```
winget install WinFsp.WinFsp
winget install SSHFS-Win.SSHFS-Win
```

2. Private Key überprüfen:
   SSHFS-Win sucht deinen privaten Key unter:

```C:\Users\<dein-user>\.ssh\id_rsa```

Zwei Dinge musst du prüfen:

- Liegt dein Key unter einem anderen Namen (z. B. id_ed25519)? Dann kopiere ihn als id_rsa in denselben Ordner. Der Dateiname ist hier egal, ed25519 funktioniert trotzdem.
- Der Key darf keine Passphrase haben. SSHFS-Win nutzt keinen ssh-agent. Falls deiner eine hat, siehe die Alternative unten

3. Laufwerk verbinden:

PROD:

```
net use S: \\sshfs.kr\kiviadmin@api.app.eisenstecken.it!2211\media\CAD /persistent:yes
net use V: \\sshfs.kr\kiviadmin@api.app.eisenstecken.it!2211\media\VW /persistent:yes
```

BETA:

```
net use S: \\sshfs.kr\kiviadmin@api.app.eisenstecken.it!2211\media\VW\Verwaltungsprogramm\files\CAD /persistent:yes
net use V: \\sshfs.kr\kiviadmin@api.app.eisenstecken.it!2211\media\VW\Verwaltungsprogramm\files\VW /persistent:yes
```

Laufwerk trennen:

```
net use S: /delete
```

### Mac

1. rclone installierne:
   ```sudo -v ; curl https://rclone.org/install.sh | sudo bash```

2. Configuration erstellen:

```
rclone config create eisen sftp host=api.app.eisenstecken.it port=2211 user=kiviadmin key_file=~/.ssh/id_ed25519
```

3. Laufwerk verbinden:

PROD:

```
mkdir -p ~/CAD
mkdir -p ~/VW
rclone nfsmount eisen:/media/CAD ~/CAD --vfs-cache-mode writes
rclone nfsmount eisen:/media/VW ~/VW --vfs-cache-mode writes
```

BETA:

```
mkdir -p ~/CAD
mkdir -p ~/VW
rclone nfsmount eisen:/media/VW/Verwaltungsprogramm/files/CAD ~/CAD --vfs-cache-mode writes
rclone nfsmount eisen:/media/VW/Verwaltungsprogramm/files/CAD ~/VW --vfs-cache-mode writes
```
