import { Component, OnInit, ViewChild } from '@angular/core';

import { TermsService } from '../../../shared/services/terms.service';
import { AuthService } from '../../../shared/services/auth.service';

import { Router, ActivatedRoute } from '@angular/router';

export class Location {
  page: number;
  scroll_location: number;
  up: number;
}

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})


export class TermsAndConditionsComponent implements OnInit {


  public position: Location[] = [];
  logoTerms: string = 'assets/images/muvin/LOGO_MUVIN@2x.png';
  lastReaded: number = 0;
  lastPosition: number = 0;
  countTermsReaded: number = 0;

  terms = [
    { name: '1. Aceptación.', class: 'inactive', position: 0 },
    { name: '2. El sistema.', class: 'inactive', position: 0},
    { name: '3. Requisitos de acceso – Capacidad.', class: 'inactive', position: 0},
    { name: '4. Aclaraciones especiales para transportistas.', class: 'inactive', position: 0},
    { name: '5. Propiedad intelectual.', class: 'inactive', position: 0},
    { name: '6. Licencia de usuario.', class: 'inactive', position: 0},
    { name: '7. Restricciones de uso.', class: 'inactive', position: 0},
    { name: '8. Prohibiciones generales.', class: 'inactive', position: 0},
    { name: '9. Contenidos subidos al sistema.', class: 'inactive', position: 0},
    { name: '10. Finalización del servicio.', class: 'inactive', position: 0},
    { name: '11. Inexistencia de relaciones asociativas y laborales.', class: 'inactive', position: 0},
    { name: '12. Limitación de responsabilidad y garantía.', class: 'inactive', position: 0},
    { name: '13. Política de privacidad.', class: 'inactive', position: 0},
    { name: '14. Información comercial y enlaces. Ausencia de responsabilidad.', class: 'inactive', position: 0},
    { name: '15. Incumplimiento e indemnización.', class: 'inactive', position: 0},
    { name: '16. Jurisdicción.', class: 'inactive', position: 0}
  ];

  ngOnInit(){

  }



  constructor(
               private termsService: TermsService,
               public router: Router,
               private authenticationService: AuthService
              ) { }




  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;

  }

  getTopPosition(e){
    return e.target.scrollTopMax;
  }

  highligthsItemsBottom(lastReaded){

    for(let i = lastReaded; i<= this.terms.length - 1; i++ ){
      this.terms[i].class = "activo";
      this.countTermsReaded++;
      this.lastReaded = this.terms.length - 1;
    }


  }

  unHighligthsItemsBottom(lastReaded){

    for(let i = lastReaded; i <= this.terms.length - 1;  i++ ){
      console.log("vueltas "+ i);
      this.terms[i].class = "inactive";
      this.countTermsReaded--;
      this.lastReaded = lastReaded - 1;

    }
  }


  onListScroll(e) {

    /* acepto */
    let accept = document.getElementById('acepto_cuerpo');
    this.terms[0].position = accept.offsetTop;

    /* Sistema */
    this.terms[1].position = document.getElementById('acepto_cuerpo').offsetHeight + document.getElementById('acepto_cuerpo').offsetTop;

    /* requisitos */
    this.terms[2].position =  document.getElementById('acepto_sistema').offsetTop + document.getElementById('acepto_sistema').offsetHeight;

    /* aclaraciones */
    this.terms[3].position =  document.getElementById('acepto_req').offsetTop + document.getElementById('acepto_req').offsetHeight;

    /* propiedad */
    this.terms[4].position =  document.getElementById('acepto_aclaraciones').offsetTop + document.getElementById('acepto_aclaraciones').offsetHeight;

    this.terms[5].position =  document.getElementById('propiedad_intelectual').offsetTop + document.getElementById('propiedad_intelectual').offsetHeight;

    this.terms[6].position =  document.getElementById('licencia_usuario').offsetTop + document.getElementById('licencia_usuario').offsetHeight;

    this.terms[7].position =  document.getElementById('rectrigiones_uso').offsetTop + document.getElementById('rectrigiones_uso').offsetHeight;

    this.terms[8].position =  document.getElementById('pg').offsetTop + document.getElementById('pg').offsetHeight;

    this.terms[9].position =  document.getElementById('css').offsetTop + document.getElementById('css').offsetHeight;

    this.terms[10].position =  document.getElementById('fs').offsetTop + document.getElementById('fs').offsetHeight;

    this.terms[11].position =  document.getElementById('ira').offsetTop + document.getElementById('ira').offsetHeight;

    this.terms[12].position =  document.getElementById('lrg').offsetTop + document.getElementById('lrg').offsetHeight;

    this.terms[13].position =  document.getElementById('pp').offsetTop + document.getElementById('pp').offsetHeight;

    this.terms[14].position =  document.getElementById('icea').offsetTop + document.getElementById('icea').offsetHeight;

    /* GC: Necesariamente tengo que calcular la cantidad de terminos a resaltar
           ya que si se hace zoom se leen hasta 13 elementos */
    if( this.lastReaded <= this.terms.length - 1 && this.lastReaded >=  this.terms.length - 3 && this.terms[this.terms.length - 1].class=="activo"){

      if( this.getYPosition(e) < this.terms[this.lastReaded].position  &&
          this.getYPosition(e) >= this.terms[this.lastReaded - 3].position
        )
      {
        console.log("scroll arriba" + this.lastReaded);
        this.unHighligthsItemsBottom(this.lastReaded + 1);
      }
    }


    if( this.getYPosition(e) >= this.terms[this.lastReaded].position && this.lastReaded >= 13)
    {
      this.highligthsItemsBottom(this.lastReaded);
    }


    this.getTerm(this.getYPosition(e));


 }

  getTerm(position)
  {
    for (let i = 0; i < this.terms.length - 1; i++)
    {
      let j = i + 1;


      /* GC: Chequear primero si no esta leyendo hacia arriba */

      let indexLastPosition = (this.lastReaded > 0) ? this.lastReaded - 1 : 0;

      if( position < this.lastPosition && this.terms[indexLastPosition].class == "activo")
      {
        this.terms[indexLastPosition].class = "inactive";
        this.countTermsReaded = this.countTermsReaded - 1;
        this.lastPosition = this.terms[indexLastPosition].position;
        this.lastReaded  = indexLastPosition;

      }
      this.lastPosition = position;

      if( position >= this.terms[i].position && position <= this.terms[j].position )
      {
        if( this.terms[i].class != "activo")
        {

          this.lastReaded = i + 1;
          this.lastPosition = position;
          this.terms[i].class = "activo";

          if( this.lastReaded > this.countTermsReaded)
          {
            this.countTermsReaded++;
            break;
          }

        }


      }


    }



  }

  registerTerm(actionUser: string) {
    this.termsService.updateTerms({ actionUser: actionUser })
      .subscribe(res => {
        if(res.data.acepta_tyc == 1){
          localStorage.setItem('accept_tyc', res.data.acepta_tyc);
          let reDirectToUrl = localStorage.getItem('redirectUrlTyC');
          this.router.navigateByUrl(reDirectToUrl);
        }else{
          this.authenticationService.logout();
          this.router.navigateByUrl("/sessions/signin");

        }
      },
        err => {
          this.authenticationService.logout();
          this.router.navigateByUrl("/sessions/signin");
        });


  }
}

