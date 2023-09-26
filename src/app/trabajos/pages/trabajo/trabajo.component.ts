import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrabajoFirestoreService } from '../../services/trabajo-firestore.service';
import { Trabajo } from '../../interfaces/trabajo.interface';
import { Empresa } from 'src/app/empresa/interfaces/empresa.interface';
import { EmpresaFirestoreService } from 'src/app/empresa/services/empresa-firestore.service';
import { TipotrabajoFirestoreService } from 'src/app/tipotrabajo/services/tipotrabajo-firestore.service';
import { TipoTrabajo } from 'src/app/tipotrabajo/interfaces/tipotrabajo.interface';

@Component({
  selector: 'app-trabajo',
  templateUrl: './trabajo.component.html',
  styleUrls: ['./trabajo.component.scss']
})
export class TrabajoComponent implements OnInit {

  trabajo: Trabajo;
  empresa: Empresa;
  tiposTrabajo : TipoTrabajo[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private trabajoFirestoreService : TrabajoFirestoreService,
              private empresaFirestoreService : EmpresaFirestoreService,
              private tipoTrabajoFirestoreService : TipotrabajoFirestoreService) { }

  ngOnInit(): void {
    const idTrabajo = this.activatedRoute.snapshot.paramMap.get('trabajoId');

    console.log(idTrabajo);

    this.tipoTrabajoFirestoreService.getAll().subscribe((tiposTrabajo:any)=>{
      this.tiposTrabajo = tiposTrabajo
    })

    if (idTrabajo){
      this.trabajoFirestoreService.get(idTrabajo).subscribe((trabajo : any) =>{

        this.trabajo = trabajo;

        this.empresaFirestoreService.get(this.trabajo.empresaId).subscribe((empresa:any)=>{
          this.empresa = empresa
        })

        console.log(trabajo);
      });
    }
  }

  obtenerNombreTipoTrabajo(tipoTrabajoID : string) : string{
    let tipoTrabajo = this.tiposTrabajo.filter(trabajo => trabajo.id == tipoTrabajoID);
    return tipoTrabajo[0].nombre;
  }
    

}
