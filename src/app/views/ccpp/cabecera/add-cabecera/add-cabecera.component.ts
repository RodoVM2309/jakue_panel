import { Component, OnInit, Inject, ElementRef, ViewChild, OnDestroy } from '@angular/core';
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
import { fromEvent } from 'rxjs';
import { PersonasService } from "app/shared/services/personas.service";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
@Component({
  selector: 'app-add-cabecera',
  templateUrl: './add-cabecera.component.html',
  styleUrls: ['./add-cabecera.component.scss']
})
export class AddCabeceraComponent implements OnInit, OnDestroy {
  addCabeceraForm: FormGroup;
  public searchControl: FormControl;
  public getItemSub: Subscription;
  cabecera: Cabecera;
  isNew: boolean;
  title = 'NUEVA';
  idCabeceraEdit = 0;
  isMyCuit: boolean = true;
  myCuit = '';

  @ViewChild('idCuitTitula') idCuitTitula: ElementRef;
  @ViewChild('idCuitRemComercialProductor') idCuitRemComercialProductor: ElementRef;
  @ViewChild('idCuitIntermediarioFlete') idCuitIntermediarioFlete: ElementRef;
  @ViewChild('idCuitRemComercialVentaPrimaria') idCuitRemComercialVentaPrimaria: ElementRef;
  @ViewChild('idCuitRemComercialVentaSecundaria') idCuitRemComercialVentaSecundaria: ElementRef;
  @ViewChild('idCuitRemComercialVentaSecundaria2') idCuitRemComercialVentaSecundaria2: ElementRef;
  @ViewChild('idCuitMercadoATermino') idCuitMercadoATermino: ElementRef;
  @ViewChild('idCuitCorredorVentaPrimaria') idCuitCorredorVentaPrimaria: ElementRef;
  @ViewChild('idCuitCorredorVentaSecundaria') idCuitCorredorVentaSecundaria: ElementRef;
  @ViewChild('idCuitRepresentanteEntregador') idCuitRepresentanteEntregador: ElementRef;
  @ViewChild('idCuitRepresentanteRecibidor') idCuitRepresentanteRecibidor: ElementRef;
  @ViewChild('idCuitDestinatario') idCuitDestinatario: ElementRef;
  @ViewChild('idCuitDestino') idCuitDestino: ElementRef;
  @ViewChild('idCuitIntermediario1') idCuitIntermediario1: ElementRef;
  @ViewChild('idCuitIntermediario2') idCuitIntermediario2: ElementRef;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddCabeceraComponent>,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private alertService: AppAlertService,
    private ccppService: CcppService,
    private errorService: AppErrorService,
    private personasService: PersonasService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.isNew = this.data.isNew;
    this.cabecera = this.data.payload;
    this.idCabeceraEdit = this.data.id_cabecera.id;
    if (this.isNew) {
      this.title = 'NUEVA';
    } else {
      this.title = 'EDITAR';
    }


    this.addCabeceraForm = new FormGroup({
      id: new FormControl(""),
      titulo: new FormControl("", [Validators.required, Validators.maxLength(70)]),
      nombreTitular: new FormControl(""),
      idCuitTitula: new FormControl(""),
      nombreRemitenteComercialProductor: new FormControl(""),
      idCuitRemComercialProductor: new FormControl(""),
      nombreIntermediarioFlete: new FormControl(""),
      idCuitIntermediarioFlete: new FormControl(""),
      nombreRemComercialVentaPrimaria: new FormControl(""),
      idCuitRemComercialVentaPrimaria: new FormControl(""),
      nombreRemComercialVentaSecundaria: new FormControl(""),
      idCuitRemComercialVentaSecundaria: new FormControl(""),
      nombreRemComercialVentaSecundaria2: new FormControl(""),
      idCuitRemComercialVentaSecundaria2: new FormControl(""),
      nombreMercadoATermino: new FormControl(""),
      idCuitMercadoATermino: new FormControl(""),
      nombreCorredorVentaPrimaria: new FormControl(""),
      idCuitCorredorVentaPrimaria: new FormControl(""),
      nombreCorredorVentaSecundaria: new FormControl(""),
      idCuitCorredorVentaSecundaria: new FormControl(""),
      nombreEntregador: new FormControl(""),
      idCuitRepresentanteEntregador: new FormControl(""),
      nombreRepresentanteRecibidor: new FormControl(""),
      idCuitRepresentanteRecibidor: new FormControl(""),
      nombreDestinatario: new FormControl(""),
      idCuitDestinatario: new FormControl(""),
      nombreDestino: new FormControl(""),
      idCuitDestino: new FormControl(""),
      nroContrato: new FormControl(""),
      nombreIntermediario1: new FormControl(""),
      idCuitIntermediario1: new FormControl(""),
      nombreIntermediario2: new FormControl(""),
      idCuitIntermediario2: new FormControl(""),
      caratulaMercadoATermino: new FormControl(""),
      comentario: new FormControl("")
    });
    if (!this.isNew) {
      if (!this.data.id_cabecera.id) {
        this.addCabeceraForm.controls['id'].setValue(this.cabecera.id);
        this.addCabeceraForm.controls['titulo'].setValue(this.cabecera.titulo);
        this.addCabeceraForm.controls['nombreTitular'].setValue(this.cabecera.nombreTitular);
        this.addCabeceraForm.controls['idCuitTitula'].setValue(this.cabecera.idCuitTitula);
        this.addCabeceraForm.controls['nombreRemitenteComercialProductor'].setValue(this.cabecera.nombreRemitenteComercialProductor);
        this.addCabeceraForm.controls['idCuitRemComercialProductor'].setValue(this.cabecera.idCuitRemComercialProductor);
        this.addCabeceraForm.controls['nombreIntermediarioFlete'].setValue(this.cabecera.nombreIntermediarioFlete);
        this.addCabeceraForm.controls['idCuitIntermediarioFlete'].setValue(this.cabecera.idCuitIntermediarioFlete);
        this.addCabeceraForm.controls['nombreRemComercialVentaPrimaria'].setValue(this.cabecera.nombreRemComercialVentaPrimaria);
        this.addCabeceraForm.controls['idCuitRemComercialVentaPrimaria'].setValue(this.cabecera.idCuitRemComercialVentaPrimaria);
        this.addCabeceraForm.controls['nombreRemComercialVentaSecundaria'].setValue(this.cabecera.nombreRemComercialVentaSecundaria);
        this.addCabeceraForm.controls['idCuitRemComercialVentaSecundaria'].setValue(this.cabecera.idCuitRemComercialVentaSecundaria);
        this.addCabeceraForm.controls['nombreRemComercialVentaSecundaria2'].setValue(this.cabecera.nombreRemComercialVentaSecundaria2);
        this.addCabeceraForm.controls['idCuitRemComercialVentaSecundaria2'].setValue(this.cabecera.idCuitRemComercialVentaSecundaria2);
        this.addCabeceraForm.controls['nombreMercadoATermino'].setValue(this.cabecera.nombreMercadoATermino);
        this.addCabeceraForm.controls['idCuitMercadoATermino'].setValue(this.cabecera.idCuitMercadoATermino);
        this.addCabeceraForm.controls['nombreCorredorVentaPrimaria'].setValue(this.cabecera.nombreCorredorVentaPrimaria);
        this.addCabeceraForm.controls['idCuitCorredorVentaPrimaria'].setValue(this.cabecera.idCuitCorredorVentaPrimaria);
        this.addCabeceraForm.controls['nombreCorredorVentaSecundaria'].setValue(this.cabecera.nombreCorredorVentaSecundaria);
        this.addCabeceraForm.controls['idCuitCorredorVentaSecundaria'].setValue(this.cabecera.idCuitCorredorVentaSecundaria);
        this.addCabeceraForm.controls['nombreEntregador'].setValue(this.cabecera.nombreEntregador);
        this.addCabeceraForm.controls['idCuitRepresentanteEntregador'].setValue(this.cabecera.idCuitRepresentanteEntregador);
        this.addCabeceraForm.controls['nombreRepresentanteRecibidor'].setValue(this.cabecera.nombreRepresentanteRecibidor);
        this.addCabeceraForm.controls['idCuitRepresentanteRecibidor'].setValue(this.cabecera.idCuitRepresentanteRecibidor);
        this.addCabeceraForm.controls['nombreDestinatario'].setValue(this.cabecera.nombreDestinatario);
        this.addCabeceraForm.controls['idCuitDestinatario'].setValue(this.cabecera.idCuitDestinatario);
        this.addCabeceraForm.controls['nombreDestino'].setValue(this.cabecera.nombreDestino);
        this.addCabeceraForm.controls['idCuitDestino'].setValue(this.cabecera.idCuitDestino);
        this.addCabeceraForm.controls['nroContrato'].setValue(this.cabecera.nroContrato);
        this.addCabeceraForm.controls['nombreIntermediario1'].setValue(this.cabecera.nombreIntermediario1);
        this.addCabeceraForm.controls['idCuitIntermediario1'].setValue(this.cabecera.idCuitIntermediario1);
        this.addCabeceraForm.controls['nombreIntermediario2'].setValue(this.cabecera.nombreIntermediario2);
        this.addCabeceraForm.controls['idCuitIntermediario2'].setValue(this.cabecera.idCuitIntermediario2);
        this.addCabeceraForm.controls['caratulaMercadoATermino'].setValue(this.cabecera.caratulaMercadoATermino);
        this.addCabeceraForm.controls['comentario'].setValue(this.cabecera.comentario);
      } else {
        this.getItemSub = this.ccppService.getIdCabecera(this.idCabeceraEdit)
          .subscribe(data => {
            this.cabecera = data.data;
            this.addCabeceraForm.controls['id'].setValue(this.cabecera.id);
            this.addCabeceraForm.controls['titulo'].setValue(this.cabecera.titulo);
            this.addCabeceraForm.controls['nombreTitular'].setValue(this.cabecera.nombreTitular);
            this.addCabeceraForm.controls['idCuitTitula'].setValue(this.cabecera.idCuitTitula);
            this.addCabeceraForm.controls['nombreRemitenteComercialProductor'].setValue(this.cabecera.nombreRemitenteComercialProductor);
            this.addCabeceraForm.controls['idCuitRemComercialProductor'].setValue(this.cabecera.idCuitRemComercialProductor);
            this.addCabeceraForm.controls['nombreIntermediarioFlete'].setValue(this.cabecera.nombreIntermediarioFlete);
            this.addCabeceraForm.controls['idCuitIntermediarioFlete'].setValue(this.cabecera.idCuitIntermediarioFlete);
            this.addCabeceraForm.controls['nombreRemComercialVentaPrimaria'].setValue(this.cabecera.nombreRemComercialVentaPrimaria);
            this.addCabeceraForm.controls['idCuitRemComercialVentaPrimaria'].setValue(this.cabecera.idCuitRemComercialVentaPrimaria);
            this.addCabeceraForm.controls['nombreRemComercialVentaSecundaria'].setValue(this.cabecera.nombreRemComercialVentaSecundaria);
            this.addCabeceraForm.controls['idCuitRemComercialVentaSecundaria'].setValue(this.cabecera.idCuitRemComercialVentaSecundaria);
            this.addCabeceraForm.controls['nombreRemComercialVentaSecundaria2'].setValue(this.cabecera.nombreRemComercialVentaSecundaria2);
            this.addCabeceraForm.controls['idCuitRemComercialVentaSecundaria2'].setValue(this.cabecera.idCuitRemComercialVentaSecundaria2);
            this.addCabeceraForm.controls['nombreMercadoATermino'].setValue(this.cabecera.nombreMercadoATermino);
            this.addCabeceraForm.controls['idCuitMercadoATermino'].setValue(this.cabecera.idCuitMercadoATermino);
            this.addCabeceraForm.controls['nombreCorredorVentaPrimaria'].setValue(this.cabecera.nombreCorredorVentaPrimaria);
            this.addCabeceraForm.controls['idCuitCorredorVentaPrimaria'].setValue(this.cabecera.idCuitCorredorVentaPrimaria);
            this.addCabeceraForm.controls['nombreCorredorVentaSecundaria'].setValue(this.cabecera.nombreCorredorVentaSecundaria);
            this.addCabeceraForm.controls['idCuitCorredorVentaSecundaria'].setValue(this.cabecera.idCuitCorredorVentaSecundaria);
            this.addCabeceraForm.controls['nombreEntregador'].setValue(this.cabecera.nombreEntregador);
            this.addCabeceraForm.controls['idCuitRepresentanteEntregador'].setValue(this.cabecera.idCuitRepresentanteEntregador);
            this.addCabeceraForm.controls['nombreRepresentanteRecibidor'].setValue(this.cabecera.nombreRepresentanteRecibidor);
            this.addCabeceraForm.controls['idCuitRepresentanteRecibidor'].setValue(this.cabecera.idCuitRepresentanteRecibidor);
            this.addCabeceraForm.controls['nombreDestinatario'].setValue(this.cabecera.nombreDestinatario);
            this.addCabeceraForm.controls['idCuitDestinatario'].setValue(this.cabecera.idCuitDestinatario);
            this.addCabeceraForm.controls['nombreDestino'].setValue(this.cabecera.nombreDestino);
            this.addCabeceraForm.controls['idCuitDestino'].setValue(this.cabecera.idCuitDestino);
            this.addCabeceraForm.controls['nroContrato'].setValue(this.cabecera.nroContrato);
            this.addCabeceraForm.controls['nombreIntermediario1'].setValue(this.cabecera.nombreIntermediario1);
            this.addCabeceraForm.controls['idCuitIntermediario1'].setValue(this.cabecera.idCuitIntermediario1);
            this.addCabeceraForm.controls['nombreIntermediario2'].setValue(this.cabecera.nombreIntermediario2);
            this.addCabeceraForm.controls['idCuitIntermediario2'].setValue(this.cabecera.idCuitIntermediario2);
            this.addCabeceraForm.controls['caratulaMercadoATermino'].setValue(this.cabecera.caratulaMercadoATermino);
            this.addCabeceraForm.controls['comentario'].setValue(this.cabecera.comentario);
          });
      }
    }
    this.searchControl = new FormControl();
    fromEvent(this.idCuitTitula.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreTitular'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitRemComercialProductor.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreRemitenteComercialProductor'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitRemComercialVentaPrimaria.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreRemComercialVentaPrimaria'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitRemComercialVentaSecundaria.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreRemComercialVentaSecundaria'].setValue(resp.data)
        },
          err => {
          });
    });
    fromEvent(this.idCuitRemComercialVentaSecundaria2.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreRemComercialVentaSecundaria2'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitMercadoATermino.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreMercadoATermino'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitCorredorVentaPrimaria.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreCorredorVentaPrimaria'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitCorredorVentaSecundaria.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreCorredorVentaSecundaria'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitRepresentanteEntregador.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreEntregador'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitRepresentanteRecibidor.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreRepresentanteRecibidor'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitIntermediarioFlete.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreIntermediarioFlete'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitDestinatario.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreDestinatario'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitDestino.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreDestino'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitIntermediario1.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreIntermediario1'].setValue(resp.data)
        },
          err => {
          });
    });
    //
    fromEvent(this.idCuitIntermediario2.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      let cuit = text.toLowerCase();
      this.isMyCuitCabecera();
      this.personasService.getPersonaNombreByCuit(cuit)
        .subscribe(resp => {
          this.addCabeceraForm.controls['nombreIntermediario2'].setValue(resp.data)
        },
          err => {
          });
    });
  }

  isMyCuitCabecera() {
    this.isMyCuit = true;
    if (this.addCabeceraForm.controls["idCuitDestinatario"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitTitula"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitRemComercialProductor"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitIntermediarioFlete"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitRemComercialVentaPrimaria"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitRemComercialVentaSecundaria"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitRemComercialVentaSecundaria2"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitMercadoATermino"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitCorredorVentaPrimaria"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitCorredorVentaSecundaria"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitRepresentanteEntregador"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitRepresentanteRecibidor"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitDestino"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitIntermediario1"].value == this.myCuit) {
      this.isMyCuit = false;
    };
    if (this.addCabeceraForm.controls["idCuitIntermediario2"].value == this.myCuit) {
      this.isMyCuit = false;
    };
  }


  submit() {
    if (this.isNew) {
      this.loader.open('Agregando nueva cabecera...');
      this.getItemSub = this.ccppService.postCabecera(this.addCabeceraForm.value)
        .subscribe(resp => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService.confirm({ message: '¡Cabecera agregada correctamente!', tipo: 'exito' }).subscribe(res1 => {
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
                if (res1) {
                }
              });
          })
    } else {
      this.loader.open('Guardando cabecera...');
      this.getItemSub = this.ccppService.updateCabecera(this.addCabeceraForm.value)
        .subscribe(resp => {
          if (this.loader !== null) {
            this.loader.close();
          }
          this.alertService.confirm({ message: '¡Cabecera agregada correctamente!', tipo: 'exito' }).subscribe(res1 => {
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
                if (res1) {
                }
              });
          })

    }

  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }


}

