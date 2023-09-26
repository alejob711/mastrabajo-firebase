import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrabajosComponent } from './pages/trabajos/trabajos.component';
import { TrabajoComponent } from './pages/trabajo/trabajo.component';

const routes: Routes = [
  {
    path: '',
    children : [
      {
        path: '',
        component : TrabajosComponent
      },
      {
        path: ':trabajoId',
        component : TrabajoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrabajosFrontendRoutingModule { }
