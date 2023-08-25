import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilusuarioComponent } from './pages/perfilusuario/perfilusuario.component';
import { VerificacionemailComponent } from './pages/verificacionemail/verificacionemail.component';
import { MistrabajosComponent } from '../trabajos/pages/mistrabajos/mistrabajos.component';
import { CambiarcontraseniaComponent } from './pages/cambiarcontrasenia/cambiarcontrasenia.component';
import { RecuperarcontraseniaComponent } from './pages/recuperarcontrasenia/recuperarcontrasenia.component';
import { InformarpagoComponent } from './pages/informarpago/informarpago.component';

const routes: Routes = [
  {
    path: '',
    children : [
      {
        path: 'verificacionemail',
        component : VerificacionemailComponent
      },
      {
        path: 'recuperarcontrasenia',
        component : RecuperarcontraseniaComponent
      },
      {
        path: ':idusuario',
        // component : UsuarioComponent
        children : [
          {
            path: '',
            component : PerfilusuarioComponent
          },
          {
            path: 'cambiarcontrasenia',
            component : CambiarcontraseniaComponent
          },
          {
            path: 'informarpago',
            component : InformarpagoComponent
          },
          {
            path: 'empresas',
            loadChildren : ()=> import('../empresa/empresa.module').then(m => m.EmpresaModule),
            // children : [
            //   {
            //     path: '',
            //     component : EmpresasComponent
            //   },
            //   {
            //     path: 'crear',
            //     component : EmpresaComponent
            //   },
            // ]
          },
          {
            path: 'trabajos',
            loadChildren : ()=> import('../trabajos/trabajos.module').then(m => m.TrabajosModule),
            // children : [
            //   {
            //     path: '',
            //     component : MistrabajosComponent
            //   },
            //   // {
            //   //   path: 'crear',
            //   //   component : CreartrabajoComponent
            //   // },
            // ]
          },
        ]
      }
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
