import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/services/auth.service';

@Component({
  selector: 'app-usuariotemplate',
  templateUrl: './usuariotemplate.component.html',
  styleUrls: ['./usuariotemplate.component.scss']
})
export class UsuariotemplateComponent implements OnInit {

  constructor(public authService : AuthService) { }

  ngOnInit(): void {
  }

  logOut(){
    this.authService.logOut();
  }

}
