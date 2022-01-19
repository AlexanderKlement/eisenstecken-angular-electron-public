import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
    constructor(private navigation: NavigationService) {
    }

    ngOnInit(): void {
        console.log('PageNotFoundComponent INIT');
    }

    homeClicked() {
        this.navigation.home();
    }
}
