export function convertirHora(horaOriginal) {
  // Paso 1: Convertir de formato de 12 horas a formato de 24 horas
  let horas = Number(horaOriginal.split(':')[0]);
  let minutos = Number(horaOriginal.split(':')[1].split(' ')[0]);
  let periodo = horaOriginal.split(':')[1].split(' ')[1];

  if (periodo === 'PM' && horas !== 12) {
    horas += 12;
  }

  // Paso 2: Añadir los minutos y segundos a la hora en formato de 24 horas
  let hora24 = horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0') + ':00';

  // Paso 3: Formatear la hora en el formato deseado
  let horaSplit = hora24.split(':');
  let hora = Number(horaSplit[0]);
  let horaConvertida = hora < 10 ? '0' + hora.toString() : hora.toString();
  let minutosConvertidos = horaSplit[1];
  let segundosConvertidos = horaSplit[2];
  horaConvertida = horaConvertida + ':' + minutosConvertidos + ':' + segundosConvertidos;

  return horaConvertida;
}
