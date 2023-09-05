import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { PerfilusuarioComponent } from './pages/perfilusuario/perfilusuario.component';
import { VerificacionemailComponent } from './pages/verificacionemail/verificacionemail.component';
import { CambiarcontraseniaComponent } from './pages/cambiarcontrasenia/cambiarcontrasenia.component';
import { SharedModule } from '../shared/shared.module';
import { RecuperarcontraseniaComponent } from './pages/recuperarcontrasenia/recuperarcontrasenia.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { InformarpagoComponent } from './pages/informarpago/informarpago.component';


@NgModule({
  declarations: [
    PerfilusuarioComponent,
    VerificacionemailComponent,
    CambiarcontraseniaComponent,
    RecuperarcontraseniaComponent,
    InformarpagoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    UsuariosRoutingModule,

    SharedModule
  ]
})
export class UsuariosModule { }
