export class ReservasDB {
  public ELEMENT_DATA = [
    {
      "id": "4064",
      "id_cliente": "9912",
      "cliente": "ACOPIO",
      "terminal": "PROFERTIL PGSM",
      "destino": "ACOPIO MONTES DE OCA",
      "solicitante": "PEDIDO07",
      "observaciones": "SON TRES PRODUCTOS PARA ESTA RESERVA",
      "reservas": [
          {
              "id_reserva": "000000000210",
              "id_chofer": 8750,
              "stoc": "787878711122223",
              "fecha_pedido": "2021-04-07",
              "estado": 1,
              "chofer": "Gianetti Lautaro",
              "patente_acoplado": "HUO350",
              "patente_camion": "HUO349",
              "productos": [
                  {
                      "id_tipo_despacho": "1",
                      "tipo_despacho": "Bolson",
                      "producto": "Fertilizante Sólido",
                      "contrato": "4444",
                      "composicion": null,
                      "cantidad": "3"
                  },
                  {
                      "id_tipo_despacho": "3",
                      "tipo_despacho": "Granel Mezcla",
                      "producto": "Sulfato de Calcio Granel",
                      "contrato": "4444",
                      "composicion": null,
                      "cantidad": "30"
                  },
                  {
                      "id_tipo_despacho": "4",
                      "tipo_despacho": "Embolsado",
                      "producto": "Proterra",
                      "contrato": "4444",
                      "composicion": "50%",
                      "cantidad": "12"
                  }
              ]
          },
          {
            "id_reserva": "000000000211",
            "id_chofer": null,
            "stoc": "787878711122223",
            "fecha_pedido": "2021-04-07",
            "estado": 1,
            "chofer": "Gianetti Lautaro",
            "patente_acoplado": "HUO350",
            "patente_camion": "HUO349",
            "productos": [
                {
                    "id_tipo_despacho": "1",
                    "tipo_despacho": "Bolson",
                    "producto": "Fertilizante Sólido",
                    "contrato": "4444",
                    "composicion": null,
                    "cantidad": "3"
                },
                {
                    "id_tipo_despacho": "3",
                    "tipo_despacho": "Granel Mezcla",
                    "producto": "Sulfato de Calcio Granel",
                    "contrato": "4444",
                    "composicion": null,
                    "cantidad": "30"
                },
                {
                    "id_tipo_despacho": "4",
                    "tipo_despacho": "Embolsado",
                    "producto": "Proterra",
                    "contrato": "4444",
                    "composicion": "50%",
                    "cantidad": "12"
                }
            ]
        }
      ]
    }
  ]
  public ELEMENT_PEDIDOS = [
    {
      "id": "4198",
      "id_cliente": "9912",
      "cliente": "ACOPIO",
      "terminal": "PROFERTIL PGSM",
      "destino": "ACOPIO MONTES DE OCA",
      "solicitante": "Leandro Bordigoni",
      "observaciones": "Pruebas Monitor Comercial Nuevo",
      "reservas": [
          {
              "id_reserva": "000000000417",
              "id_pedido": "4198",
              "id_reserva_real": 417,
              "id_chofer": 7760,
              "stoc": "45435251",
              "fecha_pedido": "2021-04-29",
              "chofer": "Bor Leandro",
              "patente_acoplado": "AB730QB",
              "patente_camion": "KMH541",
              "cuit": "20395015622",
              "productos": [
                  {
                      "id_tipo_despacho": "1",
                      "tipo_despacho": "Bolson",
                      "producto": "Fosfato",
                      "contrato": "4332432",
                      "composicion": null,
                      "cantidad": "20"
                  },
                  {
                      "id_tipo_despacho": "4",
                      "tipo_despacho": "Embolsado",
                      "producto": "Proterra",
                      "contrato": "5435251",
                      "composicion": "54%",
                      "cantidad": "25"
                  }
              ]
          },
          {
              "id_reserva": "000000000418",
              "id_pedido": "4198",
              "id_reserva_real": 418,
              "id_chofer": null,
              "stoc": "432513541",
              "fecha_pedido": "2021-04-29",
              "productos": [
                  {
                      "id_tipo_despacho": "2",
                      "tipo_despacho": "Liquido",
                      "producto": "Fertilizante Líquido Solmix Zinc",
                      "contrato": "442413",
                      "composicion": null,
                      "cantidad": "30"
                  },
                  {
                      "id_tipo_despacho": "2",
                      "tipo_despacho": "Liquido",
                      "producto": "Fertilizante Líquido N S 28-5",
                      "contrato": "23451",
                      "composicion": null,
                      "cantidad": "15"
                  }
              ]
          }
      ]
    },
    {
    "id": "4199",
    "id_cliente": "9912",
    "cliente": "ACOPIO",
    "terminal": "PROFERTIL PGSM",
    "destino": "ACOPIO MONTES DE OCA",
    "solicitante": "Leandro Bordigoni",
    "observaciones": "Todo ok",
    "reservas": [
        {
            "id_reserva": "000000000419",
            "id_pedido": "4198",
            "id_reserva_real": 417,
            "id_chofer": 7760,
            "stoc": "45435251",
            "fecha_pedido": "2021-04-29",
            "chofer": "Bor Leandro",
            "patente_acoplado": "AB730QB",
            "patente_camion": "KMH541",
            "cuit": "20395015622",
            "productos": [
                {
                    "id_tipo_despacho": "1",
                    "tipo_despacho": "Bolson",
                    "producto": "Fosfato",
                    "contrato": "4332432",
                    "composicion": null,
                    "cantidad": "20"
                },
                {
                    "id_tipo_despacho": "4",
                    "tipo_despacho": "Embolsado",
                    "producto": "Proterra",
                    "contrato": "5435251",
                    "composicion": "54%",
                    "cantidad": "25"
                }
            ]
        },
        {
            "id_reserva": "000000000420",
            "id_pedido": "4198",
            "id_reserva_real": 418,
            "id_chofer": null,
            "stoc": "432513541",
            "fecha_pedido": "2021-04-29",
            "productos": [
                {
                    "id_tipo_despacho": "2",
                    "tipo_despacho": "Liquido",
                    "producto": "Fertilizante Líquido Solmix Zinc",
                    "contrato": "442413",
                    "composicion": null,
                    "cantidad": "30"
                },
                {
                    "id_tipo_despacho": "2",
                    "tipo_despacho": "Liquido",
                    "producto": "Fertilizante Líquido N S 28-5",
                    "contrato": "23451",
                    "composicion": null,
                    "cantidad": "15"
                }
            ]
        }
    ]
    }

  ]
}
