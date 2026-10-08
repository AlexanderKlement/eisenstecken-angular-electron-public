import * as yaml from "yaml";
import { APP_CONFIG } from "../environments/environment";
import { ElectronService } from "./core/services";

export class LocalConfigRenderer {
  private static instance: LocalConfigRenderer;

  private configFileFolder = "Kivi/Eisenstecken-Eibel";
  private configFileName = "config_renderer.yml";
  private isElectron: boolean = true;
  private configFilePath: string;
  private defaultEncoding: BufferEncoding = "utf8";

  private defaultConfig = {
    api: APP_CONFIG.apiBasePath,
    cadPath: APP_CONFIG.cadPath,
    vwPath: APP_CONFIG.vwPath
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

  public setEnvironment(env: "prod" | "beta" | "dev"): void {
    let url: string;

    switch (env) {
      case "prod":
        url = "https://api.app.eisenstecken.it"; // adjust if your prod URL differs
        break;
      case "beta":
        url = "https://api.app.eisenstecken.it/beta";
        break;
      case "dev":
        url = "https://api.app.eisenstecken.it/dev"; // adjust to your real dev URL
        break;
      default:
        console.warn("Unknown environment:", env);
        return;
    }

    console.info(`LocalConfigRenderer: switching environment to '${env}' with url ${url}`);
    this.setApi(url);
  }


  public init(): void {
    // Always start with default config
    this.loadedConfig = this.defaultConfig;

    try {
      const electronService = new ElectronService();

      if (!electronService.isElectron) {
        this.isElectron = false;
        this.readConfigBrowser();
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

  public setMultiple(keyValues: Record<keyof typeof this.defaultConfig, string>): void {
    Object.keys(keyValues).forEach((key: keyof typeof this.defaultConfig) => {
      this.loadedConfig[key] = keyValues[key];
    });
    this.writeConfigUniversal();
  }

  public setApi(newApiUrl: string): void {
    this.loadedConfig.api = newApiUrl;
    this.writeConfigUniversal();
  }

  public getApi(): string {
    return this.loadedConfig.api;
  }

  public getCADPath(): string {
    return this.loadedConfig.cadPath;
  }


  public getVWPath(): string {
    return this.loadedConfig.vwPath;
  }


  public replaceServerPath(path: string): string {
    let localPath = path.startsWith("CAD/") ? this.loadedConfig.cadPath : path.startsWith("VW/") ? this.loadedConfig.vwPath : undefined;
    if (!localPath) {
      return path;
    }
    const sliced = path.startsWith("CAD/") ? path.slice(4) : path.slice(3);
    if (sliced.startsWith("/")) {
      if (localPath.endsWith("/") || localPath.endsWith("\\")) {
        localPath = path.slice(0, -1);
      }
    } else {
      if (localPath.endsWith("\\")) {
        localPath = path.slice(0, -1);
      }
      if (!localPath.endsWith("/")) {
        localPath = `${localPath}/`;
      }
    }
    return `${localPath}${sliced}`;
  }

  public replaceLocalPath(path: string): string {
    const replaceSlash = this.loadedConfig.cadPath.endsWith("/") && path.startsWith(this.loadedConfig.cadPath) ? "/" : this.loadedConfig.vwPath.endsWith("/") && path.startsWith(this.loadedConfig.vwPath) ? "/" : "";

    return path.startsWith(this.loadedConfig.cadPath) ? path.replace(this.loadedConfig.cadPath, `CAD${replaceSlash}`) : path.startsWith(this.loadedConfig.vwPath) ? path.replace(this.loadedConfig.vwPath, `VW${replaceSlash}`) : path;
  }

  public getIsElectron(): boolean {
    return this.isElectron;
  }

  private writeConfigUniversal() {
    try {
      const electronService = new ElectronService();

      if (!electronService.isElectron) {
        this.writeConfigBrowser();
        return;
      }

      // In case init() failed earlier and configFilePath is not set
      if (!this.configFilePath) {
        this.init();
      }

      this.writeConfig(electronService);
    } catch (err) {
      console.error("LocalConfigRenderer.writeConfig failed, config not persisted:", err);
    }
  }

  private writeConfigBrowser(): void {
    const yamlString = yaml.stringify(this.loadedConfig);
    localStorage.setItem("config_renderer", yamlString);
  }

  private writeConfig(electronService: ElectronService): void {
    const yamlString = yaml.stringify(this.loadedConfig);
    electronService.fs.writeFileSync(this.configFilePath, yamlString, {
      encoding: this.defaultEncoding
    });
  }

  private readConfigBrowser(): void {
    const configData = localStorage.getItem("config_renderer");
    if (configData) {
      this.loadedConfig = yaml.parse(configData);
    }
  }

  private readConfig(electronService: ElectronService): void {
    const configData = electronService.fs.readFileSync(this.configFilePath, {
      encoding: this.defaultEncoding
    });
    const parsed = yaml.parse(configData);
    if (!("cadPath" in parsed) || !("vwPath" in parsed)) {
      parsed["vwPath"] = this.defaultConfig.vwPath;
      parsed["catPath"] = this.defaultConfig.cadPath;
      this.writeConfig(electronService);
    }
    this.loadedConfig = parsed;
  }
}
