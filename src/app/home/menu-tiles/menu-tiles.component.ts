import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { matchRightsToMenuTiles, MenuTileDetail } from './menu-tile.settings';
import { DefaultService } from '../../../client/api';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { SingleMenuTileComponent } from './single-menu-tile/single-menu-tile.component';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-menu-tiles',
  templateUrl: './menu-tiles.component.html',
  styleUrls: ['./menu-tiles.component.scss'],
  imports: [
    MatGridTile,
    MatGridList,
    SingleMenuTileComponent,
    NgForOf,
    AsyncPipe,
  ],
})
export class MenuTilesComponent implements OnInit {
  menuTiles$: Observable<MenuTileDetail[]>;

  now: number;

  constructor(private api: DefaultService) {
    this.now = new Date().getMonth() * 100 + new Date().getDate();
  }

  ngOnInit(): void {
    const userObservable = this.api.readUsersMeUsersMeGet();
    this.menuTiles$ = userObservable.pipe(
      map(user => matchRightsToMenuTiles(user.rights))
    );
  }
}
