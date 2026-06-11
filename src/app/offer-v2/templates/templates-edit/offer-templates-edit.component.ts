import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import OfferContainerComponent from "../../offer-container/offer-container.component";
import { OfferTemplateEntry, OfferTemplateEntryCreatePatch, OfferV2Service } from "../../../../api/openapi";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexLayoutModule
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { AsyncPipe } from "@angular/common";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { BehaviorSubject } from "rxjs";
import { confirmDeleteDialog } from "../../offer.util";
import {
  newEmptyTemplateEntryGroup,
  TemplateEntryEditComponent,
  TemplateEntryGroup
} from "./template-entry-edit/template-entry-edit.component";


type TemplateGroup = {
  name: FormControl<string>;
  description: FormControl<string>;
  structure: FormArray<FormGroup<TemplateEntryGroup>>
}

@Component({
  selector: "app-offer-templates-edit",
  templateUrl: "./offer-templates-edit.component.html",
  styleUrls: ["./offer-templates-edit.component.scss"],
  imports: [
    ReactiveFormsModule,
    OfferContainerComponent,
    DefaultFlexDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    AsyncPipe,
    MatProgressSpinner,
    FlexLayoutModule,
    TemplateEntryEditComponent
  ]
})
export default class OfferTemplatesEditComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private offerService = inject(OfferV2Service);
  subTitle = "Template erstellen";
  templateId: number;
  private snackBar = inject(MatSnackBar);
  templateGroup: FormGroup<TemplateGroup> = new FormGroup({
    name: new FormControl(""),
    description: new FormControl(""),
    structure: new FormArray([])
  });

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {
        this.templateId = parseInt(params.id, 10);
      } catch {
        // is createMode
      }
      this.initData(params.method);
    });
  }

  initData(method?: string) {
    if (this.templateId) {
      this.offerService.getOfferTemplateOfferV2TemplateTemplateIdGet(this.templateId).pipe(take(1)).subscribe(
        {
          next: data => {
            function convertRecursive(s: OfferTemplateEntry[]): FormArray<FormGroup<TemplateEntryGroup>> {
              return new FormArray(
                s.map(entry => new FormGroup<TemplateEntryGroup>({
                  id: new FormControl(entry.id),
                  elementId: new FormControl(entry.element.id),
                  elementName: new FormControl(entry.element.name),
                  elementType: new FormControl(entry.element.elementType.name),
                  children: convertRecursive(entry.children)
                }))
              );
            }

            this.templateGroup = new FormGroup({
              name: new FormControl(data.name),
              description: new FormControl(data.description),
              structure: convertRecursive(data.structure)
            });
          },
          error: error => {
            this.snackBar.open("Das Template konnte nicht gefunden werden: " + error, "Ok", { duration: 8000 });
            this.templateId = undefined;
            this.initData();
          }
        }
      );
      this.subTitle = "Template bearbeiten";
      if (method === "copy") {
        this.templateId = undefined;
        this.subTitle = "Template erstellen";
      } else if (method === "delete") {
        this.onDelete();
      }
    } else {
      this.subTitle = "Template erstellen";
    }
  }

  onDelete() {
    if (this.templateId) {
      this.loadingSubject.next(true);
      confirmDeleteDialog(this.templateId, this.dialog, "Template", this.offerService.deleteOfferTemplateOfferV2TemplateTemplateIdDelete,
        {
          loadData: this.subscription.next
        }, this.snackBar);
    }
  }

  onSave() {
    this.loadingSubject.next(true);
    let missingElement = false;

    function convertRecursive(arr: FormArray<FormGroup<TemplateEntryGroup>>): OfferTemplateEntryCreatePatch[] {
      return arr.controls.map<OfferTemplateEntryCreatePatch>(grp => {
        const element = grp.get("elementId").value;
        if (element === -1) {
          missingElement = true;
        }
        return {
          elementId: element,
          children: convertRecursive(grp.controls.children)
        };
      });
    }

    const structure = convertRecursive(this.templateGroup.controls.structure);
    if (missingElement) {
      this.snackBar.open("Für jeden Eintrag muss ein Element ausgewählt werden: ", "Ok", { duration: 8000 });
      this.loadingSubject.next(false);
      return;
    }
    if (!this.templateGroup.valid) {
      this.snackBar.open("Bitte alle Felder kontrollieren: ", "Ok", { duration: 8000 });
      this.loadingSubject.next(false);
      return;
    }
    if (this.templateId) {
      this.offerService.patchOfferTemplateOfferV2TemplateTemplateIdPost(this.templateId, {
        name: this.templateGroup.get("name").value,
        description: this.templateGroup.get("description").value,
        structure
      }).pipe(take(1)).subscribe(this.subscription);
    } else {
      this.offerService.createOfferTemplateOfferV2TemplatePut({
        name: this.templateGroup.get("name").value,
        description: this.templateGroup.get("description").value,
        structure
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }


  onAddStructure() {
    this.templateGroup.controls.structure.push(newEmptyTemplateEntryGroup());
  }

  onAddNeighbour(index: number) {
    this.templateGroup.controls.structure.insert(index + 1, newEmptyTemplateEntryGroup());
  }

  onDeleteElem(index: number) {
    this.templateGroup.controls.structure.removeAt(index);
  }

  subscription = {
    next: () => {
      this.loadingSubject.next(false);
      this.router.navigateByUrl("/offer_v2/templates").then();
    },
    error: (error: any) => {
      this.loadingSubject.next(false);
      this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
    }
  };

}
