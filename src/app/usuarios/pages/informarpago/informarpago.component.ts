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

  nuevoInformePago : InformePago;
  trabajosNoPagadosDeUsuario : Trabajo[] = [];

  public informePagoForm : FormGroup = this.fb.group({
    idTrabajoPagado : [ , [Validators.required]],
    numeroOperacion : [ , [Validators.required]],
  }); 

  // client = new SMTPClient({
  //   user: 'alejo@yukoninfo.com',
  //   password: 'AB2008ja',
  //   host: 'mail.yukoninfo.com',
  //   //ssl: true,
  // });
  
  constructor(private fb : FormBuilder,
              private informarPagoFirestoreService : InformarPagoFirestoreService,
              private trabajoFirestoreService : TrabajoFirestoreService,
              public authService : AuthService,
              private router: Router) { }

  ngOnInit(): void {

    this.trabajoFirestoreService.getTrabajosImpagos(this.authService.userID).subscribe((trabajos)=>{
      this.trabajosNoPagadosDeUsuario = trabajos;
    });

  }

  async submitForm(){
    if(!this.informePagoForm.valid) {
      this.informePagoForm.markAllAsTouched();
      return;
    }

    this.nuevoInformePago = {... this.informePagoForm.value};

    console.log(this.nuevoInformePago);

    this.nuevoInformePago.fechaRealizacion = new Date();
    this.nuevoInformePago.idUsuario = this.authService.userID;
    this.nuevoInformePago.procesado = false;

    await this.actualizarTrabajo();
    
    this.storeData(this.nuevoInformePago);

  }

  storeData(informePago : InformePago){
    Swal.fire('Guardando trabajo...')
    Swal.showLoading() 

    this.informarPagoFirestoreService.create(informePago).then((res)=>{

      // this.client.send(
      //   {
      //     from: 'mastrabajo',
      //     to: 'alejo@yukoninfo.com',
      //     //cc: 'else <else@your-email.com>',
      //     subject: 'Has recibido un nuevo pago',
      //     text: 'El cliente X ha realizado el pago del siguiente anuncio, por favor habilitalo para que pueda ver sus postulantes',
      //   },
      //   (err, message) => {
      //     console.log(err || message);
      //   }
      // );

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

  /**
   * Actualizar Trabajo
   * 
   * Actualiza en la base de datos el campo trabajo.pagado = true al trabajo seleccionado
   */
  actualizarTrabajo(){

    let trabajoSeleccionado = this.trabajosNoPagadosDeUsuario.filter(trabajo =>trabajo.id = this.nuevoInformePago.idTrabajoPagado);

    console.log(trabajoSeleccionado);

    trabajoSeleccionado[0].pagado = true;

    this.trabajoFirestoreService.update(trabajoSeleccionado[0]);
  }

}