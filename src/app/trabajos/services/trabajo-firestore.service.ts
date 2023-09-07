import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Trabajo } from '../interfaces/trabajo.interface';

@Injectable({
  providedIn: 'root'
})
export class TrabajoFirestoreService {

  private trabajoCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.trabajoCollection = collection(this.firestore, 'trabajos');
  }

  getAll(idUsuario?: string) {

    if (idUsuario){
      const refq = query(this.trabajoCollection,where('idUsuario','==',idUsuario));
      return collectionData(refq, {
        idField: 'id',
      }) as Observable<Trabajo[]>;

    }else{

      return collectionData(this.trabajoCollection, {
        idField: 'id',
      }) as Observable<Trabajo[]>;

    }
    
  }
  
  getTrabajosImpagos(idUsuario: string) {
    const refq = query(this.trabajoCollection,where('pagado','==',false),where('idUsuario','==',idUsuario));
    return collectionData(refq, {
      idField: 'id',
    }) as Observable<Trabajo[]>;
  }

  get(id: string) {
    const trabajoDocumentReference = doc(this.firestore, `trabajos/${id}`);
    return docData(trabajoDocumentReference, { idField: 'id' });
  }

  create(trabajo: Trabajo) {
    return addDoc(this.trabajoCollection, trabajo);
  }

  update(trabajo: any) {
    const trabajoDocumentReference = doc(
      this.firestore,
      `trabajos/${trabajo.id}`
    );
    return updateDoc(trabajoDocumentReference, { ...trabajo });
  }

  delete(id: string) {
    const trabajoDocumentReference = doc(this.firestore, `trabajos/${id}`);
    return deleteDoc(trabajoDocumentReference);
  }

}
