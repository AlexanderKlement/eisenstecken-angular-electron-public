import { Observable } from "rxjs";
import { DataSourceClass, RecursiveKeyOf } from "../../types";
import { Lock } from "../../../../api/openapi";

export interface Mapping<T> {
  property: string;
  name: string;
}

export class InfoDataSource<T extends DataSourceClass> {

  public data$: Observable<T>;
  public mapping: Mapping<T>[];
  public navigationTarget: string;
  public lockObservable: Observable<boolean>;
  public lock$: Observable<Lock>;
  public unlockObservable: Observable<boolean>;

  constructor(data: Observable<T>,
              mapping: Mapping<T>[],
              navigationTarget: string, lock$: Observable<Lock>,
              lockObservable: Observable<boolean>,
              unlockObservable: Observable<boolean>) {
    this.data$ = data;
    this.mapping = mapping;
    this.navigationTarget = navigationTarget;
    this.lock$ = lock$;
    this.lockObservable = lockObservable;
    this.unlockObservable = unlockObservable;
  }
}
