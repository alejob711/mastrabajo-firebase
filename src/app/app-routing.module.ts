import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    //component: InicioComponent
    loadChildren : ()=> import('./inicio/inicio.module').then(m => m.InicioModule),
  },
  {
    path : 'trabajos',
    loadChildren : ()=> import('./trabajos/trabajos-frontend.module').then(m => m.TrabajosFrontendModule),
  },
  {
    path : 'usuarios',
    loadChildren : ()=> import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
  },
  {
    path : 'pokemon',
    loadChildren : ()=> import('./features/pokemon/pokemon.module').then(m => m.PokemonModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
