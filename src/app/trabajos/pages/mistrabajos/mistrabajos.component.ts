import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TrabajoFirestoreService } from '../../services/trabajo-firestore.service';
import { Trabajo } from '../../interfaces/trabajo.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../../../usuarios/services/auth.service';
import Swal from 'sweetalert2';

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

  visualizarEstadoPago(trabajo:Trabajo){
    if(trabajo.pagado){
      return 'Pagado'
    }else{
      return 'Pend. Pago.'
    }
  }

  obtenerCSSpago(trabajo:Trabajo){
    if(trabajo.pagado){
      return 'full-type'
    }else{
      return 'internship-type';
    }
  }

  eliminarTrabajo( idTrabajo : string){

    Swal.fire({
      title: '¿Está seguro de elimnar el trabajo?',
      text: 'Esta accion no podrá ser revertida.',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#5a435c',
      cancelButtonText:'Cancelar',
      cancelButtonColor: '#d33',
      allowOutsideClick: true,
      showCancelButton: true
    }).then((res)=>{
      console.log(res);
      if (res.isConfirmed) {
        this.trabajoFirestoreService.delete(idTrabajo).then((res)=>{
          Swal.fire("El trabajo ha sido eliminada con éxito.", '', 'success');
        })
      } 
    });

  }

}
