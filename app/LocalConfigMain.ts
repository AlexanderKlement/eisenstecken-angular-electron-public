import * as yaml from 'yaml';
import * as fs from 'fs';
import {app} from 'electron';


export class LocalConfigMain {

    private static instance: LocalConfigMain;

    private configFileFolder = 'Kivi/Eisenstecken-Eibel';
    private configFileName = 'config_main.yml';

    private configFilePath: string;

    private defaultEncoding: BufferEncoding = 'utf8';
    private defaultConfig = {
        channel: 'latest',
        mail_processor: 'x86'
    };

    private loadedConfig;

    private constructor() {
        this.init();
    }

    public static getInstance(): LocalConfigMain {
        if (!LocalConfigMain.instance) {
            LocalConfigMain.instance = new LocalConfigMain();
        }

        return LocalConfigMain.instance;
    }

    public init(): void {
        this.loadedConfig = this.defaultConfig;
        const appdataPath = app.getPath('userData');
        const path = require('path');
        const configFileFolderPath = path.join(appdataPath, this.configFileFolder);
        this.configFilePath = path.join(configFileFolderPath, this.configFileName);
        fs.mkdirSync(configFileFolderPath, {recursive: true});
        console.log('Main Config: ' + this.configFilePath);
        if (fs.existsSync(this.configFilePath)) {
            this.readConfig();
        } else {
            this.writeConfig();
        }
    }

    public getChannel(): string {
        return this.loadedConfig.channel;
    }

    public setChannel(channel: string): void {
        this.loadedConfig.channel = channel;
        this.writeConfig();
    }

    private writeConfig(): void {
        const yamlString = yaml.stringify(this.loadedConfig);
        fs.writeFileSync(this.configFilePath, yamlString, {encoding: this.defaultEncoding});
    }

    private readConfig(): void {
        const configData = fs.readFileSync(this.configFilePath, {encoding: this.defaultEncoding});
        this.loadedConfig = yaml.parse(configData);
    }

    public setMailProcessor(processor: string): void {
        this.loadedConfig.mail_processor = processor;
        this.writeConfig();
    }

    public getMailProcessor(): string {
        return this.loadedConfig.mail_processor;
    }

}
