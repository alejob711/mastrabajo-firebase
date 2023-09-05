import { Component, OnInit } from '@angular/core';
import { EmpresaFirestoreService } from '../../services/empresa-firestore.service';
import { Empresa } from '../../interfaces/empresa.interface';
import { CategoriaFirestoreService } from 'src/app/categorias/services/categoria-firestore.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/usuarios/services/auth.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  todasLasEmpresas : Observable<Empresa[]>;

  constructor(private empresasFirestore : EmpresaFirestoreService,
              //private router : Router,
              public authService : AuthService) { }

  ngOnInit(): void {

    console.log(this.authService.userID);
    this.todasLasEmpresas = this.empresasFirestore.getAll(this.authService.userID);

    // this.categoriasFirestore.getAll().subscribe((res)=>{
    //   this.todasLasCategorias = res;
    //   console.log('TODAS LAS CAT', res);
    // })

  }

  actualizar(){
    // this.todasLasEmpresas[1].nombre = 'NUEVO NOMBRE PApaioo'
    // this.empresasFirestore.update(this.todasLasEmpresas[1]).then((res)=>{
    //   console.log('ACTUALIZÒ', res);
    // })
    
  }

  leer(){
    // this.empresasFirestore.get(this.todasLasEmpresas[0].id).subscribe((res)=>{
    //   console.log('DETALLE DE LA EMPRESA GET: ', res);
    // })
  }

  eliminarEmpresa( idEmpresa : string){

    Swal.fire({
      title: '¿Está seguro de elimnar la empresa?',
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
        this.empresasFirestore.delete(idEmpresa).then((res)=>{
          Swal.fire("La empresa ha sido eliminada con éxito.", '', 'success');
        })
      } 
    });

  }

}




