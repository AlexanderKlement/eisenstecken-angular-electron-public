import { OfferFieldEnum } from "../../api/openapi";
import { TableButton } from "../shared/components/table-builder/table-builder.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../shared/components/confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";

export function fieldTypeToString(type: OfferFieldEnum | string) {
  switch (type) {
    case OfferFieldEnum.String:
      return "Text";
    case OfferFieldEnum.Text:
      return "Mehrzeiliger Text";
    case OfferFieldEnum.Numeric:
      return "Zahl";
    case OfferFieldEnum.Calculation:
      return "Berechnung";
    case OfferFieldEnum.Select:
      return "Auswahl";
    case OfferFieldEnum.Offertext:
      return "Angebotstext";
    default:
      return type;
  }
}

export function fieldTypeToColor(type: OfferFieldEnum | string) {
  switch (type) {
    case OfferFieldEnum.String:
      return "#E6E6E6";
    case OfferFieldEnum.Text:
      return "#E6E6E6";
    case OfferFieldEnum.Numeric:
      return "#a1b1ca";
    case OfferFieldEnum.Calculation:
      return "#E8F9D2";
    case OfferFieldEnum.Select:
      return "#FCDCCF";
    case OfferFieldEnum.Offertext:
      return "#E6E6E6";
    default:
      return "#E6E6E6";
  }
}

export function fieldTypeToTextColor(type: OfferFieldEnum) {
  switch (type) {
    case OfferFieldEnum.String:
      return "#000000";
    case OfferFieldEnum.Text:
      return "#000000";
    case OfferFieldEnum.Numeric:
      return "#072a61";
    case OfferFieldEnum.Calculation:
      return "#4D7C0F";
    case OfferFieldEnum.Select:
      return "#C2410C";
    case OfferFieldEnum.Offertext:
      return "#000000";
  }
}

export function listEditButton(navigate: (id: number) => void): TableButton {
  return {
    name: () => ({ icon: "edit" }),
    color: () => "accent",
    selectedField: "",
    class: () => "",
    navigate: (_, id) => {
      navigate(id);
    }
  };
}

export function listDeleteButton<T extends { loadData: () => void }>(
  dialog: MatDialog,
  name: string,
  deleteFunc: (id: number) => Observable<boolean>,
  dataSourceOrCallback: T,
  snackBar: MatSnackBar): TableButton {
  return {
    name: () => ({ icon: "delete" }),
    color: () => "warn",
    selectedField: "",
    class: () => "",
    navigate: (_, id) => {
      confirmDeleteDialog(id, dialog, name, deleteFunc, dataSourceOrCallback, snackBar);
    }
  };
}

export function confirmDeleteDialog<T extends { loadData: () => void }>(id: number,
                                                                        dialog: MatDialog,
                                                                        name: string,
                                                                        deleteFunc: (id: number) => Observable<boolean>,
                                                                        dataSourceOrCallback: T,
                                                                        snackBar: MatSnackBar) {
  const dialogRef = dialog.open(ConfirmDialogComponent, {
    width: "400px",
    data: {
      title: `${name} löschen?`,
      text: `${name} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!`
    }
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      deleteFunc(id).pipe(take(1))
        .subscribe({
          next: () => {
            dataSourceOrCallback.loadData();
          },
          error: (error) => {
            snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
          }
        });
    }
  });
}

export function headerNewButton(name: string, onPress: () => void): TableButton {
  return {
    name: () => name,
    color: () => "primary",
    selectedField: "",
    navigate: () => {
      onPress();
    },
    class: () => ""
  };
}
