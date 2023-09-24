import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, query, where } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { InformePago } from '../interfaces/informePago';

@Injectable({
  providedIn: 'root'
})
export class InformarPagoFirestoreService {

  private informePagoCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.informePagoCollection = collection(this.firestore, 'informePago');
  }

  getAll(idUsuario?: string) {

    if (idUsuario){
      const refq = query(this.informePagoCollection,where('idUsuario','==',idUsuario));
      return collectionData(refq, {
        idField: 'id',
      }) as Observable<InformePago[]>;
    }else{
      return collectionData(this.informePagoCollection, {
        idField: 'id',
      }) as Observable<InformePago[]>;
    }
    
  }

  get(id: string) {
    const informePagoDocumentReference = doc(this.firestore, `informePago/${id}`);
    return docData(informePagoDocumentReference, { idField: 'id' });
  }

  create(informePago: any) {
    return addDoc(this.informePagoCollection, informePago);
  }

  update(informePago: InformePago) {
    const informePagoDocumentReference = doc(this.firestore,`informePago/${informePago.id}`);
    return updateDoc(informePagoDocumentReference, { ...informePago });
  }

  delete(id: string) {
    const informePagoDocumentReference = doc(this.firestore, `informePago/${id}`);
    return deleteDoc(informePagoDocumentReference);
  }

  getInformePagoDeTrabajo(idTrabajo : string){
    const refq = query(this.informePagoCollection,where('idTrabajo','==',idTrabajo));
      return collectionData(refq, {
        idField: 'id',
      }) as Observable<InformePago[]>;
  }
}
