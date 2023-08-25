import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../features/pokemon/interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class PokedexFirestoreService {
  private pokemonCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {

    this.pokemonCollection = collection(this.firestore, 'empresas');

  }

  getAll() {
    return collectionData(this.pokemonCollection, {
      idField: 'id',
    }) as Observable<Pokemon[]>;
  }

  get(id: string) {
    const pokemonDocumentReference = doc(this.firestore, `empresas/${id}`);
    return docData(pokemonDocumentReference, { idField: 'id' });
  }

  create(pokemon: Pokemon) {
    console.log('pokemon recibido', pokemon);
    return addDoc(this.pokemonCollection, pokemon);
  }

  update(pokemon: Pokemon) {
    const pokemonDocumentReference = doc(
      this.firestore,
      `empresas/${pokemon.id}`
    );
    return updateDoc(pokemonDocumentReference, { ...pokemon });
  }

  delete(id: string) {
    const pokemonDocumentReference = doc(this.firestore, `empresas/${id}`);
    return deleteDoc(pokemonDocumentReference);
  }
}
