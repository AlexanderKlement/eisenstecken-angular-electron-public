import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Country, DefaultService } from '../../../../client/api';

@Component({
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
