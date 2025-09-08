import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Page } from 'app/shared/models/page';
import { CcppService } from '../../../shared/services/ccpp.service';
import { AppErrorService } from '../../../shared/services/app-error/app-error.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MatDialog } from '@angular/material';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppAlertService } from '../../../shared/services/app-alert/app-alert.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
  @Input() data;
  @Input() page;
  @Input() inputCupo: string;
  @Output() cambiarPage = new EventEmitter();
  @Output() buscarCupo = new EventEmitter();

  public lista_auditoria: any[];
  public getItemSub: Subscription;
  //page = new Page();
  messages = {
    emptyMessage: `
      <div>
        <span class="classname">No hay auditorias</span>
      </div>
    `
  };
  filtro = {
    cupo: '',
  };
  buscarForm: FormGroup;

  constructor(private ccppService: CcppService,
    private errorService: AppErrorService,
    private loader: AppLoaderService,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private alertService: AppAlertService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.buscarForm = this.fb.group({
      cupo: [this.inputCupo]
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.cambiarPage.emit({ page: this.page });
  }

  buscarCupos() {
    this.page.pageNumber -= 1;
    let cupo = this.buscarForm.controls['cupo'].value;
    this.buscarCupo.emit({ cupo: cupo, page: this.page });
  }




  marcarComoLeido(row) {
    this.confirmService.confirm({ message: '¿Está seguro que desea marcar como leido: ' + row.alfanumerico + ' ?' })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.ccppService.postAuditoria({ 'id_auditoria': row.id })
            .subscribe(data => {
              this.loader.close();
              this.buscarCupos();
              //this.page.pageNumber -=1;
              //this.cambiarPage.emit({ page: this.page });
              //this.setPage({ offset: this.page.pageNumber });
              this.alertService.confirm({ message: '¡Marcado como leido correctamente!', tipo: 'exito' }).subscribe(res1 => {
                if (res1) {
                  return;
                }
              });
              return;
            },
              err => {
                this.loader.close();
                this.errorService.confirm({ message: 'No se pudo marcar como leido' })
                  .subscribe(res1 => {
                    if (res1) {
                    }
                  });

              });
        }
      })
  }

}
