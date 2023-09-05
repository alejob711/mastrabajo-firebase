import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TrabajoFirestoreService } from '../../services/trabajo-firestore.service';
import { Trabajo } from '../../interfaces/trabajo.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../../../usuarios/services/auth.service';

@Component({
  selector: 'app-mistrabajos',
  templateUrl: './mistrabajos.component.html',
  styleUrls: ['./mistrabajos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MistrabajosComponent implements OnInit {

  todosLosTrabajos : Observable<Trabajo[]>;
  empresa : Observable<any>;

  constructor( private trabajoFirestoreService : TrabajoFirestoreService,
               private authService : AuthService) { }

  ngOnInit(): void {
    this.todosLosTrabajos = this.trabajoFirestoreService.getAll(this.authService.userID);
  }

  calcularEstado(trabajo:Trabajo){
    if(trabajo.fechaVencimiento.toDate() > new Date){
      return 'Activo'
    }else{
      return 'Vencido';
    }
  }

  obtenerCSSestado(trabajo:Trabajo){
    if(trabajo.fechaVencimiento.toDate() > new Date){
      return 'full-type'
    }else{
      return 'internship-type';
    }
  }

}
