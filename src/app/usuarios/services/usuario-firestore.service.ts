import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Usuario } from '../interfaces/usuario';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioFirestoreService {

  userData: any;

  private usuariosCollection: CollectionReference<DocumentData>;

  constructor(//public afs: AngularFirestore,
    
              private readonly firestore: Firestore) {
    this.usuariosCollection = collection(this.firestore, 'usuarios');
  }
  
  /* Seteo informacion del usuario cuando inicia sesion con usuario/password
     crea su cuenta con nombre de usuario/password o inicia sesion con alguna red social 
  */
    //  SetUserData(user: any) {

    //   let userData : Usuario = {
    //     uid: user.uid,
    //     email: user.email,
    //     displayName: user.displayName,
    //     photoURL: user.photoURL,
    //     emailVerified: user.emailVerified
    //   };

    //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(
    //     `users/${user.uid}`
    //   );

    //   return userRef.set(userData, {
    //     merge: true,
    //   });

    // }

    create(user: Usuario) {

      // console.log(user);

      // let userData : Usuario = {
      //   uid: user.uid,
      //   email: user.email,
      //   displayName: user.displayName,
      //   photoURL: user.photoURL,
      //   emailVerified: user.emailVerified,
      //   tipoUsuario : user.tipoUsuario
      // };

      
      return addDoc(this.usuariosCollection, user);
      
    }

    update(user: any){

      // console.log(user);

      // let userData = {
      //   uid: user.uid,
      //   email: user.email,
      //   displayName: user.displayName,
      //   photoURL: user.photoURL,
      //   emailVerified: user.emailVerified,
      // };

      const usuariosDocumentReference = doc(
        this.firestore,
        `usuarios/${user.id}`
      );
      return updateDoc(usuariosDocumentReference, { ...user });
    }

    get(uid: string) {

      const refq = query(this.usuariosCollection,where('uid','==',uid));
      return collectionData(refq, {
        idField: 'id',
      }) as Observable<Usuario[]>;


      // const usuariosDocumentReference = doc(this.firestore, `usuarios/${id}`);
      // return docData(usuariosDocumentReference, { idField: 'uid' });
    }
     
}
