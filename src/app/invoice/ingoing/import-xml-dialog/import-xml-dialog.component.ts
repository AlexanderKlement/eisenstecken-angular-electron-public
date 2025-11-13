import { Component, OnInit } from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { FileService } from "../../../shared/services/file.service";
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from "@angular/material/dialog";
import { ElectronService } from "../../../core/services";
import { first } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DefaultService, XmlFileStr } from "../../../../api/openapi";
import { CdkScrollable } from "@angular/cdk/scrolling";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
} from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { MatList, MatListItem } from "@angular/material/list";
import { CircleIconButtonComponent } from "../../../shared/components/circle-icon-button/circle-icon-button.component";

@Component({
  selector: "app-import-xml-dialog",
  templateUrl: "./import-xml-dialog.component.html",
  styleUrls: ["./import-xml-dialog.component.scss"],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatButton,
    MatList,
    MatListItem,
    MatDialogActions,
    CircleIconButtonComponent,
  ],
})
export class ImportXmlDialogComponent implements OnInit {
  selectXmlFormGroup: UntypedFormGroup;
  title: "Digitale Rechnungen auswählen";
  loading = false;

  constructor(
    private api: DefaultService,
    private file: FileService,
    private electron: ElectronService,
    public dialogRef: MatDialogRef<ImportXmlDialogComponent>,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.selectXmlFormGroup = new UntypedFormGroup({
      paths: new UntypedFormArray([]),
    });
    //this.addPath('C:\\Users\\alexa\\Desktop\\temp\\IT02713280218_0WFw4.xml');
  }

  getPaths(): UntypedFormArray {
    return this.selectXmlFormGroup.get("paths") as UntypedFormArray;
  }

  getPathAt(index: number): string {
    return this.getPaths().controls.at(index).value;
  }

  getFileNameAt(index: number): string {
    const path = this.getPathAt(index);
    return path.split("\\").pop();
  }

  addPath(path: string): void {
    this.getPaths().push(new UntypedFormControl(path));
  }

  deletePath(index: number): void {
    this.getPaths().removeAt(index);
  }

  getPathsAsString(): string[] {
    const paths: string[] = [];
    for (const pathControl of this.getPaths().controls) {
      paths.push(pathControl.value);
    }
    return paths;
  }

  selectXmlClicked() {
    const xmlPromise = this.file.selectFiles(true, "Digitale Rechnungen", [
      "xml",
      "p7m",
    ]);
    xmlPromise.then((fileList) => {
      for (const filePath of fileList) {
        this.addPath(filePath);
      }
    });
  }

  onCancelClick() {
    if (this.loading) return;
    this.dialogRef.close();
  }

  onSubmitClick() {
    if (this.loading) return;

    this.loading = true;
    const xmlFiles: XmlFileStr[] = [];
    for (const filePath of this.getPathsAsString()) {
      const buffer = this.electron.fs.readFileSync(filePath, {
        encoding: "base64",
        flag: "r",
      });
      xmlFiles.push({
        filename: filePath.split("\\").pop(),
        content: buffer,
      });
    }
    console.log(xmlFiles);
    this.api
      .uploadIngoingInvoiceXmlAsStringIngoingInvoiceUploadXmlAsStringPost(
        xmlFiles,
      )
      .pipe(first())
      .subscribe(
        () => {
          this.dialogRef.close(true);
        },
        () => {
          this.snackBar.open(
            "Importieren fehlgeschlagen. Bitte Kalle kontaktieren.",
            "OK",
            {
              duration: 10000,
            },
          );
          this.loading = false;
        },
      );
  }
}
