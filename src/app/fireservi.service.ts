import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FireserviService {

  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any>;

  configuracion: AngularFirestoreDocument<any>;

  constructor(private dbfirebase: AngularFirestore) {
      this.itemsCollection = dbfirebase.collection<any>('configuracion-panel');
      this.items = this.itemsCollection.valueChanges();
    }

    crear_documento_cof(id_centro, select) {
      const item = {
        id_centro,
        seleccion: select
      };
      this.itemsCollection.doc(`dador-cupo-${id_centro}`).set(item);
      this.configuracion = this.dbfirebase.doc(`/configuracion-panel/dador-cupo-${id_centro}`);
    }

    verificar_conf_centro_fire(centro) {
      return new Promise ((resolve, reject) => {
        this.dbfirebase.doc(`/configuracion-panel/dador-cupo-${centro}`)
            .valueChanges().subscribe(data => {
              if (data) {
                this.configuracion = this.dbfirebase.doc(`/configuracion-panel/dador-cupo-${centro}`);
                resolve(true);
              } else {
                resolve(false);
              }
            });
      });
    }

}
