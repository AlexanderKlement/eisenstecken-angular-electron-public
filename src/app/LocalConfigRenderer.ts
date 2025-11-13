import * as yaml from "yaml";
import { APP_CONFIG } from "../environments/environment";
import { ElectronService } from "./core/services";

export class LocalConfigRenderer {
  private static instance: LocalConfigRenderer;

  private configFileFolder = "Kivi/Eisenstecken-Eibel";
  private configFileName = "config_renderer.yml";

  private configFilePath: string;
  private defaultEncoding: BufferEncoding = "utf8";

  private defaultConfig = {
    api: APP_CONFIG.apiBasePath,
  };

  private loadedConfig = this.defaultConfig;

  private constructor() {
    this.init();
  }

  public static getInstance(): LocalConfigRenderer {
    if (!LocalConfigRenderer.instance) {
      LocalConfigRenderer.instance = new LocalConfigRenderer();
    }
    return LocalConfigRenderer.instance;
  }

  public init(): void {
    // Always start with default config
    this.loadedConfig = this.defaultConfig;

    try {
      const electronService = new ElectronService();

      if (!electronService.isElectron) {
        // Browser build → just use defaults
        return;
      }

      const arg = electronService.ipcRenderer.sendSync("app_path_sync");
      const appdataPath = arg.path;
      const path = require("path");

      const configFileFolderPath = path.join(appdataPath, this.configFileFolder);
      this.configFilePath = path.join(configFileFolderPath, this.configFileName);

      electronService.fs.mkdirSync(configFileFolderPath, { recursive: true });

      console.log("Renderer Config:", this.configFilePath);

      if (electronService.fs.existsSync(this.configFilePath)) {
        this.readConfig(electronService);
      } else {
        this.writeConfig(electronService);
      }
    } catch (err) {
      console.error("LocalConfigRenderer.init failed, using defaults:", err);
      // keep loadedConfig = defaultConfig
    }
  }

  public getApi(): string {
    return this.loadedConfig.api;
  }

  private writeConfig(electronService: ElectronService): void {
    const yamlString = yaml.stringify(this.loadedConfig);
    electronService.fs.writeFileSync(this.configFilePath, yamlString, {
      encoding: this.defaultEncoding,
    });
  }

  private readConfig(electronService: ElectronService): void {
    const configData = electronService.fs.readFileSync(this.configFilePath, {
      encoding: this.defaultEncoding,
    });
    this.loadedConfig = yaml.parse(configData);
  }
}
