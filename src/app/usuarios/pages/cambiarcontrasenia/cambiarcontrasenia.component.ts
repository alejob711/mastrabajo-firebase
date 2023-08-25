import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cambiarcontrasenia',
  templateUrl: './cambiarcontrasenia.component.html',
  styleUrls: ['./cambiarcontrasenia.component.scss']
})
export class CambiarcontraseniaComponent implements OnInit {

  constructor(public authService : AuthService) { }

  ngOnInit(): void {
  }

  logOut(){
    this.authService.logOut();
  }

}
