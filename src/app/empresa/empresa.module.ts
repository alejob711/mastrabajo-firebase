import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    EmpresaComponent,
    EmpresasComponent
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    GooglePlaceModule
  ]
})
export class EmpresaModule { }
