import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, query, where } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Empresa } from '../interfaces/empresa.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpresaFirestoreService {

  private empresaCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.empresaCollection = collection(this.firestore, 'empresas');
  }

  getAll(idUsuario?: string) {

    if (idUsuario){
      const refq = query(this.empresaCollection,where('idUsuario','==',idUsuario));
      return collectionData(refq, {
        idField: 'id',
      }) as Observable<Empresa[]>;
    }else{
      return collectionData(this.empresaCollection, {
        idField: 'id',
      }) as Observable<Empresa[]>;
    }
    
  }

  get(id: string) {
    const empresaDocumentReference = doc(this.firestore, `empresas/${id}`);
    return docData(empresaDocumentReference, { idField: 'id' });
  }

  create(empresa: any) {
    return addDoc(this.empresaCollection, empresa);
  }

  update(empresa: Empresa) {
    const empresaDocumentReference = doc(
      this.firestore,
      `empresas/${empresa.id}`
    );
    return updateDoc(empresaDocumentReference, { ...empresa });
  }

  delete(id: string) {
    const empresaDocumentReference = doc(this.firestore, `empresas/${id}`);
    return deleteDoc(empresaDocumentReference);
  }
  
}
