
export function createForm(variables, fb) {
  variables.filtrarForm = fb.group({
    selectedProducto: [''],
    selectedFecha: [new Date()],
  });
}
