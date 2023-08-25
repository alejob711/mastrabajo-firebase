import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, collection, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { RubroEmpresa } from '../interfaces/rubroempresa';

@Injectable({
  providedIn: 'root'
})
export class RubroempresaFirestoreService {

  private rubroEmpresaCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.rubroEmpresaCollection = collection(this.firestore, 'rubroEmpresa');
  }

  getAll() {
    return collectionData(this.rubroEmpresaCollection, {
      idField: 'id',
    }) as Observable<RubroEmpresa[]>;
  }

  get(id: string) {
    const empresaDocumentReference = doc(this.firestore, `rubroEmpresa/${id}`);
    return docData(empresaDocumentReference, { idField: 'id' });
  }
}
