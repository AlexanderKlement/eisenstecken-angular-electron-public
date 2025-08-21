import {Component, OnInit} from "@angular/core";
import {CustomButton} from "../shared/components/toolbar/toolbar.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-mobile-app',
    templateUrl: './mobile-app.component.html',
    styleUrls: ['./mobile-app.component.scss'],
    standalone: false
})
export class MobileAppComponent implements OnInit {
    buttons: CustomButton[] = [];

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    hourButtonClicked() {
        this.router.navigateByUrl("mobile/hours");
    }
}
