import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';

const routes: Routes = [
  {
    path: '',
    //component: EmpresasComponent, 
    children : [
      {
        path: '',
        component : EmpresasComponent
      },
      {
        path: 'crear',
        component : EmpresaComponent
      },
      {
        path: ':empresa',
        component : EmpresaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
