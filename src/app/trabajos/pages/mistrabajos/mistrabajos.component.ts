import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TrabajoFirestoreService } from '../../services/trabajo-firestore.service';
import { Trabajo } from '../../interfaces/trabajo.interface';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../usuarios/services/auth.service';
import Swal from 'sweetalert2';
import { InformarPagoFirestoreService } from 'src/app/usuarios/services/informar-pago-firestore.service';
import { InformePago } from 'src/app/usuarios/interfaces/informePago';

@Component({
  selector: 'app-mistrabajos',
  templateUrl: './mistrabajos.component.html',
  styleUrls: ['./mistrabajos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MistrabajosComponent implements OnInit {

  todosLosTrabajos : Observable<Trabajo[]>;
  empresa : Observable<any>;
  todosLosInformesDePago : InformePago[];

  test : any;

  constructor( private trabajoFirestoreService : TrabajoFirestoreService,
               private authService : AuthService,
               private informarPagoFirestoreService : InformarPagoFirestoreService,
               ) { }

  ngOnInit(): void {

    this.informarPagoFirestoreService.getAll(this.authService.userID).subscribe(res=>{
      this.todosLosInformesDePago = res;
      console.log(this.todosLosInformesDePago);
    })

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
      let trabajoProcesado = this.todosLosInformesDePago.filter(informePago => informePago.idTrabajoPagado == trabajo.id);
      if (trabajoProcesado[0].procesado){
        return 'Procesado'
      }else{
        return 'pend.proc'
      }
    }else{
      return 'PEND.PAG'
    }

  }

  obtenerCSSpago(trabajo:Trabajo){
    if(trabajo.pagado){
      let trabajoProcesado = this.todosLosInformesDePago.filter(informePago => informePago.idTrabajoPagado == trabajo.id);
      if (trabajoProcesado[0].procesado){
        return 'full-type'
      }else{
        return 'pendProc'
      }
    }else{
      return 'internship-type';
    }
  }

  obtenerCSSHabilitado(trabajo:Trabajo){
    if(trabajo.pagado){
      // let trabajoProcesado = this.todosLosInformesDePago.filter(informePago =>informePago.idTrabajoPagado = trabajo.id);
      // return trabajoProcesado[0]?.procesado;  
      let trabajoProcesado = this.todosLosInformesDePago.filter(informePago => informePago.idTrabajoPagado == trabajo.id);
      if (trabajoProcesado[0].procesado){
        return ''
      }else{
        return 'pagoNoProcesado'
      }
    }else{
      return 'pagoNoProcesado'
    }
  }
  
  verPostulacionesDeTrabajo(trabajo:Trabajo){
    // if(trabajo.pagado){
    //   let trabajoProcesado = this.todosLosInformesDePago.filter(informePago =>informePago.idTrabajoPagado = trabajo.id);
    //   if (trabajoProcesado[0]?.procesado){
    //     console.log('ver postulacion de trabajo');
    //   }
      
    // }

    if (trabajo.pagado){
      return this.todosLosInformesDePago.forEach(informePago=>{
        if (informePago.procesado){
          return 'pagoProcesado'
        }else{
          return 'pagoNoProcesado'
        }
      })
    }
  }

  // estaProcesado(trabajo:Trabajo) : boolean{
  //   if(trabajo.pagado){
  //     let trabajoProcesado = this.todosLosInformesDePago.filter(informePago =>informePago.idTrabajoPagado = trabajo.id);
  //     return trabajoProcesado[0]?.procesado;
  //   }else{
  //     return false;
  //   }  
  // }

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
      if (res.isConfirmed) {
        this.trabajoFirestoreService.delete(idTrabajo).then((res)=>{
          Swal.fire("El trabajo ha sido eliminada con éxito.", '', 'success');
        })
      } 
    });

  }

}
