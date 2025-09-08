import { ItemsCuit } from "../../cupera3/asignacion-c3/models";
import { Corredor, Items } from "../models";

function aplicarFiltroCcpp(cmd) {
  this.chanceData = true;
  let otroDestinatario = this.destinatarios.find(
    (item) => item.cuit === this.filtro.idCuitDestinatario
  );
  let temporalCcpp = otroDestinatario.ccpp.find(
    (item) => item.id === cmd.value
  );
  this.filtro.idCcpp = temporalCcpp.cuit.toString();
}

function aplicarFiltroRte(cmd) {
  this.chanceData = true;

  let otroDestinatario = this.destinatarios.find(
    (item) => item.cuit === this.filtro.idCuitDestinatario
  );

  let temporalRte = otroDestinatario.rte.find(
    (item) => item.id === cmd.value
  );

  this.filtro.idRte = temporalRte.cuit.toString();
}

function aplicarFiltroDestino(cmd) {
  this.chanceData = true;
  let otroDestinatario = this.destinatarios.find(
    (item) => item.cuit === this.filtro.idCuitDestinatario
  );
  let temporalDestino = otroDestinatario.destinos.find(
    (item) => item.id === cmd.value
  );
  this.filtro.idDestino = temporalDestino.id.toString();
}

function aplicarFiltroCorredor(cmd) {
  this.chanceData = true;
  this.inicializarContraparte2();
  this.inicializarContratos2();
  this.inicializarDestinatariosSolicitudes2();
  this.inicializarZonas2();
  let selectedCorredor = this.corredores.find(
    (item) => item.id === cmd.value
  );
  this.filtro.corredor = selectedCorredor.descripcion;
  if (cmd.value === 0) {
    // Seleccionado todos
    this.filtro.corredor = "";
    for (let index = 0; index < this.solicitudesApi.length; index++) {
      const element = this.solicitudesApi[index];
      if (
        element.corredor &&
        element.id_producto == this.filtro.id_producto
      ) {
        let isCorredor =
          this.detallesDisponiblesApi.corredor_contraparte[element.corredor]
            .esCorredor == "0"
            ? false
            : true;
        let contra = "";
        if (isCorredor) {
          contra = element.contraparte
            ? this.detallesDisponiblesApi.corredor_contraparte[
              element.contraparte
            ].razon_social
            : "Sin contraparte asociada";
        } else {
          contra =
            this.detallesDisponiblesApi.corredor_contraparte[element.corredor]
              .razon_social;
        }
        let cuitContraparte = isCorredor
          ? element.contraparte
          : element.corredor;
        let contraparteparams = {
          cuit: cuitContraparte,
          descripcion: contra,
        };

        this.addContraparte(contraparteparams);
        let destinatarioSolicitudparams = {
          descripcion:
            !element.destinatario || element.destinatario == ""
              ? "Sin destinatario asociado"
              : this.detallesDisponiblesApi.destinatarios[
                element.destinatario
              ].razon_social,
        };
        this.addDestinatarioSolicitud(destinatarioSolicitudparams);
        let contratoparams = {
          descripcion:
            !element.contrato || element.contrato == ""
              ? "Sin nominar"
              : element.contrato,
        };
        this.addContrato(contratoparams);
        let zonaparams = {
          descripcion:
            !element.id_zona_solicitud || element.id_zona_solicitud == ""
              ? "Sin nominar"
              : this.detallesDisponiblesApi.zonas[element.id_zona_solicitud]
                .nombreZona,
        };
        this.addZona(zonaparams);
        let caratulaparams = {
          descripcion:
            !element.caratula || element.caratula == ""
              ? "Sin nominar"
              : element.caratula,
        };
        this.addCaratula(caratulaparams);
      }
    }
  }
  if (selectedCorredor.descripcion === this.myData.lbCorredor) {
    //seleccionado todos
    for (let index = 0; index < this.solicitudesApi.length; index++) {
      const element = this.solicitudesApi[index];
      if (
        element.corredor &&
        element.id_producto == this.filtro.id_producto
      ) {
        let isCorredor =
          this.detallesDisponiblesApi.corredor_contraparte[element.corredor]
            .esCorredor == "0"
            ? false
            : true;
        let contra = "";
        if (!isCorredor) {
          contra =
            this.detallesDisponiblesApi.corredor_contraparte[element.corredor]
              .razon_social;
          let cuitContraparte = isCorredor
            ? element.contraparte
            : element.corredor;
          let contraparteparams = {
            cuit: cuitContraparte,
            descripcion: contra,
          };
          this.addContraparte(contraparteparams);
          let destinatarioSolicitudparams = {
            descripcion:
              !element.destinatario || element.destinatario == ""
                ? "Sin destinatario asociado"
                : this.detallesDisponiblesApi.destinatarios[
                  element.destinatario
                ].razon_social,
          };
          this.addDestinatarioSolicitud(destinatarioSolicitudparams);
          let contratoparams = {
            descripcion:
              !element.contrato || element.contrato == ""
                ? "Sin nominar"
                : element.contrato,
          };
          this.addContrato(contratoparams);
          let zonaparams = {
            descripcion:
              !element.id_zona_solicitud || element.id_zona_solicitud == ""
                ? "Sin nominar"
                : this.detallesDisponiblesApi.zonas[element.id_zona_solicitud]
                  .nombreZona,
          };
          this.addZona(zonaparams);
          let caratulaparams = {
            descripcion:
              !element.caratula || element.caratula == ""
                ? "Sin nominar"
                : element.caratula,
          };
          this.addCaratula(caratulaparams);
        }
      }
    }
  } else {
    //resto es un corredor
    for (let index = 0; index < this.solicitudesApi.length; index++) {
      const element = this.solicitudesApi[index];
      if (element.corredor && element.corredor === selectedCorredor.cuit) {
        let contra = "";
        contra = element.contraparte
          ? this.detallesDisponiblesApi.corredor_contraparte[
            element.contraparte
          ].razon_social
          : "Sin contraparte asociada";
        let cuitContraparte = element.contraparte;
        let contraparteparams = {
          cuit: cuitContraparte,
          descripcion: contra,
        };
        this.addContraparte(contraparteparams);
        let destinatarioSolicitudparams = {
          descripcion:
            !element.destinatario || element.destinatario == ""
              ? "Sin destinatario asociado"
              : this.detallesDisponiblesApi.destinatarios[
                element.destinatario
              ].razon_social,
        };
        this.addDestinatarioSolicitud(destinatarioSolicitudparams);
        let contratoparams = {
          descripcion:
            !element.contrato || element.contrato == ""
              ? "Sin nominar"
              : element.contrato,
        };
        this.addContrato(contratoparams);
        let zonaparams = {
          descripcion:
            !element.id_zona_solicitud || element.id_zona_solicitud == ""
              ? "Sin nominar"
              : this.detallesDisponiblesApi.zonas[element.id_zona_solicitud]
                .nombreZona,
        };
        this.addZona(zonaparams);
        let caratulaparams = {
          descripcion:
            !element.caratula || element.caratula == ""
              ? "Sin nominar"
              : element.caratula,
        };
        this.addCaratula(caratulaparams);
      }
    }
  }
  if (this.contrapartes.length > 0) {
    this.ordenarContraparte();
  }
  if (this.destinatariosSolicitudes.length > 0) {
    this.ordenarDestinatariosSolicitudes();
  }
  if (this.contratos.length > 0) {
    this.ordenarContratos();
  }
  if (this.zonas.length > 0) {
    this.ordenarZonas();
  }
  if (this.caratulas.length > 0) {
    this.ordenarCaratulas();
  }
  this.filtrarForm.controls["selectedContraparte"].setValue(
    this.contrapartes[0].id
  );
  this.filtro.contraparte = "";
  this.filtrarForm.controls["selectedDestSolic"].setValue(
    this.destinatariosSolicitudes[0].id
  );
  this.filtro.destSolic = "";
  this.filtrarForm.controls["selectedContrato"].setValue(
    this.contratos[0].id
  );
  this.filtro.contrato = "";
  this.filtro.caratula = "";
  this.filtrarForm.controls["selectedCaratula"].setValue(
    this.caratulas[0].id
  );
  this.filtrarForm.controls["selectedZona"].setValue(this.zonas[0].id);
  this.filtro.zona = "";
}

function aplicarFiltroContraparte(cmd) {
  this.chanceData = true;
  if (cmd.value === -1) {
    this.filtro.contraparte = "";
  } else {
    let otroContraparte = this.contrapartes.find(
      (item) => item.id === cmd.value
    );
    this.filtro.contraparte = otroContraparte.descripcion;
  }
}

function aplicarFiltroDestSolicitud(cmd) {
  this.chanceData = true;
  if (cmd.value === -1) {
    this.filtro.destSolic = "";
  } else {
    let otroDestinatario = this.destinatariosSolicitudes.find(
      (item) => item.id === cmd.value
    );
    this.filtro.destSolic = otroDestinatario.descripcion;
  }
}

function aplicarFiltroContrato(cmd) {
  this.chanceData = true;
  if (cmd.value === -1) {
    this.filtro.contrato = "";
  } else {
    let otroContrato = this.contratos.find((item) => item.id === cmd.value);
    this.filtro.contrato = otroContrato.descripcion;
  }
}

function aplicarFiltroCaratula(cmd) {
  this.chanceData = true;
  if (cmd.value === -1) {
    this.filtro.caratula = "";
  } else {
    let otroCaratula = this.caratulas.find((item) => item.id === cmd.value);
    this.filtro.caratula = otroCaratula.descripcion;
  }
}

function aplicarFiltroZona(cmd) {
  this.chanceData = true;
  if (cmd.value === -1) {
    this.filtro.zona = "";
  } else {
    let otraZona = this.zonas.find((item) => item.id === cmd.value);
    this.filtro.zona = otraZona.descripcion;
  }
}

function addProducto(prod) {
  let encontrado = false;
  for (let i = 0; i < this.productos.length; i++) {
    if (this.productos[i].id === prod.id) {
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    this.productos.push(prod);
  }
}

function addCcpp(ccpp) {
  let encontrado = false;

  for (let i = 0; i < this.ccpp.length; i++) {
    if (this.ccpp[i].cuit === ccpp.cuit) {
      encontrado = true;
      break;
    }
  }

  if (!encontrado) {
    let newItem = new ItemsCuit();
    newItem.id = this.ccpp.length + 1;
    newItem.descripcion = ccpp.descripcion;
    newItem.cuit = ccpp.cuit;
    this.ccpp.push(newItem);
  }
}

function addCcppCon(idCuitDestinatario, ccpp) {
  if (idCuitDestinatario !== "") {
    let tempDestinatario = this.destinatarios.find(
      (item) => item.cuit === idCuitDestinatario
    );
    let encontrado = false;
    if (tempDestinatario) {
      for (let i = 0; i < tempDestinatario.ccpp.length; i++) {
        if (tempDestinatario.ccpp[i].cuit === ccpp.cuit) {
          encontrado = true;
          break;
        }
      }
    }

    if (!encontrado) {
      let newItem = new ItemsCuit();
      newItem.id = tempDestinatario.ccpp.length + 1;
      newItem.descripcion = ccpp.descripcion;
      newItem.cuit = ccpp.cuit;
      tempDestinatario.ccpp.push(newItem);
    }
    tempDestinatario.ccpp.shift();
    tempDestinatario.ccpp.sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );
    tempDestinatario.ccpp.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });
  }
}

function addRteCon(idCuitDestinatario, rte) {
  if (idCuitDestinatario !== "") {
    let tempDestinatario = this.destinatarios.find(
      (item) => item.cuit === idCuitDestinatario
    );
    let encontrado = false;
    if (tempDestinatario) {
      for (let i = 0; i < tempDestinatario.rte.length; i++) {
        if (tempDestinatario.rte[i].cuit === rte.cuit) {
          encontrado = true;
          break;
        }
      }
    }

    if (!encontrado) {
      let newItem = new ItemsCuit();
      newItem.id = tempDestinatario.rte.length + 1;
      newItem.descripcion = rte.descripcion;
      newItem.cuit = rte.cuit;
      tempDestinatario.rte.push(newItem);
    }
    tempDestinatario.rte.shift();
    tempDestinatario.rte.sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );
    tempDestinatario.rte.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
    });
  }
}

function addCorredor(corr) {
  let tempCorredor = this.corredores.find(
    (item) => item.descripcion === corr.descripcion
  );
  if (tempCorredor == undefined) {
    let newCorredor = new Corredor();
    newCorredor.id = this.corredores.length;
    newCorredor.cuit = corr.cuit;
    newCorredor.descripcion = corr.descripcion;
    this.corredores.push(newCorredor);
  }
  this.corredores.shift();
  this.corredores.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
  this.corredores.unshift({
    id: 0,
    cuit: "",
    descripcion: "Todos",
  });
}

function addContraparte(contra) {
  let encontrado = false;
  for (let i = 0; i < this.contrapartes.length; i++) {
    if (this.contrapartes[i].descripcion === contra.descripcion) {
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    let newContraparte = new ItemsCuit();
    newContraparte.id = this.contrapartes.length + 1;
    newContraparte.cuit = contra.cuit;
    newContraparte.descripcion = contra.descripcion;
    this.contrapartes.push(newContraparte);
  }
}

function addDestinatarioSolicitud(destinatario) {
  let encontrado = false;
  for (let i = 0; i < this.destinatariosSolicitudes.length; i++) {
    if (
      this.destinatariosSolicitudes[i].descripcion ===
      destinatario.descripcion
    ) {
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    let newDestinatario = new Items();
    newDestinatario.id =
      destinatario.descripcion == "Sin destinatario asociado"
        ? 0
        : this.destinatariosSolicitudes.length + 1;
    newDestinatario.descripcion = destinatario.descripcion;
    this.destinatariosSolicitudes.push(newDestinatario);
  }
}

function addContrato(data) {
  let encontrado = false;
  for (let i = 0; i < this.contratos.length; i++) {
    if (this.contratos[i].descripcion === data.descripcion) {
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    let newContrato = new Items();
    newContrato.id =
      data.descripcion == "Sin nominar" ? 0 : this.contratos.length + 1;
    newContrato.descripcion = data.descripcion;
    this.contratos.push(newContrato);
  }
}

function addZona(data) {
  let encontrado = false;
  for (let i = 0; i < this.zonas.length; i++) {
    if (this.zonas[i].descripcion === data.descripcion) {
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    let newZona = new Items();
    newZona.id =
      data.descripcion == "Sin nominar"
        ? 0
        : this.zonas.length == 0
          ? 1
          : this.zonas.length + 1;
    newZona.descripcion = data.descripcion;
    this.zonas.push(newZona);
  }
}

function addCaratula(data) {
  let encontrado = false;
  for (let i = 0; i < this.caratulas.length; i++) {
    if (this.caratulas[i].descripcion === data.descripcion) {
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    let newCaratula = new Items();
    newCaratula.id =
      data.descripcion == "Sin nominar" ? 0 : this.caratulas.length + 1;
    newCaratula.descripcion = data.descripcion;
    this.caratulas.push(newCaratula);
  }
}
