import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { first, map, tap } from "rxjs/operators";
import { AuthService } from "../../shared/services/auth.service";
import moment from "moment";
import { User, Lock, Job, JobUpdate, SubJobCreate, DefaultService, JobCreate } from "../../../api/openapi";

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss'],
  standalone: false,
})
export class JobEditComponent extends BaseEditComponent<Job> implements OnInit, OnDestroy {

  clientId: number;
  subMode = false;
  mainJobId: number;

  jobGroup: UntypedFormGroup;
  submitted = false;

  navigationTarget = "job";

  addressDeactivated = true;
  title = "Auftrag: Bearbeiten";

  users$: Observable<User[]>;

  constructor(api: DefaultService, router: Router, route: ActivatedRoute, private authService: AuthService) {
    super(api, router, route);
  }


  lockFunction = (api: DefaultService, id: number): Observable<Lock> => api.islockedJobJobIslockedJobIdGet(id);
  dataFunction = (api: DefaultService, id: number): Observable<Job> => api.readJobJobJobIdGet(id);
  unlockFunction = (api: DefaultService, id: number): Observable<boolean> => api.unlockJobJobUnlockJobIdPost(id);


  ngOnInit(): void {
    super.ngOnInit();
    this.initJobGroup();
    this.users$ = this.api.readUsersUsersGet(0, "", 100, true).pipe(map((users) => users.filter(user => user.office)));
    if (this.createMode) {
      this.routeParams.subscribe((params) => {
        if (params.sub !== undefined && params.sub === "sub") {
          this.subMode = true;
          this.mainJobId = parseInt(params.job_id, 10);
          if (isNaN(this.mainJobId)) {
            console.error("JobEdit: Cannot determine mainJob id");
            this.router.navigateByUrl(this.navigationTarget);
          }
        } else {
          this.authService.getCurrentUser().pipe(first()).subscribe((user) => {
            this.jobGroup.get("responsible_id").setValue(user.id);
          });
          this.clientId = parseInt(params.client_id, 10);
          if (isNaN(this.clientId)) {
            console.error("JobEdit: Cannot determine client id");
            this.router.navigateByUrl(this.navigationTarget);
          }
        }
      });
    }
    if (this.createMode && !this.subMode) {
      this.title = "Auftrag: Erstellen";
    }
    if (this.subMode) {
      this.title = this.createMode ? "Unterauftrag: Erstellen" : "Unterauftrag: Bearbeiten";
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  initJobGroup(): void {
    if (!this.subMode) {
      this.jobGroup = new UntypedFormGroup({
        name: new UntypedFormControl(""),
        description: new UntypedFormControl(""),
        minijob: new UntypedFormControl(false),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        responsible_id: new UntypedFormControl(1),
        year: new UntypedFormControl(moment().year()),
        address: new UntypedFormGroup({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          street_number: new UntypedFormControl(""),
          city: new UntypedFormControl(""),
          cap: new UntypedFormControl(""),
          country: new UntypedFormControl("IT"),
        }),
        completion: new UntypedFormControl(""),
      });
    } else {
      this.jobGroup = new UntypedFormGroup({
        name: new UntypedFormControl(""),
        description: new UntypedFormControl(""),
        minijob: new UntypedFormControl(false),
        address: new UntypedFormGroup({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          street_number: new UntypedFormControl(""),
          city: new UntypedFormControl(""),
          cap: new UntypedFormControl(""),
          country: new UntypedFormControl("IT"),
        }),
        completion: new UntypedFormControl(""),
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.createMode) {
      if (!this.subMode) {
        this.onSubmitMainJobCreate();
      } else {
        this.onSubmitSubJobCreate();
      }
    } else {
      if (!this.subMode) {
        this.onSubmitMainJobEdit();
      } else {
        this.onSubmitSubJobEdit();
      }
    }
  }

  createUpdateSuccess(job: Job, redirectMain = false): void {
    this.id = job.id;
    if (redirectMain) {
      job.id = this.mainJobId;
    }
    this.router.navigateByUrl("job/" + job.id.toString(), { replaceUrl: true });
  }

  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$.pipe(tap(job => this.jobGroup.patchValue(job)), first()).subscribe((job) => {
        this.subMode = job.is_sub;
        this.jobGroup.patchValue({
          name: job.name,
          minijob: job.is_mini,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          responsible_id: job.responsible.id,
          address: {
            country: job.address.country.code,
          },
          completion: job.completion,
        });
      });
    }
  }

  getAddressGroup(): UntypedFormGroup {
    return this.jobGroup.get("address") as UntypedFormGroup;
  }

  private onSubmitMainJobCreate(): void {
    const jobCreate: JobCreate = {
      description: this.jobGroup.get("description").value,
      name: this.jobGroup.get("name").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: this.clientId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      responsible_id: parseInt(this.jobGroup.get("responsible_id").value, 10),
      year: parseInt(this.jobGroup.get("year").value, 10),
      address: {
        name: this.jobGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: this.jobGroup.get("address.street_number").value,
        city: this.jobGroup.get("address.city").value,
        cap: this.jobGroup.get("address.cap").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        country_code: this.jobGroup.get("address.country").value,
      },
      type: this.jobGroup.get("minijob").value ? "JOBYTPE_MINI" : "JOBTYPE_MAIN",
      completion: this.jobGroup.get("completion").value,
    };
    this.api.createJobJobPost(jobCreate).subscribe((job) => {
      this.createUpdateSuccess(job);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });
  }

  private onSubmitSubJobCreate(): void {
    const subJobCreate: SubJobCreate = {
      description: this.jobGroup.get("description").value,
      name: this.jobGroup.get("name").value,
    };
    this.api.addSubjobToJobJobSubJobJobIdPost(this.mainJobId, subJobCreate).subscribe((job) => {
      this.createUpdateSuccess(job, true);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });

  }

  private onSubmitMainJobEdit(): void {
    const jobUpdate: JobUpdate = {
      description: this.jobGroup.get("description").value,
      name: this.jobGroup.get("name").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      responsible_id: parseInt(this.jobGroup.get("responsible_id").value, 10),
      address: {
        name: this.jobGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: this.jobGroup.get("address.street_number").value,
        city: this.jobGroup.get("address.city").value,
        cap: this.jobGroup.get("address.cap").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        country_code: this.jobGroup.get("address.country").value,
      },
      completion: this.jobGroup.get("completion").value,
    };
    this.api.updateJobJobJobIdPut(this.id, jobUpdate).subscribe((job) => {
      this.createUpdateSuccess(job);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });
  }

  private onSubmitSubJobEdit(): void {
    const subJobCreate: SubJobCreate = {
      description: this.jobGroup.get("description").value,
      name: this.jobGroup.get("name").value,
    };
    this.api.updateSubjobJobSubJobSubjobIdPut(this.id, subJobCreate).subscribe((job) => {
      this.createUpdateSuccess(job);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });
  }
}
