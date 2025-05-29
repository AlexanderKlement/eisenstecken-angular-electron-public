import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [MatProgressSpinner, NgIf],
})
export class LoadingComponent implements OnInit {
  @Input() loading: boolean;

  constructor() {}

  ngOnInit(): void {
    console.log(
      'LoadingComponent initialized with loading state:',
      this.loading
    );
  }
}
