import { TablaHorariosComponent } from "@app/views/destino/tabla-horarios/tabla-horarios.component";
import { TablaHorarioFertilizantesComponent } from "@app/views/fertilizante/tabla-horario-fertilizantes/tabla-horario-fertilizantes.component";
import {
  ItemCartaPorte,
  Items,
  ItemsCuit,
  ItemsDestinatarios,
} from "../models";
import { ItemsComercial } from "../models/items";

export module FunctionWorkDataTable {
  export function AddDestinatario(variables, itemDestinatario, itemDestino) {
    let tempDest = variables.destinatarios.find(
      (item) => item.cuit === itemDestinatario.cuit
    );

    if (!tempDest) {
      let newItem = new ItemsDestinatarios();
      newItem.id = (variables.destinatarios.length + 1).toString();
      newItem.cuit = itemDestinatario.cuit;
      newItem.descripcion = itemDestinatario.razon_social;
      newItem.destinos = [
        {
          id: 0,
          cuit: "",
          descripcion: "Todos",
        },
      ];
      if (itemDestino) {
        itemDestino.id = 1;
        newItem.destinos.push(itemDestino);
      }
      variables.destinatarios.push(newItem);
    } else {
      let tempDestino = tempDest.destinos.find(
        (item) => item.cuit === itemDestino.cuit
      );
      if (!tempDestino) {
        itemDestino.id = tempDest.destinos.length + 1;
        tempDest.destinos.push(itemDestino);
      }
      tempDest.destinos.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
    }
    variables.destinatarios.sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );
    let itemTodos = variables.destinatarios.find((x) => x.id === 0);
    if (itemTodos) {
      variables.destinatarios.splice(
        variables.destinatarios.indexOf(itemTodos),
        1
      );
    }
    variables.destinatarios.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
      destinos: [
        {
          id: 0,
          cuit: "",
          descripcion: "Todos",
        },
      ],
    });
  }

  export function AddElementCartaPorte(variables, element: ItemCartaPorte) {
    if (element.comercial) {
      let temp = variables.comerciales.find(
        (item) => item.cuit === element.comercial.cuit
      );
      if (!temp) {
        let newItem = new ItemsComercial();
        newItem.id = (variables.comerciales.length + 1).toString();
        newItem.cuit = element.comercial.cuit;
        newItem.descripcion = element.comercial.descripcion;
        newItem.clientes = [
          {
            id: 0,
            cuit: "",
            descripcion: "Todos",
          },
        ];
        if (element.cliente) {
          element.cliente.id = 1;
          newItem.clientes.push(element.cliente);
        } else {
          let newCliente = new ItemsCuit();
          newCliente.id = 1;
          newCliente.cuit = "00000000000";
          newCliente.descripcion = "Sin cliente asociado";
          newItem.clientes.push(newCliente);
        }
        variables.comerciales.push(newItem);
      } else {
        if (element.cliente) {
          let tempCliente = temp.clientes.find(
            (item) => item.cuit === element.cliente.cuit
          );
          if (!tempCliente) {
            element.cliente.id = temp.clientes.length + 1;
            temp.clientes.push(element.cliente);
          }
          temp.clientes.sort((a, b) =>
            a.descripcion.localeCompare(b.descripcion)
          );
          let itemTodos = temp.clientes.find((x) => x.id === 0);
          if (itemTodos) {
            temp.clientes.splice(temp.clientes.indexOf(itemTodos), 1);
          }
          temp.clientes.unshift({
            id: 0,
            cuit: "",
            descripcion: "Todos",
          })
        } else {
          let tempCliente = temp.clientes.find(
            (item) => item.cuit === "00000000000"
          );
          if (!tempCliente) {
            let newCliente = new ItemsCuit();
            newCliente.id = temp.clientes.length + 1;
            newCliente.cuit = "";
            newCliente.descripcion = "Sin cliente asociado";
            temp.clientes.push(newCliente);
          }
          temp.clientes.sort((a, b) =>
            a.descripcion.localeCompare(b.descripcion)
          );
          let itemTodos = temp.clientes.find((x) => x.id === 0);
          if (itemTodos) {
            temp.clientes.splice(temp.clientes.indexOf(itemTodos), 1);
          }
          temp.clientes.unshift({
            id: 0,
            cuit: "",
            descripcion: "Todos",
          })
        }
      }
    }
    variables.comerciales.sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );
    let itemTodos = variables.comerciales.find((x) => x.id === 0);
    if (itemTodos) {
      variables.comerciales.splice(variables.comerciales.indexOf(itemTodos), 1);
    }
    variables.comerciales.unshift({
      id: 0,
      cuit: "",
      descripcion: "Todos",
      clientes: [
        {
          id: 0,
          cuit: "",
          descripcion: "Todos",
        },
      ],
    });

    if (element.contrato) {
      let temp = variables.contratos.find(
        (item) => item.descripcion === element.contrato
      );
      if (!temp) {
        let newItem = new Items();
        newItem.id = (variables.contratos.length + 1).toString();
        newItem.descripcion = element.contrato;
        variables.contratos.push(newItem);
      }

    } else {
      let temp = variables.contratos.find(
        (item) => item.descripcion === "Sin nominar contrato"
      );
      if (!temp) {
        let newItem = new Items();
        newItem.id = (variables.contratos.length + 1).toString();
        newItem.descripcion = "Sin nominar contrato";
        variables.contratos.push(newItem);
      }
    }
    variables.contratos.sort((a, b) =>
      a.descripcion.localeCompare(b.descripcion)
    );
    let itemTodosContratos = variables.contratos.find((x) => x.id === 0);
    if (itemTodos) {
      variables.contratos.splice(
        variables.comerciales.indexOf(itemTodosContratos),
        1
      );
    }
    variables.contratos.unshift({
      id: 0,
      descripcion: "Todos",
    });
  }
  export function AddCorredor(variables, item) {
    let encontrado = false;
    for (let i = 0; i < variables.corredores.length; i++) {
      if (variables.corredores[i].cuit === item.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newItem = new ItemsCuit();
      newItem.id = (variables.corredores.length + 1).toString();
      newItem.cuit = item.cuit;
      newItem.descripcion = item.descripcion;
      variables.corredores.push(newItem);
    }
  }
  export function AddComercial(variables, item) {
    let encontrado = false;
    for (let i = 0; i < variables.comerciales.length; i++) {
      if (variables.comerciales[i].cuit === item.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newItem = new ItemsCuit();
      newItem.id = (variables.comerciales.length + 1).toString();
      newItem.cuit = item.cuit;
      newItem.descripcion = item.descripcion;
      variables.comerciales.push(newItem);
    }
  }
  export function AddDestino(variables, item) {
    let encontrado = false;
    for (let i = 0; i < variables.destino.length; i++) {
      if (variables.destino[i].cuit === item.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newItem = new ItemsCuit();
      newItem.id = (variables.destino.length + 1).toString();
      newItem.cuit = item.cuit;
      newItem.descripcion = item.descripcion;
      variables.destino.push(newItem);
    }
  }
  export function AddContrato(variables, item) {
    let encontrado = false;
    for (let i = 0; i < variables.contrato.length; i++) {
      if (variables.contrato[i].cuit === item.cuit) {
        encontrado = true;
        break;
      }
    }
    if (!encontrado) {
      let newItem = new ItemsCuit();
      newItem.id = (variables.contrato.length + 1).toString();
      newItem.cuit = item.cuit;
      newItem.descripcion = item.descripcion;
      variables.contrato.push(newItem);
    }
  }
}
