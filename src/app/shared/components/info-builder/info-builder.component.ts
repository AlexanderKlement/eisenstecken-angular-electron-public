import {Component, Input, OnInit} from '@angular/core';
import {InfoDataSource} from './info-builder.datasource';
import {DataSourceClass} from '../../types';
import {DefaultService} from 'eisenstecken-openapi-angular-library';
import {LockService} from '../../services/lock.service';

@Component({
  selector: 'app-info-builder',
  templateUrl: './info-builder.component.html',
  styleUrls: ['./info-builder.component.scss']
})

export class InfoBuilderComponent<T extends DataSourceClass> implements OnInit {

  @Input() dataSource: InfoDataSource<T>;

  constructor(private api: DefaultService, private locker: LockService) {}

  ngOnInit(): void {}

  getPropertyOfObject(data: T, property: string): string{
    const propertyArray = property.split('.');
    for(const singleProperty of propertyArray){
      data = data[singleProperty];
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
