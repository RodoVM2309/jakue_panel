

import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import {Provincia} from "../../shared/models/provincia";
import {HomeService} from "../../shared/components/home/home.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs/observable/of";



export class ProvinciasDataSource implements DataSource<Provincia> {

    private provinciaSubject = new BehaviorSubject<Provincia[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private homeService: HomeService) {

    }

    loadProvincias() {

        this.loadingSubject.next(true);

        this.homeService.getProvincias().pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => this.provinciaSubject.next(lessons));

    }

    connect(collectionViewer: CollectionViewer): Observable<Provincia[]> {
        return this.provinciaSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.provinciaSubject.complete();
        this.loadingSubject.complete();
    }

}