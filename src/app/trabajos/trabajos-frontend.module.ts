import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajosFrontendRoutingModule } from './trabajos-frontend-routing.module';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrabajosFrontendRoutingModule,

    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    GooglePlaceModule
  ]
})
export class TrabajosFrontendModule { }
