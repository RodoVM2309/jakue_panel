
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { Caratula, Cupo, FiltroCaratula, ResponseCaratula } from "../model/caratulas";
import { CaratulasService } from "./caratulas.service";
import { catchError, finalize } from "rxjs/operators";
import { Page } from "@app/shared/models";

export class CaratulasDataSource implements DataSource<Caratula> {
  page: Page = new Page();

  private caratulaSubject = new BehaviorSubject<Caratula[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private pageSubject = new BehaviorSubject<Page>(this.page);

  public loadingPage$ = this.pageSubject.asObservable();

  public fulldataSubject = new BehaviorSubject<any>([]);

  constructor(private caratulasService: CaratulasService) {
  }

  loadCaratulas(
    filtro: FiltroCaratula,
    sortDirection: string,
    pageIndex: number,
    pageSize: number) {

    this.loadingSubject.next(true);

    this.caratulasService.findCaratulas(
      filtro,
      sortDirection,
      pageIndex,
      pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((caratula: ResponseCaratula) => {
        this.pageSubject.next(caratula.page);
        this.fulldataSubject.next(this.caratulasService.dataResponse);
        return this.caratulaSubject.next(caratula.caratulas);
      });
  }

  fulldata() {
    return this.fulldataSubject.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<Caratula[]> {
    console.log("Connecting data source caratulas");
    return this.caratulaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.caratulaSubject.complete();
    this.loadingSubject.complete();
    this.fulldataSubject.complete();
  }

}

