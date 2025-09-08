export function initProductos(productos, filtrarForm, filtro) {
  let tempProducto = productos.find(
    (item) => item.descripcion.toLowerCase() === "soja"
  );
  if (tempProducto) {
    filtrarForm.controls["selectedProducto"].setValue(tempProducto.id);
    filtro.id_producto = tempProducto.id.toString();
    filtro.producto = tempProducto.descripcion;
  } else {
    filtrarForm.controls["selectedProducto"].setValue(
      productos[0].id
    );
    filtro.id_producto = productos[0].id.toString();
    filtro.producto = productos[0].descripcion;
  }
}
