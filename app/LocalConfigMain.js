"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalConfigMain = void 0;
const yaml = require("yaml");
const fs = require("fs");
const electron_1 = require("electron");
class LocalConfigMain {
    static instance;
    configFileFolder = "Kivi/Eisenstecken-Eibel";
    configFileName = "config_main.yml";
    configFilePath;
    defaultEncoding = "utf8";
    defaultConfig = {
        channel: "latest",
        mail_processor: "x86"
    };
    loadedConfig;
    constructor() {
        this.init();
    }
    static getInstance() {
        if (!LocalConfigMain.instance) {
            LocalConfigMain.instance = new LocalConfigMain();
        }
        return LocalConfigMain.instance;
    }
    init() {
        this.loadedConfig = this.defaultConfig;
        const appdataPath = electron_1.app.getPath("userData");
        const path = require("path");
        const configFileFolderPath = path.join(appdataPath, this.configFileFolder);
        this.configFilePath = path.join(configFileFolderPath, this.configFileName);
        fs.mkdirSync(configFileFolderPath, { recursive: true });
        console.log("Main Config: " + this.configFilePath);
        if (fs.existsSync(this.configFilePath)) {
            this.readConfig();
        }
        else {
            this.writeConfig();
        }
    }
    getChannel() {
        return this.loadedConfig.channel;
    }
    setChannel(channel) {
        this.loadedConfig.channel = channel;
        this.writeConfig();
    }
    writeConfig() {
        const yamlString = yaml.stringify(this.loadedConfig);
        fs.writeFileSync(this.configFilePath, yamlString, { encoding: this.defaultEncoding });
    }
    readConfig() {
        const configData = fs.readFileSync(this.configFilePath, { encoding: this.defaultEncoding });
        this.loadedConfig = yaml.parse(configData);
    }
    setMailProcessor(processor) {
        this.loadedConfig.mail_processor = processor;
        this.writeConfig();
    }
    getMailProcessor() {
        return this.loadedConfig.mail_processor;
    }
}
exports.LocalConfigMain = LocalConfigMain;
//# sourceMappingURL=LocalConfigMain.js.map