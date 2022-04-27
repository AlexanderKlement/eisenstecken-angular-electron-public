import {Component, HostListener, Input, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';

export interface CustomButton {
    name: string;
    navigate: VoidFunction;
}

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() buttonList?: CustomButton[];
    @Input() beforeBackFunction?: (afterBackFunction: VoidFunction) => void;
    @Input() title = '';
    @Input() showBackButton =  true;
    @Input() catchBackButton = true;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(private navigation: NavigationService) {
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            console.log('Escape pressed');
            this.navigation.back();
        }
    }

    @HostListener('window:popstate', ['$event']) onBrowserBackBtnClose(event: Event): void {
        if(this.catchBackButton) {
            event.preventDefault();
            this.navigation.backEvent();
            this.backClicked();
        }
    }

    ngOnInit(): void {
    }

    backClicked(): void {
        if (this.beforeBackFunction != null) {
            this.beforeBackFunction(() => {
                this.navigation.back();
            });
        } else {
            this.navigation.back();
        }
    }

    homeClicked(): void {
        this.navigation.home();
    }

    buttonClicked(button: CustomButton): void {
        console.log('Toolbar: ' + button.name + ' clicked');
        button.navigate();
    }

}
