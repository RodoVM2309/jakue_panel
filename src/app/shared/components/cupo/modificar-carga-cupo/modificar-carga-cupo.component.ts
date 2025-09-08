import { Component, OnInit, ViewChild, ElementRef, Inject } from "@angular/core";
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,

} from "@angular/material";
import {
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { CcppService } from 'app/shared/services/ccpp.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { Subscription } from 'rxjs';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';
import { UserService } from 'app/shared/services/user.service';
import { Cabecera } from 'app/shared/models/cabecera';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { PersonasService } from "app/shared/services/personas.service";

@Component({
  selector: "app-modificar-carga-cupo",
  templateUrl: "./modificar-carga-cupo.component.html",
  styleUrls: ["./modificar-carga-cupo.component.scss"],
})
export class ModificarCargaCupoComponent implements OnInit {
  addCabeceraForm: FormGroup;
  public searchControl: FormControl;
  public getItemSub: Subscription;
  cabecera: Cabecera;
  isNew: boolean;
  title = 'NUEVA';
  editarCcpp: boolean;
  permiteEditar: boolean;
  idCabecera = 0;

  /*
    Armo dos array para no tener que 
    repetir la funcion, uno con el cuit, otro con 
    la razon social. Teneren cuenta, que el CUIT y la razon social
    deben estar en la misma posicion.
  */
  cuitArray = [
    'idCuitTitula',
    'idCuitIntermediario',
    'idCuitRemComercial',
    'idCuitRepresentanteEntregador',
    'idCuitIntermediario1',
    'idCuitIntermediario2'
  ];
  razonSocialArray = [
    'nombreTitular',
    'nombreIntermediario',
    'nombreRemitente',
    'nombreEntregador',
    'nombreIntermediario1',
    'nombreIntermediario2'
  ];

  @ViewChild('idCuitTitula') idCuitTitula: ElementRef;
  @ViewChild('idCuitIntermediario') idCuitIntermediario: ElementRef;
  @ViewChild('idCuitRemComercial') idCuitRemComercial: ElementRef;
  @ViewChild('idCuitRepresentanteEntregador') idCuitRepresentanteEntregador: ElementRef;
  @ViewChild('idCuitIntermediario1') idCuitIntermediario1: ElementRef;
  @ViewChild('idCuitIntermediario2') idCuitIntermediario2: ElementRef;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModificarCargaCupoComponent>,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private ccppService: CcppService,
    private errorService: AppErrorService,
    private userService: UserService,
    private personasService: PersonasService,
  ) { }

  ngOnInit() {
    this.permiteEditar = this.data.permiteEditar ? this.data.permiteEditar : null;
    this.idCabecera = this.data.cabecera ? this.data.cabecera.id : null;

    this.isNew = false;
    if (this.isNew) {
      this.title = 'NUEVA';
    } else {
      this.title = 'EDITAR';
    }
    this.addCabeceraForm = new FormGroup({
      id: new FormControl(""),
      nombreIntermediarioFlete: new FormControl({ value: "", disabled: true }),
      idCuitIntermediarioFlete: new FormControl({ value: "", disabled: true }),
      nombreCorredorComprador: new FormControl({ value: "", disabled: true }),
      idCuitCorredorC: new FormControl({ value: "", disabled: true }),
      nombreMercadoATermino: new FormControl({ value: "", disabled: true }),
      idCuitMercadoATermino: new FormControl({ value: "", disabled: true }),
      nombreCorredorVendedor: new FormControl({ value: "", disabled: true }),
      idCuitCorredorV: new FormControl({ value: "", disabled: true }),
      nombreDestinatario: new FormControl({ value: "", disabled: true }),
      idCuitDestinatario: new FormControl({ value: "", disabled: true }),
      nroContrato: new FormControl({ value: "", disabled: true }),
      caratula: new FormControl({ value: "", disabled: true }),
      comentario: new FormControl({ value: "", disabled: true }),
      idCuitDestino: new FormControl({ value: "", disabled: true }),
      nombreDestino: new FormControl({ value: "", disabled: true }),
      /*
        Valido que si la vista se abre desde editar una CCPP,
        algunos campos no sean readonly
      */
      nombreTitular: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      idCuitTitula: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      nombreIntermediario: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      idCuitIntermediario: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      nombreRemitente: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      idCuitRemComercial: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      nombreEntregador: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      idCuitRepresentanteEntregador: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      nombreIntermediario1: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      idCuitIntermediario1: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      nombreIntermediario2: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true }),
      idCuitIntermediario2: new FormControl({ value: "", disabled: (this.data.editarCcpp == true) ? false : true })
    });
    this.ccppService.getCartaPorte(this.data.payload.id)
      .subscribe(data => {
        this.cabecera = data.data;
        this.addCabeceraForm.controls['idCuitDestino'].setValue(this.cabecera.idCuitDestino);
        this.addCabeceraForm.controls['nombreDestino'].setValue(this.cabecera.nombreDestino);
        this.addCabeceraForm.controls['id'].setValue(this.cabecera.id);
        this.addCabeceraForm.controls['nombreTitular'].setValue(this.cabecera.nombreTitular);
        this.addCabeceraForm.controls['idCuitTitula'].setValue(this.cabecera.idCuitTitula);
        this.addCabeceraForm.controls['nombreIntermediarioFlete'].setValue(this.cabecera.nombreIntermediarioFlete);
        this.addCabeceraForm.controls['nombreIntermediario'].setValue(this.cabecera.nombreIntermediario);
        this.addCabeceraForm.controls['idCuitIntermediarioFlete'].setValue(this.cabecera.idCuitIntermediarioFlete);
        this.addCabeceraForm.controls['idCuitIntermediario'].setValue(this.cabecera.idCuitIntermediario);
        this.addCabeceraForm.controls['nombreRemitente'].setValue(this.cabecera.nombreRemitente);
        this.addCabeceraForm.controls['idCuitRemComercial'].setValue(this.cabecera.idCuitRemComercial);
        this.addCabeceraForm.controls['nombreCorredorComprador'].setValue(this.cabecera.nombreCorredorComprador);
        this.addCabeceraForm.controls['idCuitCorredorC'].setValue(this.cabecera.idCuitCorredorC);
        this.addCabeceraForm.controls['nombreMercadoATermino'].setValue(this.cabecera.nombreMercadoATermino);
        this.addCabeceraForm.controls['idCuitMercadoATermino'].setValue(this.cabecera.idCuitMercadoATermino);
        this.addCabeceraForm.controls['nombreCorredorVendedor'].setValue(this.cabecera.nombreCorredorVendedor);
        this.addCabeceraForm.controls['idCuitCorredorV'].setValue(this.cabecera.idCuitCorredorV);
        this.addCabeceraForm.controls['nombreEntregador'].setValue(this.cabecera.nombreEntregador);
        this.addCabeceraForm.controls['idCuitRepresentanteEntregador'].setValue(this.cabecera.idCuitRepresentanteEntregador);
        this.addCabeceraForm.controls['nombreDestinatario'].setValue(this.cabecera.nombreDestinatario);
        this.addCabeceraForm.controls['idCuitDestinatario'].setValue(this.cabecera.idCuitDestinatario);
        this.addCabeceraForm.controls['nroContrato'].setValue(this.cabecera.nroContrato);
        this.addCabeceraForm.controls['nombreIntermediario1'].setValue(this.cabecera.nombreIntermediario1);
        this.addCabeceraForm.controls['idCuitIntermediario1'].setValue(this.cabecera.idCuitIntermediario1);
        this.addCabeceraForm.controls['nombreIntermediario2'].setValue(this.cabecera.nombreIntermediario2);
        this.addCabeceraForm.controls['idCuitIntermediario2'].setValue(this.cabecera.idCuitIntermediario2);
        this.addCabeceraForm.controls['caratula'].setValue(this.cabecera.caratulaMercadoATermino);
        this.addCabeceraForm.controls['comentario'].setValue(this.cabecera.comentario);

        /* 
          Cargo datos de cabecera posterior a que termine de
          completarse los datos del cupo para que no los pise.
        */
        if (this.idCabecera) {
          this.loader.open('Buscando datos de Cabecera');
          this.getItemSub = this.ccppService.getIdCabecera(this.idCabecera)
            .subscribe(pagedData => {
              this.loader.close();
              this.cabecera = pagedData.data;
              this.cargarCabecera(this.cabecera);
            },
              err => {
              });
        }
      });
    this.searchControl = new FormControl();

    /* 
      Auto-completo los campos de razón social 
      a partir del CUIT.
    */
    this.cuitArray.forEach((element, index) => {
      fromEvent(this[element].nativeElement, 'keyup').pipe(
        pluck('target', 'value'),
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe((text: string) => {
        let cuit = text.toLowerCase();
        this.personasService.getPersonaNombreByCuit(cuit)
          .subscribe(resp => {
            this.addCabeceraForm.controls[this.razonSocialArray[index]].setValue(resp.data);
          },
            err => {
            });
      });
    });
  }

  cargarCabecera(datosCabecera) {
    this.cuitArray.forEach((element, index) => {
      if (datosCabecera[element] !== '' && datosCabecera[element] !== null) {
        /* Si la cabecera tiene algun cuit cargado, lo reemplazo en el cupo */
        this.addCabeceraForm.controls[element].setValue(datosCabecera[element]);
        /* Y ahora completo tambien la razon social */
        this.addCabeceraForm.controls[this.razonSocialArray[index]].setValue(datosCabecera[this.razonSocialArray[index]]);
      }
    });
  }

  submit() {
    this.loader.open('Actualizando CCPP...');
    this.getItemSub = this.ccppService.editarCcpp(this.addCabeceraForm.value)
      .subscribe(resp => {
        if (this.loader !== null) {
          this.loader.close();
        }
        this.alertService.confirm({ message: 'CCPP actualizada correctamente!', tipo: 'exito' }).subscribe(res1 => {
          if (res1) {
            this.dialogRef.close(1);
            return;
          }
        });
      },
        err => {
          this.loader.close();
          this.errorService.confirm({ message: 'Errores' })
            .subscribe(res1 => {
              if (res1) { }
            });
        })
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }
}
