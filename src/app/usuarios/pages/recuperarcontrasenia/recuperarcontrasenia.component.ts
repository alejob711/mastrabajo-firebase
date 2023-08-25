import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperarcontrasenia',
  templateUrl: './recuperarcontrasenia.component.html',
  styleUrls: ['./recuperarcontrasenia.component.scss']
})
export class RecuperarcontraseniaComponent implements OnInit {

  captchaResolved : boolean = false;
  buttonText : string = 'Recuperar Contraseña'
  verificacionEnviada : boolean = false;
  infoText : string = '';
  classText : string = '';
  reiniciarContraseniaForm : FormGroup = this.fb.group({
    email : [ , [Validators.required, Validators.email, this.emailValidator]],
    recaptcha : [ , [Validators.required]],
  });

  constructor(private fb : FormBuilder,
              private authService : AuthService) { }

  ngOnInit(): void {
  }

  emailValidator(control:any) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

  checkCaptcha(captchaResponse : any) {
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
  }

  reiniciarContrsaenia(){
    this.verificacionEnviada = false;
    this.authService.ForgotPassword(this.reiniciarContraseniaForm.value.email).then((res : boolean)=>{
      this.buttonText = 'Reenviar Solicitud';
      this.verificacionEnviada = true;
      if (res) {
        this.infoText = 'Ya hemos enviado la solicitud a tu casilla de correo. Ingresa a tu email para recuperar tu contraseña.'
        this.classText = 'text-info'
      }else{
        this.infoText = 'Ha ocurrido un error, por favor asegurese que su email es el correcto y vuelva a enviar la solicitud.'
        this.classText = 'text-danger'
      }

      
    })
  }

}
