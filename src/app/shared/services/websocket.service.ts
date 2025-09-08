import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus = false;
  constructor(private socket: Socket) {
    // this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connect', () => {
      this.socketStatus = true;
      const payload = {
        nombre: localStorage.getItem('nameUser'),
        consultas: true,
      };
      this.emit('configurar-usuario', payload);
    });

    this.socket.on('disconnect', () => {
      this.socketStatus = false;
    })
  }
  emit(evento: string, payload?: any, callback?: Function) {
    // emit('EVENTO',payload,callback?)


    this.socket.emit(evento, payload, callback);
  }

  listen(evento: string) {
    return this.socket.fromEvent(evento);
  }
}
