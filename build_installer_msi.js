// ./build_installer_msi.js

// 1. Import Modules
/* eslint-env es6 */
/* eslint-disable no-console */
const {MSICreator} = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64",
const APP_DIR = path.resolve(__dirname, './release/win-unpacked');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer",
const OUT_DIR = path.resolve(__dirname, './release/windows-installer-msi');

var pjson = require('./package.json');
console.log('Building Version: ' + pjson.version);

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    // Configure metadata
    description: 'Internal Desktop Application',
    exe: 'eisenstecken',
    name: 'Eisenstecken - Eibel',
    shortname: 'Eibel',
    manufacturer: 'Kivi',
    programFilesFolderName: 'Kivi',
    version: pjson.version,
    arch: 'x64',
    upgradeCode: 'CF71254E-73FE-4389-971E-BD9380278EF6',
    autoUpdate: true,
    // Configure installer User Interface
    ui: {
        chooseDirectory: true
    },
});

// 4. Create a .wxs template file
msiCreator.create().then(function () {
    // Step 5: Compile the template to a .msi file
    msiCreator.compile();
});
