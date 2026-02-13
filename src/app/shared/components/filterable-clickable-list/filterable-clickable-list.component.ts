import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Observable, of, Subscription } from "rxjs";
import {
  ListItem,
  SupportedListElements,
} from "./filterable-clickable-list.types";
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { debounceTime, first, startWith, switchMap } from "rxjs/operators";
import { DefaultService } from "../../../../api/openapi";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatSelectionList, MatListOption } from "@angular/material/list";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
} from "ng-flex-layout";
import { AsyncPipe } from "@angular/common";
import { CircleIconButtonComponent } from "../circle-icon-button/circle-icon-button.component";

@Component({
  selector: "app-filterable-clickable-list",
  templateUrl: "./filterable-clickable-list.component.html",
  styleUrls: ["./filterable-clickable-list.component.scss"],
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatSelectionList,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatListOption,
    AsyncPipe,
    CircleIconButtonComponent,
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
    this.search = new UntypedFormControl("");
    this.subscription.add(
      this.listElements$.subscribe((listElements) => {
        this.listElements = listElements;
        this.search.setValue("");
      }),
    );
    this.listElementControl = new UntypedFormControl();
    this.search$ = this.search.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      switchMap((filterString: string) => {
        if (!filterString) {
          return of(this.listElements);
        }
        filterString = filterString.toLowerCase();
        return of(
          this.listElements.filter(
            (element) => element.searchText.toLowerCase().indexOf(filterString) >= 0,
          ),
        );
      }),
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
      .subscribe((supplier) => {
        if ("favorite" in listElement.item) {
          listElement.item.favorite = supplier.favorite;
        }
      });
  }

  isListItemFavorite(listItem: SupportedListElements): boolean {
    if ("favorite" in listItem) {
      return listItem.favorite;
    }
    return false;
  }
}
