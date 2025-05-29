import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Country, DefaultService } from '../../../../client/api';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/select';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatFormField,
    MatInput,
    MatFormField,
    MatOption,
  ],
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit {
  @Input() address: UntypedFormGroup;
  countryOptions$: Observable<Country[]>;

  constructor(private api: DefaultService) {}

  ngOnInit(): void {
    this.countryOptions$ = this.api.readCountriesAddressCountriesGet();
  }
}
