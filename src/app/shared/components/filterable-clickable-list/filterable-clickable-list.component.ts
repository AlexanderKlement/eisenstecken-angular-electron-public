import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import {
  ListItem,
  SupportedListElements,
} from './filterable-clickable-list.types';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { debounceTime, first, startWith, switchMap } from 'rxjs/operators';
import { DefaultService } from '../../../../client/api';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-filterable-clickable-list',
  standalone: true,
  templateUrl: './filterable-clickable-list.component.html',
  styleUrls: ['./filterable-clickable-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    NgForOf,
    AsyncPipe,
  ],
})
export class FilterableClickableListComponent implements OnInit, OnDestroy {
  @Input() listElements$: Observable<ListItem[]>;
  @Input() name: string;
  @Output() clickEventEmitter = new EventEmitter<ListItem>();
  @Input() toListUnCollapse?: string;

  loading = true;
  listElements: ListItem[];
  search: UntypedFormControl;
  listElementControl: UntypedFormControl;
  search$: Observable<ListItem[]>;
  subscription: Subscription;

  constructor(private api: DefaultService) {}

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.listElements = [];
    this.search = new UntypedFormControl('');
    this.subscription.add(
      this.listElements$.subscribe(listElements => {
        this.listElements = listElements;
        this.search.setValue('');
      })
    );
    this.listElementControl = new UntypedFormControl();
    this.search$ = this.search.valueChanges.pipe(
      startWith(null), //TODO: replace this deprecated element => someday we'll have to update
      debounceTime(200),
      switchMap((filterString: string) => {
        if (!filterString) {
          return of(this.listElements);
        }
        filterString = filterString.toLowerCase();
        return of(
          this.listElements.filter(
            element => element.name.toLowerCase().indexOf(filterString) >= 0
          )
        );
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  selectionChange($event: any): void {
    this.clickEventEmitter.emit($event.value);
  }

  toggleFavoriteSupplier(listElement: ListItem) {
    this.api
      .toggleSupplierFavoriteSupplierFavoriteSupplierIdPost(listElement.item.id)
      .pipe(first())
      .subscribe(supplier => {
        if ('favorite' in listElement.item) {
          listElement.item.favorite = supplier.favorite;
        }
      });
  }

  isListItemFavorite(listItem: SupportedListElements): boolean {
    if ('favorite' in listItem) {
      return listItem.favorite;
    }
    return false;
  }
}
