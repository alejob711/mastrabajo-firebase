import { ChangeDetectionStrategy, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { TrabajoFirestoreService } from '../../../trabajos/services/trabajo-firestore.service';
import { Observable, take } from 'rxjs';
import { Trabajo } from 'src/app/trabajos/interfaces/trabajo.interface';
import { DOCUMENT } from '@angular/common';
import { EmpresaFirestoreService } from '../../../empresa/services/empresa-firestore.service';
import { TipotrabajoFirestoreService } from '../../../tipotrabajo/services/tipotrabajo-firestore.service';
import { TipoTrabajo } from 'src/app/tipotrabajo/interfaces/tipotrabajo.interface';
import { Empresa } from 'src/app/empresa/interfaces/empresa.interface';
import { SubstringPipe } from '../../../shared/pipes/substring.pipe';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioComponent implements OnInit {

  // todosLosTrabajos : Trabajo[] = [];
  todosLosTrabajos : Observable<Trabajo[]>;
  todosLosTipoTrabajo : TipoTrabajo[] = [];
  todasLasEmpresas : Empresa[] = [];
  imagenesDeTrabajos : any[] = [];

  cantSolicitProgramacion : number ;
  cantSolicitAdministracion : number ;
  cantSolicitLogistica : number ;
  cantSolicitVentas : number ;
  cantSolicitGastronomia : number ;
  cantSolicitComunicacion : number ;
  cantSolicitEducacion : number ;

  constructor(private renderer: Renderer2,
              @Inject(DOCUMENT) private _document : any,
              private trabajoFirestoreService : TrabajoFirestoreService,
              private empresaFirestoreService : EmpresaFirestoreService,
              private tipotrabajoFirestoreService : TipotrabajoFirestoreService,
              private substring: SubstringPipe) { }

  ngAfterViewInit(){
    var s = this.renderer.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/plugins/nice-select/js/jquery.nice-select.min.js";
    this.renderer.appendChild(this._document.body, s);

    var s2 = this.renderer.createElement("script");
    s2.type = "text/javascript";
    s2.src = "assets/js/custom.js";
    this.renderer.appendChild(this._document.body, s2);

  }

  ngOnInit(): void {
    
    // this.trabajoFirestoreService.getAll().subscribe(res=>{
    //   this.todosLosTrabajos = res
    // });
    this.todosLosTrabajos = this.trabajoFirestoreService.getAll();

    this.tipotrabajoFirestoreService.getAll().subscribe(res=>{
      this.todosLosTipoTrabajo = res;
    });
    this.empresaFirestoreService.getAll().subscribe(res=>{
      this.todasLasEmpresas = res;
    });

    this.obtenerCantidadSolicitudes();

  }

  obtenerImagenEmpresa(id : string){
    let empresa = this.todasLasEmpresas.filter(empresa => empresa.id === id )
    return empresa[0].imgLogo
  }

  obtenerTipoTrabajo(id:string){
    let tipoTrabajo = this.todosLosTipoTrabajo.filter(tipotrabajo => tipotrabajo.id === id )
    return tipoTrabajo[0].nombre
  }

  obtenerCantidadSolicitudes(){
    this.todosLosTrabajos.subscribe(async res=>{
      this.cantSolicitProgramacion = await res.filter(trabajo=>trabajo.areaTrabajoId === 'AXfjZmIiZl4AB9X1qjOB').length;
      this.cantSolicitAdministracion = await res.filter(trabajo=>trabajo.areaTrabajoId === 'wt9UBdTsdhcUkklKeDva').length;
      this.cantSolicitLogistica = await res.filter(trabajo=>trabajo.areaTrabajoId === 'B5iw9sGWRFaGHULtcnDu').length;
      this.cantSolicitVentas = await res.filter(trabajo=>trabajo.areaTrabajoId === 'nQXaX5PlVge41aXd4Px8').length;
      this.cantSolicitGastronomia = await res.filter(trabajo=>trabajo.areaTrabajoId === '2w6aer7y3e4CZ5cWHIAt').length;
      this.cantSolicitComunicacion = await res.filter(trabajo=>trabajo.areaTrabajoId === 'N0NAcgWKINN5NQ5nxAFH').length;
      this.cantSolicitEducacion = await res.filter(trabajo=>trabajo.areaTrabajoId === 'oWSHkalva8oO5tirooAp').length;
    });
    
  }

}
