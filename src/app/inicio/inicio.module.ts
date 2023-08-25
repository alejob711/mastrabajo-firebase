import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
import { SubstringPipe } from '../shared/pipes/substring.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    InicioComponent,
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedModule
  ]
})
export class InicioModule { }
