import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.component.html',
  styleUrls: ['./perfilusuario.component.scss']
})
export class PerfilusuarioComponent implements OnInit {

  constructor(public authService : AuthService) { }

  ngOnInit(): void {
  }

  logOut(){
    this.authService.logOut();
  }

}
