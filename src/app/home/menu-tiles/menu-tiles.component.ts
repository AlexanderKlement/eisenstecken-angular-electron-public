import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { matchRightsToMenuTiles, MenuTileDetail } from './menu-tile.settings';
import { DefaultService } from '../../../api/openapi';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { SingleMenuTileComponent } from './single-menu-tile/single-menu-tile.component';
import { FlexModule } from 'ng-flex-layout';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-menu-tiles',
    templateUrl: './menu-tiles.component.html',
    styleUrls: ['./menu-tiles.component.scss'],
    imports: [MatGridList, MatGridTile, SingleMenuTileComponent, FlexModule, AsyncPipe]
})
export class MenuTilesComponent implements OnInit {

  menuTiles$: Observable<MenuTileDetail[]>;

  now: number;

  constructor(private api: DefaultService) {
    this.now = ((new Date()).getMonth() * 100) + (new Date()).getDate();
  }

  ngOnInit(): void {
    const userObservable = this.api.readUsersMeUsersMeGet();
    this.menuTiles$ = userObservable.pipe(
      map(user => matchRightsToMenuTiles(user.rights)),
    );
  }
}
