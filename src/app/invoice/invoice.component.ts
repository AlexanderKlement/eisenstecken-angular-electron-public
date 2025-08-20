import { Component, ComponentRef, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { first } from "rxjs/operators";
import { CustomButton } from "../shared/components/toolbar/toolbar.component";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import {
  OutgoingInvoiceNumberDialogComponent,
} from "./outgoing/outgoing-invoice-number-dialog/outgoing-invoice-number-dialog.component";
import { ImportXmlDialogComponent } from "./ingoing/import-xml-dialog/import-xml-dialog.component";
import { Observable, Subscriber } from "rxjs";
import { ConfirmDialogComponent } from "../shared/components/confirm-dialog/confirm-dialog.component";
import { FileService } from "../shared/services/file.service";
import { ActivatedRoute } from "@angular/router";
import { DefaultService } from "../../api/openapi";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  outgoingInvoicesAvailable = false;
  ingoingInvoicesAvailable = false;
  updateChildTablesSubscriber: Subscriber<void>;
  updateChildTables$: Observable<void>;

  outgoingInvoicesTabIndex = 0;
  ingoingInvoicesTabIndex = 1;

  public $refresh: Observable<void>;
  nextRgNumButton = {
    name: "Nächste Rechnungsnummer setzen",
    navigate: (): void => {
      this.outgoingInvoiceNumberClicked();
    },
  };
  importIngoingInvoicesButton = {
    name: "Eingangsrechnungen importieren",
    navigate: (): void => {
      this.importIngoingInvoiceClicked();
    },
  };
  printUnpaidIngoingInvoices = {
    name: "Unbezahlte drucken",
    navigate: (): void => {
      this.printUnpaidIngoingInvoicesClicked();
    },
  };
  printUnpaidOutgoingInvoices = {
    name: "Unbezahlte drucken",
    navigate: (): void => {
      this.printUnpaidOutgoingInvoicesClicked();
    },
  };
  buttons: CustomButton[] = [];
  private $refreshSubscriber: Subscriber<void>;

  constructor(private authService: AuthService, private dialog: MatDialog, private api: DefaultService, private file: FileService) {
  }

  ngOnInit(): void {
    this.authService.currentUserHasRight("outgoing_invoices:all").pipe(first()).subscribe(allowed => {
      this.outgoingInvoicesAvailable = allowed;
    });
    this.authService.currentUserHasRight("ingoing_invoices:all").pipe(first()).subscribe(allowed => {
      this.ingoingInvoicesAvailable = allowed;
    });
    this.updateChildTables$ = new Observable<void>((subscriber => {
      this.updateChildTablesSubscriber = subscriber;
    }));
    this.pushOutgoingInvoiceButtons();
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber => {
      this.$refreshSubscriber = subscriber;
    }));
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  selectedTabChanged($event: number) {
    if ($event === this.outgoingInvoicesTabIndex) {
      this.buttons = [];
      this.pushOutgoingInvoiceButtons();
    } else if ($event === this.ingoingInvoicesTabIndex) {
      this.buttons = [];
      this.pushIngoingInvoiceButtons();
    }
  }

  private pushOutgoingInvoiceButtons(): void {
    this.buttons.push(this.printUnpaidOutgoingInvoices);
    //this.buttons.push(this.nextRgNumButton);
  }

  private outgoingInvoiceNumberClicked(): void {
    this.dialog.open(OutgoingInvoiceNumberDialogComponent, {
      width: "600px",
    });
  }

  private importIngoingInvoiceClicked() {
    const dialogRef = this.dialog.open(ImportXmlDialogComponent, {
      width: "600px",
    });
    dialogRef.afterClosed().subscribe((refresh) => {
      if (refresh) {
        this.updateChildTablesSubscriber.next();
      }
    });
  }

  private printUnpaidIngoingInvoicesClicked() {
    this.api.generateUnpaidIngoingInvoicesPdfIngoingInvoicePdfUnpaidGet().pipe(first()).subscribe((pdf) => {
      this.file.open(pdf);
    });
  }

  private printUnpaidOutgoingInvoicesClicked() {
    this.api.generateUnpaidOutgoingInvoicesPdfOutgoingInvoicePdfUnpaidGet().pipe(first()).subscribe((pdf) => {
      this.file.open(pdf);
    });
  }

  private pushIngoingInvoiceButtons() {
    this.buttons.push(this.printUnpaidIngoingInvoices);
    this.buttons.push(this.importIngoingInvoicesButton);
  }
}
