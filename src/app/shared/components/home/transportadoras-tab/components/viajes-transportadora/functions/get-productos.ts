
export function getProductos(variables, centroProductoService, f) {
  centroProductoService.getCentroProducto().subscribe((productos) => {
    variables.productos = productos.data;
    variables.productos.unshift({
      id: 0,
      descripcion: 'Todos'
    })
    f.selectedProducto.setValue(variables.productos[0].id);
  });
}
