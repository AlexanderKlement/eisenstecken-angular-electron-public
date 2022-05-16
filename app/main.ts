import {app, BrowserWindow, dialog, ipcMain, Menu, screen, shell, Tray} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as Sentry from "@sentry/electron";
import {autoUpdater} from 'electron-updater';
import {LocalConfigMain} from './LocalConfigMain';


Sentry.init({dsn: "https://60ac4754e4be476a82b10b0e597dfaa6@sentry.kivi.bz.it/25"});

let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');
const gotTheLock = app.requestSingleInstanceLock();

var child = require('child_process').execFile;
const appPath = app.getAppPath();

const mail64ExecutablePath = appPath + '\\mail64\\mail.exe';
const mail32ExecutablePath = appPath + '\\mail32\\mail.exe';

const localConfig = LocalConfigMain.getInstance();

if (app.getVersion().includes('beta')) {
    autoUpdater.channel = "beta";
    localConfig.setChannel("beta");
} else {
    autoUpdater.channel = localConfig.getChannel();
}

if (autoUpdater.channel == "beta") {
    console.warn("ATTENTION: This is a BETA Version");
}

autoUpdater.allowDowngrade = false;

const eisensteckenIconIco = appPath + '\\assets\\icons\\favicon.ico';
const eisensteckenIconPng = appPath + '\\assets\\icons\\favicon.png';
let isQuiting;
let forceClose = false;
let tray = null;

initTray();
initIPC();

try {

    if (!gotTheLock) {
        app.quit()
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            console.warn("Second instance detected");
            // Someone tried to run a second instance, we should focus our window.
            win.show();
            if (win) {
                if (win.isMinimized()) win.restore()
                win.focus()
            }
        })
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
        app.on('ready', createWindow);
        //app.on('ready', () => setTimeout(createWindow, 400));

        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (win === null) {
                createWindow();
            }
        });

        autoUpdater.on('update-available', () => {
            win.webContents.send('update_available');
        });
        autoUpdater.on('update-downloaded', () => {
            win.webContents.send('update_downloaded');
        });


    }
} catch (e) {
    // Catch Error
    // throw e;
}

function createWindow(): BrowserWindow {
    const size = screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        icon: 'src/logo.ico',
        title: "Eisenstecken - Eibel",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false,  // false if you want to run e2e test with Spectron
        },
    });
    win.maximize();
    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(path.join(__dirname, '/../node_modules/electron'))
        });
        win.loadURL('http://localhost:4200');
    } else {
        // Path when running electron executable
        let pathIndex = './index.html';

        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            // Path when running electron in local folder
            pathIndex = '../dist/index.html';
        }

        win.loadURL(url.format({
            pathname: path.join(__dirname, pathIndex),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    win.on('hide', () => {
        appHidden();
    });

    win.on('show', () => {
        appShown();
    });

    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });

    app.on('before-quit', function () {
        isQuiting = true;
    });


    win.on('close', async e => {

        if (!isQuiting) {
            e.preventDefault();
            win.hide();
            e.returnValue = false;
        }
        /* I am leaving this for the moment, in case we want to go back
        if (forceClose) {
            return;
        }
        e.preventDefault();

        const {response} = await dialog.showMessageBox(win, {
            type: 'question',
            title: '  Bestätigen  ',
            message: 'Programm schließen?',
            buttons: ['Ja', 'Abbrechen'],
        })

        response || win.destroy()
        */
    });


    win.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });

    return win;
}

function initTray() {
    app.whenReady().then(() => {
        tray = new Tray(eisensteckenIconIco);
        tray.setToolTip('Eisenstecken-Eibel');
        tray.setContextMenu(Menu.buildFromTemplate([
            {
                label: 'Öffnen', click: function () {
                    win.show();
                }
            },
            {
                label: 'Schließen', click: function () {
                    isQuiting = true;
                    app.quit();
                }
            }
        ]));
    })

}

function initIPC() {
    const {ipcMain} = require('electron')

//IPC the program needs to fulfill its work
    ipcMain.on('shell-external-request', (event, arg) => {
        shell.openExternal(arg).then(() => {
            event.reply('shell-external-reply', true);
        }, (reason) => {
            console.error('Main: Shell external: FAIL');
            console.error(reason);
            event.reply('shell-external-reply', false);
        });
    });
    ipcMain.on('send-mail-request', (event, arg) => {
        console.log("Preparing mail: " + LocalConfigMain.getInstance().getMailProcessor());
        let mailExecutablePath = mail32ExecutablePath;
        if (LocalConfigMain.getInstance().getMailProcessor().includes('x64')) {
            mailExecutablePath = mail64ExecutablePath;
        }

        let mailCommand = mailExecutablePath;

        for(const singleArg of arg) {
            mailCommand += ' ' + escapeShell(singleArg);
        }

        let cmd = "";
        if (process.platform === "win32") {
            cmd += "cmd /c chcp 65001>nul && ";
        }
        cmd += mailCommand;

        require('child_process').exec(cmd, function (err, stdout: string, stderr: string): void {
            if(stdout.trim().length < 5) {
                event.reply('send-mail-reply', true);
                return;
            }
            const errorString = stdout;
            const doublePoint = errorString.indexOf(': ') + 2;
            const firstAt = errorString.indexOf(' at ');
            const extractedErrorString = errorString.slice(doublePoint, firstAt);
            event.reply('send-mail-reply', extractedErrorString);
            return;
        });
        event.reply('send-mail-reply', true);
    });
    ipcMain.on('set-mail-processor-request', (event, arg) => {
        LocalConfigMain.getInstance().setMailProcessor(arg[0]);
        event.reply('set-mail-processor-replay', true);
    })
    ipcMain.on('shell-item-request', (event, arg) => {
        shell.openPath(arg).then((response) => {
            event.reply('shell-item-reply', response);
        }, (reason) => {
            console.error('Main: Shell item: FAIL');
            console.error(reason);
            event.reply('shell-item-reply', reason.toString());
        });
    });
    ipcMain.on('shell-file-request', (event, arg) => {
        try {
            shell.showItemInFolder(arg);
            event.reply('shell-file-reply', true);
        } catch (e) {
            console.error("Main: Shell file: FAIL");
            console.error(e);
            event.reply('shell-file-reply', false);
        }
    });

    ipcMain.on('select-folder-request', (event, arg) => {
        try {
            const {dialog} = require('electron')
            const pathPromise = dialog.showOpenDialog({
                properties: ['openDirectory']
            });
            pathPromise.then((path) => {
                if (path.canceled)
                    event.reply('select-folder-reply', '');
                else
                    event.reply('select-folder-reply', path.filePaths[0]);
            });
        } catch (e) {
            console.error("Main: Select Folder FAIL");
            console.error(e);
            event.reply('select-folder-reply', '');
        }
    });

    /*
    Arg0: multi: [true, false]
    Arg1: filtername: str,
    Arg2: filters separated by ";"
     */
    ipcMain.on('select-files-request', (event, arg) => {

        try {
            const properties: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' |
                'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' |
                'dontAddToRecent'> = [
                'openFile'
            ];
            if (arg[0]) {
                properties.push('multiSelections')
            }
            const {dialog} = require('electron')
            const pathPromise = dialog.showOpenDialog({
                properties: properties,
                filters: [
                    {
                        name: arg[1],
                        extensions: arg[2].split(';')
                    }
                ]
            });
            pathPromise.then((path) => {
                if (path.canceled)
                    event.reply('select-files-reply', []);
                else {
                    event.reply('select-files-reply', path.filePaths);
                }

            });
        } catch (e) {
            console.error("Main: Select Files FAIL");
            console.error(e);
            event.reply('select-files-reply', []);
        }
    })


//IPC  for autoupdate:
    ipcMain.on('app_version', (event) => {
        event.sender.send('app_version', {version: app.getVersion()});
    });

    ipcMain.on('restart_app', () => {
        forceClose = true;
        autoUpdater.quitAndInstall();
    });

    //IPC for get information
    ipcMain.on('app_path', (event) => {
        event.sender.send('app_path', {path: app.getPath('appData')});
    });
    ipcMain.on('app_path_sync', (event) => {
        event.returnValue = {path: app.getPath('appData')};
    });


    //IPC for tray
    ipcMain.on('show-tray-balloon-request', (event, arg) => {
        //I'll just do both of them, one of them should open correctly.
        //If it opens twice we should add a check here
        console.info("Showing tray balloon: ");
        const image = require('electron').nativeImage.createFromPath(eisensteckenIconPng);
        tray.displayBalloon({
            icon: image,
            iconType: 'custom',
            title: arg[0],
            content: arg[1],
            noSound: true,
            respectQuietTime: false
        });
        event.reply('show-tray-balloon-replay', true);
    });
}


function appShown(): void {
    win.webContents.send('app-shown');
}


function appHidden(): void {
    win.webContents.send('app-hidden');
}

function escapeShell(cmd: string): string {
    const replaced = '"' + cmd.replace(/(["'$`\\])/g, '\\$1') + '"';
    return replaced.replace(/\n/g, '<br>');
}
