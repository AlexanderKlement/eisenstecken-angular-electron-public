import { Component, Input, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Country, DefaultService } from '../../../../api/openapi';
import { FlexModule, DefaultLayoutDirective, DefaultLayoutAlignDirective } from 'ng-flex-layout';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-address-form',
    templateUrl: './address-form.component.html',
    styleUrls: ['./address-form.component.scss'],
    imports: [FormsModule, FlexModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatSelect, MatOption, AsyncPipe]
})
export class AddressFormComponent implements OnInit {
  private api = inject(DefaultService);


  @Input() address: UntypedFormGroup;
  countryOptions$: Observable<Country[]>;

  ngOnInit(): void {
    this.countryOptions$ = this.api.readCountriesAddressCountriesGet();
  }
}
