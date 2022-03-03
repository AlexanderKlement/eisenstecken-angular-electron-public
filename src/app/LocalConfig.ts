import * as yaml from 'yaml';
import {APP_CONFIG} from '../environments/environment';
import {ElectronService} from './core/services';


export class LocalConfig {

    private static instance: LocalConfig;

    private configFileFolder = 'Kivi/Eisenstecken-Eibel';
    private configFileName = 'config.yml';

    private configFilePath: string;

    private defaultEncoding: BufferEncoding = 'utf8';
    private defaultConfig = {
        api: APP_CONFIG.apiBasePath,
    };


    private loadedConfig;

    private constructor() {
        this.init();
    }

    public static getInstance(): LocalConfig {
        if (!LocalConfig.instance) {
            LocalConfig.instance = new LocalConfig();
        }

        return LocalConfig.instance;
    }

    public init(): void {
        this.loadedConfig = this.defaultConfig;
        const electronService = new ElectronService();
        if (electronService.isElectron) {
            const arg = electronService.ipcRenderer.sendSync('app_path_sync');
            const appdataPath = arg.path;
            const path = require('path');
            const configFileFolderPath = path.join(appdataPath, this.configFileFolder);
            this.configFilePath = path.join(configFileFolderPath, this.configFileName);
            electronService.fs.mkdirSync(configFileFolderPath, {recursive: true});
            console.log(this.configFilePath);
            if (electronService.fs.existsSync(this.configFilePath)) {
                this.readConfig();
            } else {
                this.writeConfig();
            }
        }
    }

    public getApi(): string {
        return this.loadedConfig.api;
    }

    private writeConfig(): void {
        const yamlString = yaml.stringify(this.loadedConfig);
        const electronService = new ElectronService();
        electronService.fs.writeFileSync(this.configFilePath, yamlString, {encoding: this.defaultEncoding});
    }

    private readConfig(): void {
        const electronService = new ElectronService();
        const configData = electronService.fs.readFileSync(this.configFilePath, {encoding: this.defaultEncoding});
        this.loadedConfig = yaml.parse(configData);
    }

}
