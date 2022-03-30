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

`electron:deploy`

Go to GitHub open the release and

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

First we have to change the version numbers in `package.json` in the root and root/app folder

The build the update exe and publish the release on GitHub

## Adding new modules:

- `ng generate module NAME --routing`
- `ng generate component NAME`
- Register in `app.module.ts` and `app-routing.module.ts`
