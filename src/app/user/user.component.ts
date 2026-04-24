import { Component, OnInit } from "@angular/core";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import { Router } from "@angular/router";
import { LockService } from "../shared/services/lock.service";
import { CustomButton, ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { AuthStateService } from "../shared/services/auth-state.service";
import { catchError, first } from "rxjs/operators";
import { DefaultService, ScopeEnum, User } from "../../api/openapi";
import { TableBuilderComponent } from "../shared/components/table-builder/table-builder.component";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { InfoPageSettingsComponent } from "../settings/info-page-settings/info-page-settings.component";
import { ipcRenderer } from "electron";

import { ElectronService } from "../core/services";
import { of } from "rxjs";


@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
  imports: [ToolbarComponent, TableBuilderComponent, MatTabGroup, MatTab, InfoPageSettingsComponent]
})
export class UserComponent implements OnInit {
  userDataSource: TableDataSource<User, DefaultService>;
  public buttons: CustomButton[] = [];

  constructor(
    private api: DefaultService,
    private locker: LockService,
    private router: Router,
    private authService: AuthStateService,
    private electronService: ElectronService
  ) {
  }

  ngOnInit(): void {
    this.userDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readUsersUsersGet(skip, filter, limit),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              fullname: dataSource.secondname + " " + dataSource.firstname,
              hours: dataSource.id, // TODO
              position: dataSource.position,
              email: dataSource.email
            },
            route: () => {
              this.authService
                .currentUserHasScope(ScopeEnum.Office)
                .pipe(first())
                .subscribe((allowed) => {
                  if (allowed) {
                    this.locker.getLockAndTryNavigate(
                      this.api.islockedUserUsersIslockedUserIdGet(
                        dataSource.id
                      ),
                      this.api.lockUserUsersLockUserIdGet(dataSource.id),
                      this.api.unlockUserUsersUnlockUserIdGet(dataSource.id),
                      "/user/edit/" + dataSource.id.toString()
                    );
                  }
                });
            }
          });
        });
        return rows;
      },
      [
        { name: "fullname", sortable: true, headerName: "Name" },
        { name: "position", sortable: false, headerName: "Posizion" },
        { name: "email", sortable: false, headerName: "E-Mail" }, {
        name: "hours",
        sortable: true,
        headerName: "Gesamte Arbeitszeit bisher"
      }],
      (api) => api.readUserCountUsersCountGet(),
      [],
      "fullname",
      "desc"
    );
    this.userDataSource.loadData();
    this.buttons.push({
      name: "Bekleidungsgrößen exportieren",
      navigate: (): void => {
        const rows = [["Mitarbeiter", "Pullower", "T-Shirt", "Hose", "Schugröße", "Modell Schuhe", "Werkzeuggurt", "Gehörschutz"]];
        const now = new Date();
        const date = now.getFullYear() +
          "-" +
          (now.getMonth() + 1).toString(10).padStart(2, "0") +
          "-" +
          now.getDate().toString(10).padStart(2, "0");
        const title = `bekleidungsgrößen_${date}.csv`;
        const filters = [{
          name: "Excel",
          extensions: ["csv"]
        }];
        this.api.readUsersUsersGet().pipe(catchError(() => of([]))).subscribe({
          next: (data: User[]) => {
            data.map(u => ({
              ...u,
              fullname: u.secondname + " " + u.firstname
            })).sort(
              (a, b) => a.fullname.localeCompare(b.fullname)
            ).forEach((user: User) => {
              rows.push([
                user.fullname,
                "0",// TODO
                "0",
                "0",
                "0",
                "0",
                "0",
                "0"
              ]);
            });
            const content = rows.map(row => row.join(";")).join("\n");
            this.electronService.ipcRenderer.send("save_file", { content, title, filters });
          },
          error: err => {
            console.warn(err);
          }
        });
      }
    });
    this.authService
      .currentUserHasScope(ScopeEnum.Office)
      .pipe(first())
      .subscribe((allowed) => {
        if (allowed) {
          this.buttons.push({
            name: "Neuer Benutzer",
            navigate: (): void => {
              this.router.navigateByUrl("/user/edit/new");
            }
          });
        }
      });
  }
}
