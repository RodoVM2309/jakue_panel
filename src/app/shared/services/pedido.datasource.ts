
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs/Observable";
import {Pedido} from "../../shared/models/pedido";
import {HomeService} from "../../shared/components/home/home.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs/observable/of";



export class PedidoDataSource implements DataSource<Pedido> {

    public pedidoSubject = new BehaviorSubject<Pedido[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private homeService: HomeService) {

    }

    loadPedidos(page: number, filtro = {}) {

        this.loadingSubject.next(true);

        this.homeService.getAllPedidos(page, filtro).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(pedido => this.pedidoSubject.next(pedido));

    }
    loadPedidosRetorno(page: number, filtro = {}) {

        this.loadingSubject.next(true);

        this.homeService.getAllPedidosRetorno(page, filtro).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(pedido => this.pedidoSubject.next(pedido));

    }
    /* loadPedidosDador(page: number, filtro = {}) {

        this.loadingSubject.next(true);

        this.homeService.getAllPedidosDador(page, filtro).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(pedido => this.pedidoSubject.next(pedido));

    }
    loadPedidosRetornoDador(page: number, filtro = {}) {

        this.loadingSubject.next(true);

        this.homeService.getAllPedidosRetorno(page, filtro).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(pedido => this.pedidoSubject.next(pedido));

    } */

    loadPedidosAdmin() {
        this.loadingSubject.next(true);

        this.homeService.getAll().pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(pedido => this.pedidoSubject.next(pedido));

    }

    connect(collectionViewer: CollectionViewer): Observable<Pedido[]> {
        return this.pedidoSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.pedidoSubject.complete();
        this.loadingSubject.complete();
    }

}