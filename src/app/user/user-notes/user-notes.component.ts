import { Component, OnInit } from "@angular/core";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { first } from "rxjs/operators";
import { AuthStateService } from "../../shared/services/auth-state.service";
import { CustomButton } from "../../shared/components/toolbar/toolbar.component";
import { MatDialog } from "@angular/material/dialog";
import { DefaultService, UserNote, ScopeEnum } from "../../../api/openapi";
import { TableBuilderComponent } from "../../shared/components/table-builder/table-builder.component";
import { MatButton } from "@angular/material/button";
import { UserNotesEditDialogComponent } from "./user-notes-edit-dialog/user-notes-edit-dialog.component";

@Component({
  selector: "app-user-notes",
  templateUrl: "./user-notes.component.html",
  styleUrls: ["./user-notes.component.scss"],
  imports: [TableBuilderComponent, MatButton]
})
export class UserNotesComponent implements OnInit {
  userNoteDataSource: TableDataSource<UserNote, DefaultService>;

  public buttons: CustomButton[] = [];
  showNewButton = false;

  constructor(private api: DefaultService, private authService: AuthStateService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userNoteDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) => api.readUserNotesUserNoteGet(skip, limit),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                name: dataSource.name,
                body: dataSource.body.substring(0, 40)
              },
              route: () => {
                this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe((allowed) => {
                  if (allowed) {
                    this.openDialog(dataSource.id);
                  }
                });
              }
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Name" },
        { name: "body", headerName: "Inhalt" }
      ],
      (api) => api.readClientCountClientCountGet()
    );
    this.userNoteDataSource.loadData();

    this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe(allowed => {
      if (allowed) {
        this.showNewButton = true;
      }
    });
  }


  openDialog(id: number): void {
    const dialogRef = this.dialog.open(UserNotesEditDialogComponent, {
      width: "1000px",
      data: { id }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.userNoteDataSource.loadData();
    });
  }

}
