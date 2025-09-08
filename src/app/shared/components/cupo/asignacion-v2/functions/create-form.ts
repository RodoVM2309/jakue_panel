import { FormControl, FormGroup } from "@angular/forms";

export function createForm(fecha, filtro) {
  return new FormGroup({
    selectedFecha: new FormControl(new Date(fecha + " 12:00:00")),
    selectedProducto: new FormControl(filtro.id_producto),
    selectedDestinatario: new FormControl(filtro.idCuitDestinatario),
    selectedDestino: new FormControl(filtro.idDestino),
    selectedCliente: new FormControl(filtro.cliente),
    selectedDador: new FormControl(filtro.dador),
    selectedCcpp: new FormControl(filtro.idCcpp),
    selectedRte: new FormControl(filtro.idRte),
    selectedDestSolic: new FormControl(filtro.destSolic),
    selectedCorredor: new FormControl(filtro.corredor),
    selectedContraparte: new FormControl(filtro.contraparte),
    selectedContrato: new FormControl(filtro.contrato),
    selectedZona: new FormControl(filtro.zona),
    selectedCaratula: new FormControl(filtro.caratula),
  });
}

export function createGestionForm() {
  return new FormGroup({
    selectedAccion: new FormControl(0),
    cuposxModulos: new FormControl(""),
    selectedCabecera: new FormControl(""),
  });
}

export function createFormPedido(){
  return new FormGroup({
    selectedProducto: new FormControl(''),
    selectedFecha: new FormControl(new Date()),
    selectedDestino: new FormControl(''),
    selectedOrigenDestino: new FormControl(''),
    selectedTransportadora: new FormControl('')
  });
}
