import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatProgressBar } from "@angular/material";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";

import { AppLoaderService } from "../../../shared/services/app-loader/app-loader.service";

import { AuthService } from "../../../shared/services/auth.service";
import { ReCaptchaV3Service } from "ng-recaptcha";

export interface Rol {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"],
})
export class SigninComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  // @ViewChild(MatButton) submitButton: MatButton;
  roles: Rol[];
  selectedRol: number;
  returnUrl: string;
  test = "just a test";
  postString: string = "";
  postString2: any;
  cod_auth: string = "";
  activated: boolean = false;
  accept_tyc: any;
  valError = false;
  errorShow = "";
  roluser: any;

  signinForm: FormGroup;
  signinRolForm: FormGroup;
  labelRolSelected = "Seleccione rol";

  constructor(
    private authenticationService: AuthService,
    public router: Router,
    private loader: AppLoaderService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      captcha: new FormControl(""),
    });
    this.signinRolForm = new FormGroup({
      rol: new FormControl("", Validators.required),
    });
    this.authenticationService.logout();
  }

  signin() {
    if (this.signinForm.invalid) {
      this.validateAllFormFields(this.signinForm);
      return;
    }

    this.recaptchaV3Service.execute('importantAction')
      .subscribe((token: string) => {
        this.signinForm.controls["captcha"].setValue(token);
        const signinData = this.signinForm.value;

        this.loader.open();
        this.postString =
          '{"username": "' +
          signinData.username +
          '","password":"' +
          signinData.password +
          '"}';
        this.authenticationService
          .login(signinData.username, signinData.password, signinData.captcha)
          .pipe(first())
          .subscribe(
            (data) => {
              if ((data.status = 1)) {
                this.cod_auth = data.authorization_code;
                let dataroles = this.excluirRol(data.roles);
                let acepto_tyc;

                if (data.acepto_tyc == null || data.acepto_tyc.acepta_tyc == 0) {
                  acepto_tyc = 0;
                } else {
                  acepto_tyc = 1;
                }
                
                console.log(data)
                localStorage.setItem("accept_tyc", acepto_tyc);
                localStorage.setItem("id_persona", data.acepto_tyc.id_persona);
                localStorage.setItem("logistica_propia", data.logistica_propia);
                localStorage.setItem("esMuvinProveedor", data.esMuvinProveedor);

                this.roluser = dataroles[0].id;
                if (dataroles.length === 1) {//33048 es solo para el usuario sarcom se hace excepcion
                  this.postString2 = {
                    authorization_code: data.authorization_code,
                    rol_id: dataroles[0].id,
                  };

                  this.authenticationService
                    .activate(this.postString2)
                    .pipe(first())
                    .subscribe(
                      (data) => {
                        // console.log(data)
                        this.loader.close();
                        //  localStorage.setItem("es_cliente_final", data.persona.es_cliente_final);
                        localStorage.setItem("posee_terminal", data.posee_terminal);
                        if ((data.status = 1)) {
                          this.valError = false;
                          localStorage.setItem("currentUser", "true");
                          localStorage.setItem("nameUser", data.persona.razon_social);
                          localStorage.setItem("rol", this.roluser);
                          localStorage.setItem("clienteMuvin",
                            data.persona_rol.id_rol === 11
                              ? data.centro_padre_persona.cliente_muvin
                              : data.persona.cliente_muvin
                          );
                          localStorage.setItem(
                            "visualiza_flota_intermediario",
                            data.persona_rol.id_rol === 11
                              ? data.centro_padre_persona
                                .visualiza_flota_intermediario
                              : data.persona.visualiza_flota_intermediario
                          );
                          localStorage.setItem(
                            "nombreRol",
                            data.persona_rol.nombre_rol
                          );
                          localStorage.setItem(
                            "esClienteFinal",
                            data.persona.es_cliente_final
                          );
                          localStorage.setItem(
                            "esDadorCupo",
                            data.persona.es_dador_cupo
                          );
                          localStorage.setItem(
                            "esIntermediario",
                            data.persona.es_intermediario
                          );
                          localStorage.setItem(
                            "cuit_cuil",
                            data.persona_rol.cuit_persona
                          );
                          localStorage.setItem("usaCupera", data.usaCupera);
                          localStorage.setItem("usaMtr", data.usaMtr);
                          localStorage.setItem(
                            "formularioCupera",
                            data.formularioCupera
                          );
                          localStorage.setItem(
                            "esDestinatario",
                            data.esDestinatario
                          );
                          localStorage.setItem(
                            "tipo_interviniente",
                            data.persona.tipo_interviniente
                          );

                          this.cod_auth = data.access_token;
                          let acepto_tyc = parseInt(
                            localStorage.getItem("accept_tyc")
                          );
                          /* */
                          if (acepto_tyc == 0) {
                            let redirectUrlTyC = "";

                            switch (this.selectedRol) {
                              case 1:
                                redirectUrlTyC = "/panel-pedido/pedido";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 3:
                                if (data.persona.es_dador_cupo) {
                                  redirectUrlTyC = "/cupo/cuponera";
                                } else {
                                  if (data.persona.es_cliente_final == '1') {
                                    redirectUrlTyC = "/panel-pedido/pedido";
                                  } else {
                                    redirectUrlTyC = "/panel-pedido/viajes";
                                  }
                                }
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 4:
                                redirectUrlTyC = "/home/difusion";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 5:
                                redirectUrlTyC = "/panel-pedido/pedido";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 6:
                                redirectUrlTyC = "/destinatario/panel";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;

                              case 11:
                                redirectUrlTyC = "/panel-pedido/pedido";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 12:
                                redirectUrlTyC = "/admin/consulta/0";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 13:
                                redirectUrlTyC = "/marketing/notificaciones";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 14:
                                redirectUrlTyC = "/magyp/gestion/dashboard";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 15:
                                redirectUrlTyC = "/fertilizante/admin-bandas";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                              case 16:
                                redirectUrlTyC = "/mtr/caratulas";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;

                              default:
                                redirectUrlTyC = "/panel-pedido/pedido";
                                localStorage.setItem(
                                  "redirectUrlTyC",
                                  redirectUrlTyC
                                );
                                break;
                            }

                            this.router.navigateByUrl("/terms-and-conditions");
                            return;
                          }

                          /* */

                          switch (this.roluser) {
                            case 1:
                              this.router.navigateByUrl("/panel-pedido/pedido");
                              break;
                            case 3:
                              if (data.persona.es_dador_cupo) {
                                this.router.navigateByUrl("/cupo/cuponera");
                              } else {
                                if (data.persona.es_cliente_final == '1') {
                                  this.router.navigateByUrl("/panel-pedido/pedido");
                                } else {
                                  this.router.navigateByUrl("/panel-pedido/viajes");
                                }
                              }
                              break;
                            case 4:
                              this.router.navigateByUrl("/home/difusion");
                              break;
                            case 5:
                              this.router.navigateByUrl("/panel-pedido/pedido");
                              break;
                            case 6:
                              this.router.navigateByUrl("/destinatario/panel");
                              break;
                            case 7:
                              this.router.navigateByUrl("/destino/porteria");
                              break;
                            case 11:
                              this.router.navigateByUrl("/panel-pedido/pedido");
                              break;
                            case 12:
                              this.router.navigateByUrl("/admin/consulta/0");
                              break;
                            case 13:
                              this.router.navigateByUrl("/panel-pedido/pedido");
                              break;
                            case 14:
                              this.router.navigateByUrl("/magyp/gestion/dashboard");
                              break;
                            case 15:
                              this.router.navigateByUrl(
                                "/fertilizante/admin-bandas"
                              );
                              break;
                            case 16:
                              this.router.navigateByUrl(
                                "/mtr/caratulas"
                              );

                              break;
                            default:
                              this.router.navigateByUrl("/panel-pedido/pedido");
                              break;
                          }
                        }
                      },
                      (error) => {
                        this.valError = true;
                        this.desmarcarCaptcha();
                        // tslint:disable-next-line:max-line-length
                        this.errorShow =
                          "El nombre de usuario o la contraseña son incorrectos. Vuelva a introducir el Usuario y la Contraseña";
                      }
                    );
                } else {
                  this.loader.close();

                  this.activated = true;
                  this.roles = dataroles;
                }
              } else {
                this.loader.close();
                this.valError = true;
                this.desmarcarCaptcha();
                this.errorShow = "Error: " + "Incorrect username or password.";
                localStorage.setItem("currentUser", "false");
              }
            },
            (error) => {
              this.valError = true;
              this.loader.close();
              this.desmarcarCaptcha();
              this.errorShow =
                "El nombre de usuario o la contraseña son incorrectos. Vuelva a introducir el Usuario y la Contraseña";
            }
          );

      });
  }

  chanceLabel() {
    this.labelRolSelected = "Rol seleccionado";
  }
  signinRol() {
    this.loader.open();
    if (this.cod_auth.length > 0) {
      this.postString2 = {
        authorization_code: this.cod_auth,
        rol_id: this.selectedRol,
      };
      this.authenticationService
        .activate(this.postString2)
        .pipe(first())
        .subscribe(
          (data) => {
            this.loader.close();
            localStorage.setItem("posee_terminal", data.posee_terminal);
            if ((data.status = 1)) {
              this.valError = false;
              localStorage.setItem("currentUser", "true");
              localStorage.setItem(
                "clienteMuvin",
                data.persona_rol.id_rol === 11
                  ? data.centro_padre_persona.cliente_muvin
                  : data.persona.cliente_muvin
              );
              localStorage.setItem(
                "visualiza_flota_intermediario",
                data.persona_rol.id_rol === 11
                  ? data.centro_padre_persona.visualiza_flota_intermediario
                  : data.persona.visualiza_flota_intermediario
              );
              localStorage.setItem("nameUser", data.persona.razon_social);
              localStorage.setItem(
                "esClienteFinal",
                data.persona.es_cliente_final
              );
              localStorage.setItem("esDadorCupo", data.persona.es_dador_cupo);
              localStorage.setItem(
                "esIntermediario",
                data.persona.es_intermediario
              );
              localStorage.setItem("tipo_turneada", data.tipo_turneada);
              localStorage.setItem("visualizaLog", data.visualiza_log);
              localStorage.setItem("usaCupera", data.usaCupera);
              localStorage.setItem("usaMtr", data.usaMtr);
              localStorage.setItem("formularioCupera", data.formularioCupera);
              localStorage.setItem("esDestinatario", data.esDestinatario);
              localStorage.setItem("cuit_cuil", data.persona_rol.cuit_persona);
              localStorage.setItem("rol", this.selectedRol.toString());
              localStorage.setItem(
                "tipo_interviniente",
                data.persona.tipo_interviniente
              );
              localStorage.setItem("solicitaCupos", data.persona.solicitaCupos);
              //localStorage.setItem("esMuvinProveedor", data.esMuvinProveedor);
              localStorage.setItem("rol", this.selectedRol.toString());
              this.cod_auth = data.access_token;
              this.activated = true;

              let acepto_tyc = parseInt(localStorage.getItem("accept_tyc"));

              if (acepto_tyc == 0) {
                let redirectUrlTyC = "";

                switch (this.selectedRol) {
                  case 1:
                    redirectUrlTyC = "/panel-pedido/pedido";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 3:
                    if (data.persona.es_dador_cupo) {
                      redirectUrlTyC = "/cupo/cuponera";
                    } else {
                      if (data.persona.es_cliente_final == '1') {
                        redirectUrlTyC = "/panel-pedido/pedido";
                      } else {
                        redirectUrlTyC = "/panel-pedido/viajes";
                      }
                    }
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 4:
                    redirectUrlTyC = "/home/difusion";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 5:
                    redirectUrlTyC = "/panel-pedido/pedido";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 6:
                    redirectUrlTyC = "/destinatario/panel";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 7:
                    this.router.navigateByUrl("/destino/porteria");
                    break;
                  case 11:
                    redirectUrlTyC = "/panel-pedido/pedido";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 12:
                    redirectUrlTyC = "/admin/consulta/0";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 13:
                    redirectUrlTyC = "/marketing/notificaciones";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 14:
                    redirectUrlTyC = "/magyp/gestion/dashboard";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 15:
                    redirectUrlTyC = "/fertilizante/admin-bandas";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  case 16:
                    redirectUrlTyC = "/mtr/caratulas";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                  default:
                    redirectUrlTyC = "/home/viaje";
                    localStorage.setItem("redirectUrlTyC", redirectUrlTyC);
                    break;
                }

                this.router.navigateByUrl("/terms-and-conditions");
                return;
              }
              switch (this.selectedRol) {
                case 1:
                  this.router.navigateByUrl("/panel-pedido/pedido");
                  break;
                case 3:
                  if (data.persona.es_dador_cupo) {
                    this.router.navigateByUrl("/cupo/cuponera");
                  } else {
                    if (data.persona.es_cliente_final == '1') {
                      this.router.navigateByUrl("/panel-pedido/pedido");
                    } else {
                      this.router.navigateByUrl("/panel-pedido/pedido");
                    }
                  }
                  break;
                case 4:
                  this.router.navigateByUrl("/home/difusion");
                  break;
                case 5:
                  this.router.navigateByUrl("/panel-pedido/pedido");
                  break;
                case 6:
                  this.router.navigateByUrl("/destinatario/panel");
                  break;
                case 7:
                  this.router.navigateByUrl("/destino/porteria");
                  break;
                case 11:
                  this.router.navigateByUrl("/panel-pedido/pedido");
                  break;
                case 12:
                  this.router.navigateByUrl("/admin/consulta/0");
                  break;
                case 13:
                  this.router.navigateByUrl("/marketing/notificaciones");
                  break;
                case 14:
                  this.router.navigateByUrl("/magyp/gestion/dashboard");
                  break;
                case 15:
                  this.router.navigateByUrl("/fertilizante/admin-bandas");
                  break;
                case 16:
                  this.router.navigateByUrl("/mtr/caratulas");
                  break;
                default:
                  this.router.navigateByUrl("/home/viaje");
                  break;
              }
            } else {
              this.valError = true;
              this.loader.close();
              this.errorShow = "Error: " + "Incorrect username or password.";
              localStorage.setItem("currentUser", "false");
            }
          },
          (error) => {
            this.valError = true;
            this.loader.close();
            // tslint:disable-next-line:max-line-length
            this.errorShow =
              "El nombre de usuario o la contraseña son incorrectos. Vuelva a introducir el Usuario y la Contraseña";
          }
        );
    }
  }

  hideError() {
    this.valError = false;
  }

  excluirRol(rolesparam) {
    //console.log(rolesparam)
    //rol 10 intermediario
    let rolesExcluir = [5, 6, 10];

    const result = [];
    rolesparam.forEach((item) => {
      //pushes only unique element
      if (!rolesExcluir.includes(item.id)) {
        result.push(item);
      }
    })
    //console.log(result); //[1,2,6,5,9,'33']
    /*  for (let i = 0; i < rolesparam.length; i++) {
       if (rolesparam[i].id !== 10 || rolesparam[i].id !== 5 || rolesparam[i].id !== 6) {
         rolesTemp.push(rolesparam[i]);
       }
     } */
    return result;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  desmarcarCaptcha() {
    // this.signinForm.controls["captcha"].setValue("");
    this.signinForm.controls["captcha"].markAsUntouched();
  }
}
