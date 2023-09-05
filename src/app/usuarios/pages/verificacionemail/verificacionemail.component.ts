import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificacionemail',
  templateUrl: './verificacionemail.component.html',
  styleUrls: ['./verificacionemail.component.scss']
})
export class VerificacionemailComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  sendVerificationEmail(user : any){
    this.authService.sendVerificationMail(user).then(()=>{
      console.log(user);
      Swal.fire({
        title: `Ya hemos reenviado el email de verificacion a la siguiente direcion de correo: ${user.email}`,
        icon: 'info',
        timer: 4000,
        showConfirmButton: false
      });
    })
  }

}
