import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationService} from "../../../shared/services/navigation.service";

@Component({
    selector: 'app-redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

    constructor(private router: Router, private navigation: NavigationService) {
    }

    ngOnInit(): void {
        this.navigation.removeLastUrl();
        this.router.navigateByUrl("/mobile/hours", {replaceUrl: true});
    }

}
