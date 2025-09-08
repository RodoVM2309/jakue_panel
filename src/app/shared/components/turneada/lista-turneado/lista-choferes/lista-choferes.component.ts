import { Component, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs';
import { CentrosService } from 'app/shared/services/centros.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppAlertService } from 'app/shared/services/app-alert/app-alert.service';
import { AppErrorService } from 'app/shared/services/app-error/app-error.service';

@Component({
  selector: 'app-lista-choferes',
  templateUrl: './lista-choferes.component.html',
  styleUrls: ['./lista-choferes.component.scss']
})

export class ListaChoferesComponent implements OnInit {
  // event called when item or items from available items(left box) is selected
  @Output() onAvailableItemSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();
  // event called when item or items from selected items(right box) is selected
  @Output() onSelectedItemsSelected: EventEmitter<{} | Array<{}>> = new EventEmitter<{} | Array<{}>>();

  availableItems: any[] = [];
  selectedItems: any[] = [];
  listBoxForm: FormGroup;
  availableListBoxControl: FormControl = new FormControl();
  selectedListBoxControl: FormControl = new FormControl();


  public getItemSub: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListaChoferesComponent>, public fb: FormBuilder,
    public centroService: CentrosService, private loader: AppLoaderService,
    private alertService: AppAlertService, private errorService: AppErrorService) {
    this.listBoxForm = this.fb.group({
      availableListBox: this.availableListBoxControl,
      selectedListBox: this.selectedListBoxControl
    });
  }

  ngOnInit() {
    this.getItemSub = this.centroService.getChoferesDisponiblesListaCentro(this.data.payload.id)
      .subscribe(data => {
        this.availableItems = data.data;
      });
    this.getItemSub = this.centroService.getChoferesSeleccionadosListaCentro(this.data.payload.id)
      .subscribe(data => {
        this.selectedItems = data.data;
      });
    this.availableListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onAvailableItemSelected.emit(items));
    this.selectedListBoxControl
      .valueChanges
      .subscribe((items: Array<{}>) => this.onSelectedItemsSelected.emit(items));
  }


  /**
 * Move all items from available to selected
 */
  moveAllItemsToSelected(): void {
    if (!this.availableItems.length) {
      return;
    }
    this.selectedItems = [...this.selectedItems, ...this.availableItems];
    this.availableItems = [];
    this.availableListBoxControl.setValue([]);
  }

  /**
   * Move all items from selected to available
   */
  moveAllItemsToAvailable(): void {
    if (!this.selectedItems.length) {
      return;
    }
    this.availableItems = [...this.availableItems, ...this.selectedItems];
    this.selectedItems = [];
    this.selectedListBoxControl.setValue([]);
  }

  /**
   * Move marked items from available items to selected items
   */
  moveMarkedAvailableItemsToSelected(): void {
    let itemSelected = [];
    for (let i = 0; i < this.availableListBoxControl.value.length; i++) {
      let itemT = this.availableItems.filter((listItem: any) => listItem.id == this.availableListBoxControl.value[i]);
      itemSelected.push(itemT[0]);
    }
    for (let i = 0; i < itemSelected.length; i++) {
      this.availableItems = this.availableItems.filter((listItem: any) => listItem.id !== itemSelected[i].id);
    }
    this.selectedItems = [...this.selectedItems, ...itemSelected];
    this.availableListBoxControl.setValue([]);
  }

  /**
   * Move marked items from selected items to available items
   */
  moveMarkedSelectedItemsToAvailable(): void {
    let itemSelected = [];
    for (let i = 0; i < this.selectedListBoxControl.value.length; i++) {
      let itemT = this.selectedItems.filter((listItem: any) => listItem.id == this.selectedListBoxControl.value[i]);
      itemSelected.push(itemT[0]);
    }
    for (let i = 0; i < itemSelected.length; i++) {
      this.selectedItems = this.selectedItems.filter((listItem: any) => listItem.id !== itemSelected[i].id);
    }
    this.availableItems = [...this.availableItems, ...itemSelected];
    this.selectedListBoxControl.setValue([]);
  }

  /**
   * Move single item from available to selected
   * 
   */
  moveAvailableItemToSelected(item: any): void {
    this.availableItems = this.availableItems.filter((listItem: any) => listItem.id !== item.id);
    this.selectedItems = [...this.selectedItems, item];
    this.availableListBoxControl.setValue([]);
  }

  /**
   * Move single item from selected to available
   * 
   */
  moveSelectedItemToAvailable(item: any): void {
    this.selectedItems = this.selectedItems.filter((listItem: any) => listItem.id !== item.id);
    this.availableItems = [...this.availableItems, item];
    this.selectedListBoxControl.setValue([]);
  }

  /**
   * Move single item up at selected
   * 
   */
  moveItemsUp() {
    let itemFound = this.selectedItems.filter((listItem: any) => listItem.id == this.selectedListBoxControl.value[0]);
    let itemPos = this.selectedItems.indexOf(itemFound[0]);
    if (itemPos > 0) {
      let array1 = this.selectedItems.slice(0, itemPos - 1);
      let array2 = this.selectedItems.slice(itemPos + 1, this.selectedItems.length);
      this.selectedItems = [...array1, ...itemFound[0], ...this.selectedItems[itemPos - 1], ...array2];
    }
  }

  /**
   * Move single item down at selected
   * 
   */
  moveItemsDown() {
    let itemFound = this.selectedItems.filter((listItem: any) => listItem.id == this.selectedListBoxControl.value[0]);
    let itemPos = this.selectedItems.indexOf(itemFound[0]);
    if (itemPos < this.selectedItems.length - 1) {
      let array1 = this.selectedItems.slice(0, itemPos);
      let array2 = this.selectedItems.slice(itemPos + 2, this.selectedItems.length);
      this.selectedItems = [...array1, ...this.selectedItems[itemPos + 1], ...itemFound[0], ...array2];
    }
  }

  submit() {
    let dataCh = []
    this.selectedItems.forEach((elemt) => {
      dataCh.push(elemt.id);
    });
    this.loader.open();
    this.getItemSub = this.centroService.postOrdenarChoferesListaCentro(this.data.payload.id, dataCh)
      .subscribe(data => {
        this.loader.close();
        this.alertService.confirm({ message: '¡Lista de Choferes guardada correctamente!', tipo: 'exito' }).subscribe(res => {
          if (res) {
            this.dialogRef.close(false)
          }
        });
      },
        error => {
          this.loader.close();
          this.errorService.confirm({ message: 'La lista de Choferes no se pudo guardar, intentelo nuevamente' }).subscribe(res => {
            if (res) {
              return;
            }
          });
        });
  }
}
