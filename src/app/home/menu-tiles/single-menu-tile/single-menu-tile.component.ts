import {Component, Input, OnInit} from "@angular/core";
import {MenuTileDetail} from "../menu-tile.settings";
import {Router} from "@angular/router";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective, FlexModule, DefaultFlexDirective } from "ng-flex-layout";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-single-menu-tile',
    templateUrl: './single-menu-tile.component.html',
    styleUrls: ['./single-menu-tile.component.scss'],
    imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, FlexModule, DefaultFlexDirective, MatIcon]
})
export class SingleMenuTileComponent implements OnInit {

  @Input() tile: MenuTileDetail;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onTileClicked(destination: string): void {
    this.router.navigateByUrl(destination);
  }


}
