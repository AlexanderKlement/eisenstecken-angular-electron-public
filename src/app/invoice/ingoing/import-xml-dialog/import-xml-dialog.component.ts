import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {DefaultService, XmlFileStr} from 'eisenstecken-openapi-angular-library';
import {FileService} from '../../../shared/services/file.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ElectronService} from '../../../core/services';
import {first} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-import-xml-dialog',
    templateUrl: './import-xml-dialog.component.html',
    styleUrls: ['./import-xml-dialog.component.scss']
})
export class ImportXmlDialogComponent implements OnInit {
    selectXmlFormGroup: FormGroup;
    title: 'Digitale Rechnungen auswählen';
    loading = false;

    constructor(private api: DefaultService, private file: FileService, private electron: ElectronService,
                public dialogRef: MatDialogRef<ImportXmlDialogComponent>, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.selectXmlFormGroup = new FormGroup({
            paths: new FormArray([]),
        });
        //this.addPath('C:\\Users\\alexa\\Desktop\\temp\\IT02713280218_0WFw4.xml');
    }

    getPaths(): FormArray {
        return this.selectXmlFormGroup.get('paths') as FormArray;
    }

    getPathAt(index: number): string {
        return this.getPaths().controls.at(index).value;
    }


    getFileNameAt(index: number): string {
        const path = this.getPathAt(index);
        return path.split('\\').pop();
    }

    addPath(path: string): void {
        this.getPaths().push(new FormControl(path));
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
        const xmlPromise = this.file.selectFiles(true, 'Digitale Rechnungen', ['xml', 'p7m']);
        xmlPromise.then((fileList) => {
            for (const filePath of fileList) {
                this.addPath(filePath);
            }
        });
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    onSubmitClick() {
        this.loading = true;
        const xmlFiles: XmlFileStr[] = [];
        for (const filePath of this.getPathsAsString()) {
            const buffer = this.electron.fs.readFileSync(filePath, {encoding: 'base64', flag: 'r'});
            xmlFiles.push({
                filename: filePath.split('\\').pop(),
                content: buffer
            });
        }
        console.log(xmlFiles);
        this.api.uploadIngoingInvoiceXmlAsStringIngoingInvoiceUploadXmlAsStringPost(xmlFiles).pipe(first())
            .subscribe(() => {
                this.dialogRef.close(true);
            }, () => {
                this.snackBar.open('Importieren fehlgeschlagen. Bitte Kalle kontaktieren.', 'OK', {
                    duration: 10000
                });
                this.loading = false;
            });
    }
}
