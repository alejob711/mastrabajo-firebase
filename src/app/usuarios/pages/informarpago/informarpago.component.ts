import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformePago } from '../../interfaces/informePago';
import { Trabajo } from 'src/app/trabajos/interfaces/trabajo.interface';
import { InformarPagoFirestoreService } from '../../services/informar-pago-firestore.service';
import { TrabajoFirestoreService } from 'src/app/trabajos/services/trabajo-firestore.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informarpago',
  templateUrl: './informarpago.component.html',
  styleUrls: ['./informarpago.component.scss']
})
export class InformarpagoComponent implements OnInit {

  informePago : InformePago;
  trabajosNoPagadosDeUsuario : Trabajo[] = [];

  public informePagoForm : FormGroup = this.fb.group({
    idTrabajo : [ , [Validators.required]],
    numeroOperacion : [ , [Validators.required]],
  }); 
  
  constructor(private fb : FormBuilder,
              private informarPagoFirestoreService : InformarPagoFirestoreService,
              private trabajoFirestoreService : TrabajoFirestoreService,
              public authService : AuthService,
              private router: Router) { }

  ngOnInit(): void {
    
    this.informarPagoFirestoreService.getAll()

    this.trabajoFirestoreService.getTrabajosImpagos(this.authService.userID).subscribe((trabajos)=>{
      this.trabajosNoPagadosDeUsuario = trabajos;
    });

  }

  async submitForm(){
    if(!this.informePagoForm.valid) {
      this.informePagoForm.markAllAsTouched();
      return;
    }

    this.informePago = {... this.informePagoForm.value};

    this.informePago.fechaRealizacion = new Date();
    this.informePago.idUsuario = this.authService.userID;
    this.informePago.procesado = false;

    await this.actualizarTrabajo();
    
    this.storeData(this.informePago);

  }

  storeData(informePago : InformePago){
    Swal.fire('Guardando trabajo...')
    Swal.showLoading() 

    this.informarPagoFirestoreService.create(informePago).then((res)=>{

      Swal.fire({
        title: 'El pago ha sido informado de manera exitosa',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a435c',
        timer: 2000,
        showConfirmButton: false
      }).then(()=>{
        this.router.navigate([`usuarios/${this.authService.userID}`]);
      });

    })
  }

  actualizarTrabajo(){
    let trabajoSeleccionado = this.trabajosNoPagadosDeUsuario.filter(trabajo =>trabajo.id = this.informePago.idTrabajo);

    trabajoSeleccionado[0].pagado = true;

    this.trabajoFirestoreService.update(trabajoSeleccionado[0]);
  }

}