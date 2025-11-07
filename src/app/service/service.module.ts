import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ServiceRoutingModule } from "./service-routing.module";
import { ServiceComponent } from "./service.component";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    imports: [
        CommonModule,
        ServiceRoutingModule,
        SharedModule,
        ServiceComponent
    ]
})
export class ServiceModule { }
