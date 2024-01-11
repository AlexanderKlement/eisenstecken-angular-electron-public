import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../../../../client/api';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor(private api: DefaultService) {}

  ngOnInit(): void {}
}
