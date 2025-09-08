import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import { PersonasService } from "app/shared/services/personas.service";
import {
  MatTableDataSource,
  MatDialogRef, MatDialog,
  MatProgressBar,
  MatButton,
  MatSelect,
  MatSnackBar,
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA
} from '@angular/material';

@Component({
  selector: 'app-add-pedido-masivo',
  templateUrl: './add-pedido-masivo.component.html',
  styleUrls: ['./add-pedido-masivo.component.scss']
})
export class AddPedidoMasivoComponent implements OnInit {

  constructor(
    public personasService: PersonasService,
    public dialogLocaRef: MatDialogRef<any>
  ) { }

  ngOnInit() {
  }


  async getPedidoGenerarExcel() {
    let resp = await this.personasService.getPedidoGenerarExcel().toPromise();
    this.downloadFile(resp,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'pedido-masivo-fertilizante.xlsx');

  }

  downloadFile(blob: any, type: string, filename: string) {
    //let binaryData:any = [];
      //binaryData.push(blob);
      
        const url = window.URL.createObjectURL(new Blob([blob], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})); // <-- work with blob directly
   
        // create hidden dom element (so it works in all browsers)
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
   
        // create file, attach to hidden element and open hidden element
        a.href = url;
        a.download = filename;
        a.click();
   
  }

  openMasivo(){
    this.dialogLocaRef.close({ close : true });
  }

}
