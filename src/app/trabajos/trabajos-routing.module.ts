import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MistrabajosComponent } from './pages/mistrabajos/mistrabajos.component';
import { CreartrabajoComponent } from './pages/creartrabajo/creartrabajo.component';

const routes: Routes = [
  {
    path: '',
    //component: EmpresasComponent, 
    children : [
      {
        path: '',
        component : MistrabajosComponent
      },
      {
        path: 'crear',
        component : CreartrabajoComponent
      },
      {
        path: ':trabajoId',
        component : CreartrabajoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrabajosRoutingModule { }
