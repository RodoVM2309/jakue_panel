import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AmazingTimePickerService } from 'amazing-time-picker';
import {
	MatPaginator,
	MatSort,
	MatTableDataSource,
	PageEvent,
	DateAdapter,
	MAT_DATE_FORMATS,
  	MAT_DATE_LOCALE
  } from "@angular/material";


import { AppDateAdapter, APP_DATE_FORMATS } from '../../../shared/components/home/add-pedido/date.adapter';

import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

import { Page } from '../../../shared/models/page';
import { ExelService } from 'app/shared/services/exel.service';
import { AuditoriasService } from './../../../shared/services/auditorias.service';


import * as moment from "moment";

@Component({
	selector: 'app-errorlogs',
	templateUrl: './errorlog.component.html',
	styleUrls: ['./errorlog.component.scss'],
	providers: [
		{
		  provide: DateAdapter, useClass: AppDateAdapter
		},
		{
		  provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		},
		{
		  provide: MAT_DATE_LOCALE, useValue: 'es-ES'
		}
	  ]
  })
  export class ErrorLogComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
  	@ViewChild(MatSort) sort: MatSort;

  	dataSource = new MatTableDataSource();

	messages = {
		emptyMessage: `
		  <div>
			<span class="classname">No hay auditorias disponibles</span>
		  </div>
		`
	  };

	pageEvent: PageEvent = new PageEvent();
	page = new Page();

	showTable: boolean = false;
	

	@Input() dateFrom: string;
	public hourFrom:string;
	@Input() dateTo: string;
	public hourTo:string;

	public username: string = '';

	auditoriaForm: FormGroup;

	public pageSize = 10;
	public totalSize = 0;
	public pageIndex = 0;
	public dataExport: any[] = [];
	
	displayedColumns: string[] = [
		"fecha",
		"user",
		"ip",
		"metodo",
		"json_entrada",
		"json_salida"
	];


	chancedDate: boolean = true;

	constructor(
		private auditoriasService: AuditoriasService,
		private atp: AmazingTimePickerService,
		private loader: AppLoaderService,
		private excelService: ExelService,

	){
		this.page.pageNumber = 0;
		this.page.size = 10;
		this.pageEvent.pageIndex = 0;
    	this.pageEvent.pageSize = 10;
	}


	ngOnInit() {
		this.showTable = false;
		const numericNumberReg = "^-?[0-9]\\d*(\\.\\d{1,2})?$";
		this.dateFrom = moment(new Date()).format("YYYY-MM-DD");
		this.hourFrom = moment(new Date()).subtract(10, 'minutes').format("HH:mm");

		this.dateTo = moment(new Date()).format("YYYY-MM-DD");
		this.hourTo = moment(new Date()).format("HH:mm");;

		this.paginator._intl.itemsPerPageLabel = "Auditorias por páginas:";
		this.paginator._intl.nextPageLabel = "Siguiente";
		this.paginator._intl.firstPageLabel = "Primero";
		this.paginator._intl.lastPageLabel = "Último";
		this.paginator._intl.previousPageLabel = "Anterior";
		this.dataSource.sort = this.sort;

		/* GC: Validar filtros de entrada */
		this.auditoriaForm = new FormGroup({
			selectedDateFrom: new FormControl(new Date(this.dateFrom + ' 12:00:00')),
			selectedHourFrom: new FormControl(this.hourFrom, [Validators.required]),
			selectedDateTo: new FormControl(new Date(this.dateTo + ' 12:00:00')),
			selectedHourTo: new FormControl(this.hourTo, [Validators.required]),
			username: new FormControl(this.username),
		});

		this.filterData(null);
		
	}


	/**
	 * GC: Buscar las auditorias
	 * @param [event] 
	 */
	filterData(event?: PageEvent) {

		let params = {	page: 1, per_page: 50 };
		
		if (event !== null) {
			
			params.page = event.pageIndex + 1;
			params.per_page = event.pageSize;
		}

		this.loader.open('Por favor espere..');
				
		this.auditoriasService.getV3Logs(this.dateFrom, this.hourFrom, this.dateTo, this.hourTo, this.username, params.page,  params.per_page)
		.subscribe(
		  data => {
			this.loader.close();
			if (data.success) {
				this.showTable = true;
				this.dataSource.data = data.data;
				this.pageIndex = data._meta.currentPage - 1;
				this.pageSize = data._meta.perPage;
				this.totalSize = data._meta.totalCount;
			}
			
		  },
		  error => {
			this.loader.close();
		})
		
	}

	
	/**
	 * GC: Recolección de valores de los filtros y aplicación de los mismos
	 */
	searchAudit() {
		this.dateFrom = this.formatDate(this.auditoriaForm.controls['selectedDateFrom'].value, "Ymd", "-");
		this.dateTo   = this.formatDate(this.auditoriaForm.controls['selectedDateTo'].value, "Ymd", "-");
		this.hourFrom = this.auditoriaForm.controls['selectedHourFrom'].value;
		this.hourTo   = this.auditoriaForm.controls['selectedHourTo'].value;
		this.username = this.auditoriaForm.controls['username'].value;
				
		this.filterData(this.pageEvent);
	}

	/**
	 * GC: Abre el widget de hora de inicio con la configuración de 10 minutos antes
	 */
	openHourFrom() {
		const amazingTimePicker = this.atp.open({ time: this.hourFrom });

		amazingTimePicker.afterClose().subscribe(time => {
		  this.hourFrom = time;
		  this.auditoriaForm.controls['selectedHourFrom'].setValue(time);

		});
	}


	/**
	 * GC: Abre el widget de hora de fin con la configuración de la hora actual 
	 */
	openHourTo() {
		const amazingTimePicker = this.atp.open({ time: this.hourTo });

		amazingTimePicker.afterClose().subscribe(time => {
			this.hourTo = time;
			this.auditoriaForm.controls['selectedHourTo'].setValue(time);

		  });
	}

	/**
	 * GC: Formatea la fecha
	 * Formats date
	 * @param date 
	 * @param [formato] 
	 * @param [separador] 
	 * @returns  
	 */
	formatDate(date, formato = 'dma', separador = "/") {
		const toTwoDigits = num => (num < 10 ? "0" + num : num);
		let today = new Date(date);
		let year = today.getFullYear();
		let month = toTwoDigits(today.getMonth() + 1);
		let day = toTwoDigits(today.getDate());
		return (formato === 'dma') ? `${day}${separador}${month}${separador}${year}` : `${year}${separador}${month}${separador}${day}`;
	}


	/**
	 * GC: Exporta los resultados a Excel
	 */
	exportAsXLSX(): void 
	{					
		this.loader.open('Por favor espere..');			
		this.auditoriasService.getV3LogExcel(this.dateFrom, this.hourFrom, this.dateTo, this.hourTo, this.username)
		.subscribe(
		  res => {
			this.loader.close();
			
			if (res.success) {		
				this.loader.close();
				this.dataExport = res.data;	
				
				this.buildSheet(this.dataExport);								
			}
		  });		  		  		  		  		  
		  
	}

	private setting = {
		element: {
			dynamicDownload: null as HTMLElement
		}
	}

	buildSheet(data): void
	{
		let array_exp = [];
		if (data.length > 0) 
			{														
				for (let i = 0; i < data.length; i++) 
				{			  										
					let sheet = {
						Fecha: data[i].fecha,
						Username: data[i].user,
						Ip: data[i].ip,
						Metodo: data[i].metodo,
						Json_Entrada: data[i].json_entrada,
						Json_Salida: data[i].json_salida
					};

					array_exp.push(sheet);
				}
				
				this.excelService.exportAsExcelFile(array_exp, "Logs");  
	
			}
	}


	exportToTxt(json): void{
		console.log(json);
		this.dyanmicDownloadByHtmlTag({
			fileName: 'Json',
			text: JSON.stringify(json)
		});
	}

	private dyanmicDownloadByHtmlTag(arg: {
		fileName: string,
		text: string
	  }) {
		if (!this.setting.element.dynamicDownload) {
		  this.setting.element.dynamicDownload = document.createElement('a');
		}
		const element = this.setting.element.dynamicDownload;
		const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
		element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
		element.setAttribute('download', arg.fileName);
	
		var event = new MouseEvent("click");
		element.dispatchEvent(event);
	  }



  }
