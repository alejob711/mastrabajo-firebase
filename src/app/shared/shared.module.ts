import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { UsuariotemplateComponent } from './components/usuariotemplate/usuariotemplate.component';
import { RouterModule } from '@angular/router';
import { SubstringPipe } from './pipes/substring.pipe';


@NgModule({
  declarations: [
    MenuComponent,
    UsuariotemplateComponent,
    SubstringPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports:[
    MenuComponent,
    UsuariotemplateComponent,
    SubstringPipe
  ],
  providers:[
    SubstringPipe
  ]
})
export class SharedModule { }
