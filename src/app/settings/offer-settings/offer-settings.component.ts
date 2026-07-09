import { Component, inject, OnInit } from "@angular/core";
import { BaseSettingsComponent } from "../base-settings.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { take } from "rxjs/operators";
import { FileService } from "../../shared/services/file.service";
import { ElectronService } from "../../core/services";
import { LocalConfigRenderer } from "../../LocalConfigRenderer";
import { TokenService } from "../../shared/services/token.service";
import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-offer-settings",
  templateUrl: "./offer-settings.component.html",
  styleUrls: ["./offer-settings.component.scss"],
  imports: [FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatButton]
})
export class OfferSettingsComponent extends BaseSettingsComponent implements OnInit {
  private tokenService = inject(TokenService);

  private file = inject(FileService);
  private electron = inject(ElectronService);
  private httpBackend = inject(HttpBackend);


  private readonly allowedExtensions = ["png"];
  // =================================================================================

  logoFilename: string | null = null;
  logoUploading = false;
  selectedLogo: Blob | null = null;
  selectedLogoUrl: string | null = null;


  keyList = [
    "offer_title_introduction_de",
    "offer_title_introduction_it",
    "offer_in_price_included_de",
    "offer_in_price_included_it",
    "offer_validity_de",
    "offer_validity_it",
    "offer_delivery_de",
    "offer_delivery_it",
    "offer_payment_de",
    "offer_payment_it"
  ];

  ngOnInit() {
    super.ngOnInit();
    this.selectedLogoUrl = `${LocalConfigRenderer.getInstance().getApi()}/parameter/offer_extra_logos/image`;
  }

  protected onFileSelected($event: Event) {
    const file = ($event.target as HTMLInputElement).files[0];
    const mime = file.type;
    const filename = file.name;
    file.bytes().then((buffer) => {
      const b = Buffer.from(buffer);
      const dataUrl = `data:${mime};base64,${b.toString("base64")}`;
      const image = new Image();
      image.onload = () => {
        this.selectedLogo = new Blob([buffer], { type: mime });
        this.selectedLogoUrl = dataUrl;
        this.logoFilename = filename;
      };
      image.onerror = () => {
        this.snackBar.open("Das ausgewählte Bild konnte nicht geladen werden.", "Ok", { duration: 5000 });
      };
      image.src = dataUrl;
    });
  }

  selectLogoClicked(): void {
    this.file.selectFiles(false, "Bilder", this.allowedExtensions)
      .then((paths) => {
        if (!paths || paths.length === 0) {
          return;
        }
        this.loadAndValidateLogo(paths[0]);
      })
      .catch(() => {
        this.snackBar.open("Datei konnte nicht ausgewählt werden.", "Ok", { duration: 5000 });
      });
  }

  private loadAndValidateLogo(path: string): void {
    let buffer: Buffer;
    try {
      buffer = this.electron.fs.readFileSync(path);
    } catch (e) {
      console.error(e);
      this.snackBar.open("Datei konnte nicht gelesen werden.", "Ok", { duration: 5000 });
      return;
    }

    const filename = path.split("\\").pop().split("/").pop();
    const mime = this.mimeFromFilename(filename);
    if (mime !== "image/png") {
      this.snackBar.open("Nur PNG erlaubt.", "Ok", { duration: 8000 });
      return;
    }
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

    const image = new Image();
    image.onload = () => {
      this.selectedLogo = new Blob([new Uint8Array(buffer)], { type: mime });
      this.selectedLogoUrl = dataUrl;
      this.logoFilename = filename;
    };
    image.onerror = () => {
      this.snackBar.open("Das ausgewählte Bild konnte nicht geladen werden.", "Ok", { duration: 5000 });
    };
    image.src = dataUrl;
  }

  get isElectron() {
    return LocalConfigRenderer.getInstance().getIsElectron();
  }

  uploadLogoClicked(): void {
    if (this.logoUploading || !this.selectedLogo || !this.logoFilename || !this.selectedLogoUrl) {
      return;
    }
    const url = `${LocalConfigRenderer.getInstance().getApi()}/parameter/offer_extra_logos/image`;
    const token = this.tokenService.getToken();
    if (!token) {
      return;
    }
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    });
    const formData = new FormData();
    formData.append("image", this.selectedLogo, this.logoFilename);
    const rawHttp = new HttpClient(this.httpBackend);
    this.logoUploading = true;
    rawHttp.post<boolean>(url, formData, {
      headers
    }).pipe(take(1)).subscribe({
      next: () => {
        this.selectedLogo = null;
        this.logoFilename = null;
        this.selectedLogoUrl = `${LocalConfigRenderer.getInstance().getApi()}/parameter/offer_extra_logos/image`;
        this.snackBar.open("Logo erfolgreich hochgeladen!", "Ok", { duration: 3000 });
        this.logoUploading = false;
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open("Logo konnte nicht hochgeladen werden.", "Ok", { duration: 8000 });
        this.logoUploading = false;
      }
    });


  }

  private mimeFromFilename(filename: string): string {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      default:
        return "application/octet-stream";
    }
  }

}
