import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MustMatch } from '../../../shared/validators'
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiarcontrasenia',
  templateUrl: './cambiarcontrasenia.component.html',
  styleUrls: ['./cambiarcontrasenia.component.scss']
})
export class CambiarcontraseniaComponent implements OnInit {

  public cambiarContraseniaForm : FormGroup = this.fb.group({
    nuevaContrasenia : [ , [Validators.required, Validators.minLength(8)]],
    repetirContrasenia : [ , [Validators.required, Validators.minLength(8)]],
  }, {
    validators: MustMatch('nuevaContrasenia', 'repetirContrasenia')
  }); 

  constructor(public authService : AuthService,
              private fb : FormBuilder,
              private router : Router) { }

  ngOnInit(): void {
  }

  logOut(){
    this.authService.logOut();
  }

  submitCambiarContrasenia(){
    let nuevaContrasenia = this.cambiarContraseniaForm.controls['nuevaContrasenia'].value;
    this.authService.updatePassword(nuevaContrasenia).then( res=>{
      if (res) {
        Swal.fire({
          title: 'La contraseña fue actualizada de manera exitosa',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#5a435c',
          timer: 2000,
          showConfirmButton: false
        }).then(()=>{
          this.router.navigate([`usuarios/${this.authService.userID}`]);
        });
      }else{
        Swal.fire({
          title: 'La contraseña no ha podido ser actualizada',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#5a435c',
          timer: 2000,
          showConfirmButton: false
        });
      }  
    });
  }

}
