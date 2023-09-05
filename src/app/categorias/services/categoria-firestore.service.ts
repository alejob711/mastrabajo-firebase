import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, collection, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaFirestoreService {

  private categoriaCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.categoriaCollection = collection(this.firestore, 'categorias');
  }

  getAll() {
    return collectionData(this.categoriaCollection, {
      idField: 'id',
    }) as Observable<Categoria[]>;
  }

  get(id: string) {
    const empresaDocumentReference = doc(this.firestore, `categorias/${id}`);
    return docData(empresaDocumentReference, { idField: 'id' });
  }

  
}
