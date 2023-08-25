import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajosRoutingModule } from './trabajos-routing.module';
import { MistrabajosComponent } from './pages/mistrabajos/mistrabajos.component';
import { CreartrabajoComponent } from './pages/creartrabajo/creartrabajo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TrabajosComponent } from './pages/trabajos/trabajos.component';


@NgModule({
  declarations: [
    MistrabajosComponent,
    CreartrabajoComponent,
    TrabajosComponent
  ],
  imports: [
    CommonModule,
    TrabajosRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    GooglePlaceModule
    
  ]
})
export class TrabajosModule { }
