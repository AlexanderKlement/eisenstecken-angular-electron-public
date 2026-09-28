import { Component, inject, OnInit } from "@angular/core";
import { AuthStateService } from "../shared/services/auth-state.service";
import { first } from "rxjs/operators";
import { CustomButton, ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { MatDialog } from "@angular/material/dialog";
import {
  OutgoingInvoiceNumberDialogComponent
} from "./outgoing/outgoing-invoice-number-dialog/outgoing-invoice-number-dialog.component";
import { ImportXmlDialogComponent } from "./ingoing/import-xml-dialog/import-xml-dialog.component";
import { Observable, Subscriber } from "rxjs";
import { FileService } from "../shared/services/file.service";
import { DefaultService, LiabilityService, ScopeEnum } from "../../api/openapi";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { OutgoingComponent } from "./outgoing/outgoing.component";
import { IngoingComponent } from "./ingoing/ingoing.component";
import { ExpensesComponent } from "./expenses/expenses.component";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
  imports: [ToolbarComponent, MatTabGroup, MatTab, OutgoingComponent, IngoingComponent, ExpensesComponent]
})
export default class InvoiceComponent implements OnInit {
  private authService = inject(AuthStateService);
  private dialog = inject(MatDialog);
  private api = inject(DefaultService);
  private liabilityService = inject(LiabilityService);
  private file = inject(FileService);

  outgoingInvoicesAvailable = false;
  expensesAvailable = false;
  ingoingInvoicesAvailable = false;
  updateChildTablesSubscriber: Subscriber<void>;
  updateChildTables$: Observable<void>;

  outgoingInvoicesTabIndex = 0;
  ingoingInvoicesTabIndex = 1;
  expensesInvoicesTabIndex = 2;

  importIngoingInvoicesButton = {
    name: "Eingangsrechnungen importieren",
    navigate: (): void => {
      this.importIngoingInvoiceClicked();
    }
  };
  printUnpaidIngoingInvoices = {
    name: "Unbezahlte drucken",
    navigate: (): void => {
      this.printUnpaidIngoingInvoicesClicked();
    }
  };
  printUnpaidOutgoingInvoices = {
    name: "Unbezahlte drucken",
    navigate: (): void => {
      this.printUnpaidOutgoingInvoicesClicked();
    }
  };
  buttons: CustomButton[] = [];

  ngOnInit(): void {
    this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe(allowed => {
      this.outgoingInvoicesAvailable = allowed;
      this.ingoingInvoicesAvailable = allowed;
      this.expensesAvailable = allowed;
    });
    this.updateChildTables$ = new Observable<void>((subscriber => {
      this.updateChildTablesSubscriber = subscriber;
    }));
    this.pushOutgoingInvoiceButtons();
  }


  selectedTabChanged($event: number) {
    if ($event === this.outgoingInvoicesTabIndex) {
      this.buttons = [];
      this.pushOutgoingInvoiceButtons();
    } else if ($event === this.ingoingInvoicesTabIndex) {
      this.buttons = [];
      this.pushIngoingInvoiceButtons();
    } else if ($event === this.expensesInvoicesTabIndex) {
      this.buttons = [];
      this.pushExpensesButtons();
    }
  }

  private pushOutgoingInvoiceButtons(): void {
    this.buttons.push(this.printUnpaidOutgoingInvoices);
    //this.buttons.push(this.nextRgNumButton);
  }

  private outgoingInvoiceNumberClicked(): void {
    this.dialog.open(OutgoingInvoiceNumberDialogComponent, {
      width: "600px"
    });
  }

  private importIngoingInvoiceClicked() {
    const dialogRef = this.dialog.open(ImportXmlDialogComponent, {
      width: "600px"
    });
    dialogRef.afterClosed().subscribe((refresh) => {
      if (refresh) {
        this.updateChildTablesSubscriber.next();
      }
    });
  }

  private printUnpaidIngoingInvoicesClicked() {
    this.liabilityService.generateOpenLiabilitiesPdf().pipe(first()).subscribe((pdf) => {
      this.file.open(pdf).then();
    });
  }

  private printUnpaidOutgoingInvoicesClicked() {
    this.api.generateUnpaidOutgoingInvoicesPdfOutgoingInvoicePdfUnpaidGet().pipe(first()).subscribe((pdf) => {
      this.file.open(pdf).then();
    });
  }

  private pushIngoingInvoiceButtons() {
    this.buttons.push(this.printUnpaidIngoingInvoices);
    this.buttons.push(this.importIngoingInvoicesButton);
  }

  private pushExpensesButtons() {
    this.buttons.push(this.printUnpaidIngoingInvoices);
  }
}
