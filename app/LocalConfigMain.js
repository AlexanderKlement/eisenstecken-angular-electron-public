"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalConfigMain = void 0;
var yaml = require("yaml");
var fs = require("fs");
var electron_1 = require("electron");
var LocalConfigMain = /** @class */ (function () {
    function LocalConfigMain() {
        this.configFileFolder = 'Kivi/Eisenstecken-Eibel';
        this.configFileName = 'config_main.yml';
        this.defaultEncoding = 'utf8';
        this.defaultConfig = {
            channel: 'latest'
        };
        this.init();
    }
    LocalConfigMain.getInstance = function () {
        if (!LocalConfigMain.instance) {
            LocalConfigMain.instance = new LocalConfigMain();
        }
        return LocalConfigMain.instance;
    };
    LocalConfigMain.prototype.init = function () {
        this.loadedConfig = this.defaultConfig;
        var appdataPath = electron_1.app.getAppPath();
        var path = require('path');
        var configFileFolderPath = path.join(appdataPath, this.configFileFolder);
        this.configFilePath = path.join(configFileFolderPath, this.configFileName);
        fs.mkdirSync(configFileFolderPath, { recursive: true });
        console.log('Main Config: ' + this.configFilePath);
        if (fs.existsSync(this.configFilePath)) {
            this.readConfig();
        }
        else {
            this.writeConfig();
        }
    };
    LocalConfigMain.prototype.getChannel = function () {
        return this.loadedConfig.channel;
    };
    LocalConfigMain.prototype.setChannel = function (channel) {
        this.loadedConfig.channel = channel;
        this.writeConfig();
    };
    LocalConfigMain.prototype.writeConfig = function () {
        var yamlString = yaml.stringify(this.loadedConfig);
        fs.writeFileSync(this.configFilePath, yamlString, { encoding: this.defaultEncoding });
    };
    LocalConfigMain.prototype.readConfig = function () {
        var configData = fs.readFileSync(this.configFilePath, { encoding: this.defaultEncoding });
        this.loadedConfig = yaml.parse(configData);
    };
    return LocalConfigMain;
}());
exports.LocalConfigMain = LocalConfigMain;
//# sourceMappingURL=LocalConfigMain.js.map