import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { GlobalService } from '../models/global.service';


const headers = new HttpHeaders({
  'Content-Type': 'application/json; charset=UTF-8',
  'Authorization': localStorage.getItem('token')
});


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;
  constructor(private globalService: GlobalService, private http: HttpClient) { }

  login(username, password, captcha) {
    return this.http.post<any>(this.globalService.apiHost + 'login/login-panel', ({
      username: username,
      password: password,
      captcha: captcha,
    }))
      .pipe(map(res => {
        if (res.status = 1) {
          this.setSession(res.data);
        } else {
        }
        return (res.data);
      }));
  }
  activate(postData) {
    return this.http.post<any>(this.globalService.apiHost + 'login/access-token', postData)
      .pipe(map(res => {
        console.log(res);
        if (res.status = 1) {
          localStorage.setItem('token', res.data.access_token);
          localStorage.setItem('currentUser', 'true');
          localStorage.setItem('tipo_turneada', res.data.tipo_turneada);
          localStorage.setItem('linea_whats_app', res.data.linea_whats_app);
          localStorage.setItem('contratoRequerido', res.data.contratoRequerido);
          localStorage.setItem('dador_turno_destino', res.data.persona.dador_turno_destino);
          this.setSession(res.data);

        } else {
        }
        return (res.data);
      }));
  }
  prueba() {
    return this.http.get<any>(this.globalService.apiHost + '/prueba', {
      headers: headers
    })
      .pipe(map(res => {
        if (res.status = 1) {
          this.setSession(res.data);
        } else {
        }
        return (res.data);
      }));
  }

  test() {
    return 'trabajando el Auth Service- Test';
  }
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userName');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('token');
    localStorage.removeItem('rolesUser');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('visualiza_flota_intermediario');
    localStorage.removeItem('visualizaLog');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreRol');
    localStorage.removeItem('idUserRol');
    localStorage.removeItem('clienteMuvin');
    localStorage.removeItem('idCentro');
    localStorage.removeItem('esClienteFinal');
    localStorage.removeItem('esDadorCupo');
    localStorage.removeItem('select_dador_id');
    localStorage.removeItem('select_dador_cuit');
    localStorage.removeItem('select_dador_nombre_persona');
    localStorage.removeItem('limitado_dador');
    localStorage.removeItem('condiciones_viaje');
    localStorage.removeItem('id_operador');
    localStorage.removeItem('nameUser');
    localStorage.removeItem('dador_seleccionado');
    localStorage.removeItem('cuit_cuil');
    localStorage.removeItem('esIntermediario');
    localStorage.removeItem('tipo_turneada');
    localStorage.removeItem('linea_whats_app');
    localStorage.removeItem('id_tipo_turneada');
    localStorage.removeItem('accept_tyc');
    localStorage.removeItem('contratoRequerido');
    localStorage.removeItem('usaCupera');
    localStorage.removeItem('usaMtr');
    localStorage.removeItem('formularioCupera');
    localStorage.removeItem('idUser');
    localStorage.removeItem('horas');
    localStorage.removeItem('km');
    localStorage.removeItem('esDestinatario');
    localStorage.removeItem('asDestinatario');
    localStorage.removeItem('tipo_interviniente');
    localStorage.removeItem("esMuvinProveedor");
  }

  private setSession(authResult) {
    /* const expireAt = moment().add(authResult.expires_at, 'second');
    console.log('ExpiresAt del servidor',expireAt);   */
    localStorage.setItem('expires_at', JSON.stringify(authResult.expires_at));
    //localStorage.setItem('expires_at', JSON.stringify(expireAt));
  }
  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    return JSON.parse(expiration);

  }
}
