import { Component, Input, OnInit } from '@angular/core';
import { InfoDataSource } from './info-builder.datasource';
import { DataSourceClass } from '../../types';
import { LockService } from '../../services/lock.service';
import { DefaultService } from '../../../../client/api';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-info-builder',
  templateUrl: './info-builder.component.html',
  styleUrls: ['./info-builder.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    NgIf,
    AsyncPipe,
    MatInput,
    MatFormField,
    NgForOf,
  ],
})
export class InfoBuilderComponent<T extends DataSourceClass> implements OnInit {
  @Input() dataSource: InfoDataSource<T>;

  constructor(
    private api: DefaultService,
    private locker: LockService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  getPropertyOfObject(data: T, property: string): string {
    const propertyArray = property.split('.');
    for (const singleProperty of propertyArray) {
      if (singleProperty.includes('[')) {
        const index = parseInt(singleProperty.split('[')[1].split(']')[0], 10);
        const arrayProperty = singleProperty.split('[')[0];
        if (
          arrayProperty in data &&
          Array.isArray(data[arrayProperty]) &&
          data[arrayProperty].length > index
        ) {
          data = data[arrayProperty][index];
        } else {
          return '';
        }
      } else {
        data = data[singleProperty];
      }
    }
    return data.toString();
  }

  editButtonClicked(): void {
    this.locker.getLockAndTryNavigate(
      this.dataSource.lock$,
      this.dataSource.lockObservable,
      this.dataSource.unlockObservable,
      this.dataSource.navigationTarget
    );
  }
}
