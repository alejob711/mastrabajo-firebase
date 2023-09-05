import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TipoTrabajo } from '../interfaces/tipotrabajo.interface';

@Injectable({
  providedIn: 'root'
})
export class TipotrabajoFirestoreService {

  private TipoTrabajoCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.TipoTrabajoCollection = collection(this.firestore, 'tipoTrabajo');
  }

  getAll() {
    return collectionData(this.TipoTrabajoCollection, {
      idField: 'id',
    }) as Observable<TipoTrabajo[]>;
  }

  get(id: string) {
    const tipoTrabajoDocumentReference = doc(this.firestore, `tipoTrabajo/${id}`);
    return docData(tipoTrabajoDocumentReference, { idField: 'id' });
  }
}