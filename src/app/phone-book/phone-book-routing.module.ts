import {NgModule} from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {PhoneBookComponent} from './phone-book.component';


const routes: Routes = [
    {
        path: 'phone_book',
        component: PhoneBookComponent,
        data: {
            requiresLogin: true,
            shouldDetach: true
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PhoneBookRoutingModule {



}
