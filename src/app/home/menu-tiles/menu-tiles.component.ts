import { Component, OnInit, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { matchScopesToMenuTiles, MenuTileDetail } from "./menu-tile.settings";
import { DefaultService } from "../../../api/openapi";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { SingleMenuTileComponent } from "./single-menu-tile/single-menu-tile.component";
import { FlexModule } from "ng-flex-layout";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'app-menu-tiles',
    templateUrl: './menu-tiles.component.html',
    styleUrls: ['./menu-tiles.component.scss'],
    imports: [MatGridList, MatGridTile, SingleMenuTileComponent, FlexModule, AsyncPipe]
})
export class MenuTilesComponent implements OnInit {
  private api = inject(DefaultService);


  menuTiles$: Observable<MenuTileDetail[]>;

  now: number;

  constructor() {
    this.now = ((new Date()).getMonth() * 100) + (new Date()).getDate();
  }

  ngOnInit(): void {
    const userObservable = this.api.readUsersMeUsersMeGet();
    this.menuTiles$ = userObservable.pipe(
      map(user => matchScopesToMenuTiles(user.scopes)),
    );
  }
}
