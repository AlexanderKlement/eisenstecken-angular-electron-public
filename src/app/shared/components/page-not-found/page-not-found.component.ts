import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private navigation: NavigationService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  homeClicked() {
    this.navigation.home();
  }
}
