import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { TrabajoFirestoreService } from '../../services/trabajo-firestore.service';
import { Trabajo } from '../../interfaces/trabajo.interface';
import { TipoTrabajo } from 'src/app/tipotrabajo/interfaces/tipotrabajo.interface';
import { TipotrabajoFirestoreService } from '../../../tipotrabajo/services/tipotrabajo-firestore.service';
import { EmpresaFirestoreService } from '../../../empresa/services/empresa-firestore.service';
import { Empresa } from 'src/app/empresa/interfaces/empresa.interface';
import { Categoria } from 'src/app/categorias/interfaces/categoria';
import { CategoriaFirestoreService } from 'src/app/categorias/services/categoria-firestore.service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-trabajos',
  templateUrl: './trabajos.component.html',
  styleUrls: ['./trabajos.component.scss'],
})
export class TrabajosComponent implements OnInit {

  todosLosTrabajos : Trabajo[] = [];
  todosLosTrabajosInicial : Trabajo[] = [];
  todosLosTipoTrabajos : TipoTrabajo[];
  todasLasEmpresas : Empresa[] = [];
  todasLasCategoriasTrabajos : Categoria[] = [];

  isApiLoaded = false;
  options: any = {
    componentRestrictions : {country : "AR"},
    types: ['(cities)'],
  }

  trabajosPorContrato : Trabajo[];
  trabajosPorHoras : Trabajo[];
  trabajosFullTime : Trabajo[];
  trabajosVoluntario : Trabajo[];
  trabajosPasantia : Trabajo[];
  trabajosRemoto : Trabajo[];
  trabajosFDS : Trabajo[];

  trabajosCompras : Trabajo[];
  trabajosGastronomia : Trabajo[];
  trabajosSistemas : Trabajo[];
  trabajosLogistica : Trabajo[];
  trabajosLimpieza : Trabajo[];
  trabajosSalud : Trabajo[];
  trabajosPublicidad : Trabajo[];
  trabajosRRHH : Trabajo[];
  trabajosSectorAgropecuario : Trabajo[];
  trabajosConstruccionOficios : Trabajo[];
  trabajosCalidad : Trabajo[];
  trabajosProduccion : Trabajo[];
  trabajosComercioExterior : Trabajo[];
  trabajosAtencionAlPublicoVentas : Trabajo[];
  trabajosEducacion : Trabajo[];
  trabajosMantenimiento : Trabajo[];
  trabajosAdministracionContabilidad : Trabajo[];

  verFiltrosCategoria : boolean = true;
  verFiltrosTipoTrabajo : boolean = true;
  verFiltroLocalidad : boolean = true;

  filtrosAplicados : any[] = [];

  constructor(private renderer: Renderer2,
              @Inject(DOCUMENT) private _document : any,
              private trabajoFirestoreService : TrabajoFirestoreService,
              private tipotrabajoFirestoreService : TipotrabajoFirestoreService,
              private empresaFirestoreService : EmpresaFirestoreService,
              private categoriasFirestoreService : CategoriaFirestoreService,
              private mapsAPILoader: MapsAPILoader,) { }

  ngOnInit(): void {

    //ESTO CARGA LA API PARA PODER HACER LA PRE VISUALIZACION DE DIRECCIONES CON GOOGLE MAPS
    this.mapsAPILoader.load().then(() =>{
      this.isApiLoaded = true
    })

    this.trabajoFirestoreService.getAll().subscribe(res=>{
      this.todosLosTrabajos = res;
      this.todosLosTrabajosInicial = res;
      //this.obtenerCantidadTipoTrabajo();
      //this.obtenerCantidadTrabajosPorCategoria();
    });

    this.tipotrabajoFirestoreService.getAll().subscribe(res => this.todosLosTipoTrabajos = res);

    this.categoriasFirestoreService.getAll().subscribe(res => this.todasLasCategoriasTrabajos = res);

    this.empresaFirestoreService.getAll().subscribe(res=> this.todasLasEmpresas = res );

  }

  ngAfterViewInit(){
    var s = this.renderer.createElement("script");
    // s.onload = this.loadNextScript.bind(this);
    s.type = "text/javascript";
    s.src = "assets/plugins/nice-select/js/jquery.nice-select.min.js";

    this.renderer.appendChild(this._document.body, s);

    var s2 = this.renderer.createElement("script");
    // s.onload = this.loadNextScript.bind(this);
    s2.type = "text/javascript";
    s2.src = "assets/js/custom.js";
    this.renderer.appendChild(this._document.body, s2);
  }

  obtenerNombreTipoTrabajo(id:string){
    //TODO - ESTE METODO SE LLAMA MUCHAS MAS VECES DE LAS DEBIDAS
    if (this.todosLosTipoTrabajos){
      let tipot = this.todosLosTipoTrabajos.filter(tipotrabajo => tipotrabajo.id === id)
      return tipot[0].nombre;
    }
    return ''; 
  }

  obtenerImagenEmpresa(id : string){
    if(this.todasLasEmpresas.length > 0){
      let empresa = this.todasLasEmpresas.filter(empresa => empresa.id === id )
      return empresa[0].imgLogo
    }
    return '';
  }

  obtenerTipoRemuneracion(idTipo:string|null){
    if (!idTipo) {
      return null
    }else{
      if(idTipo === '2'){
        return 'Remuneración Bruta'
      }else{
        return 'Remuneracion Neta'
      }
    }
  }
  
  obtenerGenero(idTipo:string|null){
    if (idTipo == '1') {
      return 'Masculino'
    }else{
      if(idTipo == '2'){
        return 'Femenino'
      }else{
        return 'Indistinto'
      }
    }
  }

  async eliminarFiltro(valor:string){

    this.filtrosAplicados = this.filtrosAplicados.filter(filtro => filtro.valor != valor);

    this.todosLosTrabajos = await this.todosLosTrabajosInicial;

    console.log(this.filtrosAplicados);

    this.verFiltrosCategoria = true;
    this.verFiltrosTipoTrabajo = true;
    this.verFiltroLocalidad = true;

    if (this.filtrosAplicados.length === 0){
      // this.verFiltrosCategoria = true;
      // this.verFiltrosTipoTrabajo = true;
      // this.verFiltroLocalidad = true;
    }else{
      await this.filtrosAplicados.forEach(async (filtroAplicado) => {
        console.log('Filtro Aplicado: ',filtroAplicado);
        console.log('Trabajos: ',this.todosLosTrabajos);

        if (filtroAplicado.clave === 'Categoria'){
          await this.filtrarPorCategoriaTrabajo(filtroAplicado.objeto, true);
          // this.verFiltrosTipoTrabajo = true;
          // this.verFiltroLocalidad = true;
        }else if(filtroAplicado.clave === 'Tipo Trabajo'){
          await this.filtrarPorTipoTrabajo(filtroAplicado.objeto, true);
          // this.verFiltrosCategoria = true;
          // this.verFiltroLocalidad = true;
        }else{
          await this.filtrarPorLocalidad(filtroAplicado.objeto, true);
          // this.verFiltrosCategoria = true;
          // this.verFiltrosTipoTrabajo = true;
        }
      });
    }
  }

  async filtrarPorLocalidad(address: any, filtroYaExistente ? : boolean) {

    let nombreLocalidad = address.name;

    let provincia = address.address_components.filter( (ac : any) => ac.types[0] === "administrative_area_level_1" )
    
    if (!filtroYaExistente){
      this.filtrosAplicados.push({clave : 'Localidad', valor : nombreLocalidad, objeto : address});
    }

    this.todosLosTrabajos = await this.todosLosTrabajos.filter(trabajo=>trabajo.ciudad === nombreLocalidad && trabajo.provincia == provincia[0].short_name);

    this.verFiltroLocalidad = false;

    console.log(this.todosLosTrabajos);

  }

  /**
   * Obtener Cantidad Tipo Trabajo
   * 
   * Obtiene un vector por cada tipo de trabajo, 
   * en el cual se listan los trabajos que pertenecen a ese tipo de trabajo
   */
  obtenerCantidadTipoTrabajo(tipoTrabajoID : string) : number {
    let trabajosPorTipoTrabajo = this.todosLosTrabajos.filter(trabajo=>trabajo.tipoTrabajoId === tipoTrabajoID);
    return trabajosPorTipoTrabajo.length;
  }
  
  /**
   * Obtener Cantidad Trabajos Por Categoria
   * 
   * Obtiene un vector por cada categoria de trabajo, 
   * en el cual se listan los trabajos que pertenecen a esa categoria
   */
  // obtenerCantidadTrabajosPorCategoria(){
  //   if (this.todosLosTrabajos.length > 0){
  //     this.trabajosCompras = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === '14saW681gysD0XpxyGP2');
  //     this.trabajosGastronomia = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === '2w6aer7y3e4CZ5cWHIAt');
  //     this.trabajosSistemas = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'AXfjZmIiZl4AB9X1qjOB');
  //     this.trabajosLogistica = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'B5iw9sGWRFaGHULtcnDu');
  //     this.trabajosLimpieza = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'BHtko3JcSuPz8ryOflCL');
  //     this.trabajosSalud = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'EWr7t73al9qdP5T5Qh2Q');
  //     this.trabajosPublicidad = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'N0NAcgWKINN5NQ5nxAFH');
  //     this.trabajosRRHH = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'RYbZZ6fPpZJAk3j70D0b');
  //     this.trabajosSectorAgropecuario = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'RviW4monjMFVfZYv62yV');
  //     this.trabajosConstruccionOficios = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'SHmFvTFQZGatz5ijkEi9');
  //     this.trabajosCalidad = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'kGqfYpLx26wb1WqOGS0v');
  //     this.trabajosProduccion = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'c8AKv79Aa1DRNw6Q8hd0');
  //     this.trabajosComercioExterior = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'lhs5GlFCLTmzkr4hAF9l');
  //     this.trabajosAtencionAlPublicoVentas = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'nQXaX5PlVge41aXd4Px8');
  //     this.trabajosEducacion = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'oWSHkalva8oO5tirooAp');
  //     this.trabajosMantenimiento = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'tu2sErQxbguUz4WOCxxw');
  //     this.trabajosAdministracionContabilidad = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === 'wt9UBdTsdhcUkklKeDva');
  //   }
  // }

  obtenerCantidadTrabajosPorCategoria(categoriaTrabajoID : string){
    let trabajosPorCategoria = this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === categoriaTrabajoID);
    return trabajosPorCategoria.length;
  }

  // /**
  //  * Filtrar Trabajos
  //  * 
  //  * Al seleccionar un filtro
  //  * @param tipoFiltro 
  //  * @param event 
  //  */
  // async filtrarTrabajos(tipoFiltro:string ,event:any){
  //   console.log(tipoFiltro);
  //   if (tipoFiltro === 'Categoria'){
  //     this.filtrosAplicados.push({clave : 'Categoria', valor : event.srcElement.defaultValue});
  //     await this.filtrarCategorias(event);
  //     //await this.obtenerCantidadTipoTrabajo();
  //     this.verFiltrosCategoria=false;
  //   }else if(tipoFiltro ==='Tipo Trabajo'){
  //     this.filtrosAplicados.push({clave : 'Tipo Trabajo', valor : event.srcElement.defaultValue});
  //     await this.filtrarTipoTrabajo(event);
  //     //await this.obtenerCantidadTrabajosPorCategoria();
  //     this.verFiltrosTipoTrabajo = false;
  //   }
    
  // }

  async filtrarPorTipoTrabajo(tipoTrabajo : TipoTrabajo, filtroYaExistente ? : boolean){
    this.verFiltrosTipoTrabajo = false;
    if (! filtroYaExistente){
      this.filtrosAplicados.push({clave : 'Tipo Trabajo', valor : tipoTrabajo.nombre, objeto : tipoTrabajo});
    }
    
    this.todosLosTrabajos = await this.todosLosTrabajos.filter(trabajo=>trabajo.tipoTrabajoId === tipoTrabajo.id);

    console.log(this.todosLosTrabajos);

  }

  async filtrarPorCategoriaTrabajo(categoriaTrabajo : Categoria, filtroYaExistente ? : boolean){
    this.verFiltrosCategoria = false;
    
    if (! filtroYaExistente){
      this.filtrosAplicados.push({clave : 'Categoria', valor : categoriaTrabajo.nombre, objeto : categoriaTrabajo});
    }

    this.todosLosTrabajos = await this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === categoriaTrabajo.id);

    console.log(this.todosLosTrabajos);

  }

  filtrarTipoTrabajo(event:any){

    let filtroSeleccionado : string = event.srcElement.defaultValue;

    switch (filtroSeleccionado) { 
      case 'Por Contrato': { 
        this.aplicarFiltro('tipotrabajo', '8Y2scgC2BFlLBa4FLlmZ');
         break; 
      } 
      case 'Por Horas': { 
        this.aplicarFiltro('tipotrabajo', '9RU30p9XKrIbjHr8QAaL');
         break; 
      } 
      case 'Full Time': { 
        this.aplicarFiltro('tipotrabajo', 'RIDAJpoY30jfUl5PJK3N');
         break; 
      } 
      case 'Voluntario': { 
        this.aplicarFiltro('tipotrabajo', 'TFnyZdJBAuyWCBcEOCzj');
         break; 
      } 
      case 'Pasantia': { 
        this.aplicarFiltro('tipotrabajo', 'Wwb8E4vMVzxrrZBqg9Jk');
         break; 
      } 
      case 'Remoto': { 
        this.aplicarFiltro('tipotrabajo', 'XJNo9qkQiLLrAcZ34z42');
         break; 
      } 
      case 'Fin de Semana': { 
        this.aplicarFiltro('tipotrabajo', 'fkzqbAIsd4kGmn9gEWiA');
         break; 
      } 
    }
  }

  filtrarCategorias(event:any){

    let categoriaSeleccionada : string = event.srcElement.defaultValue;

    switch (categoriaSeleccionada) { 
      case 'Administracion': { 
        this.aplicarFiltro('categoria', 'wt9UBdTsdhcUkklKeDva');
         break; 
      } 
      case 'Agropecuario': { 
        this.aplicarFiltro('categoria', 'RviW4monjMFVfZYv62yV');
         break; 
      } 
      case 'Calidad': { 
        this.aplicarFiltro('categoria', 'kGqfYpLx26wb1WqOGS0v');
         break; 
      } 
      case 'Comercio Exterior': { 
        this.aplicarFiltro('categoria', 'lhs5GlFCLTmzkr4hAF9l');
         break; 
      } 
      case 'Compras': { 
        this.aplicarFiltro('categoria', '14saW681gysD0XpxyGP2');
         break; 
      } 
      case 'Gastronomia': { 
        this.aplicarFiltro('categoria', '14saW681gysD0XpxyGP2');
         break; 
      } 
      case 'Construccion': { 
        this.aplicarFiltro('categoria', 'SHmFvTFQZGatz5ijkEi9');
         break; 
      } 
      case 'Educacion': { 
        this.aplicarFiltro('categoria', '2w6aer7y3e4CZ5cWHIAt');
         break; 
      } 
      case 'Limpieza': { 
        this.aplicarFiltro('categoria', 'BHtko3JcSuPz8ryOflCL');
         break; 
      } 
      case 'Logistica': { 
        this.aplicarFiltro('categoria', 'B5iw9sGWRFaGHULtcnDu');
         break; 
      } 
      case 'Mantenimiento': { 
        this.aplicarFiltro('categoria', 'tu2sErQxbguUz4WOCxxw');
         break; 
      } 
      case 'Produccion': { 
        this.aplicarFiltro('categoria', 'c8AKv79Aa1DRNw6Q8hd0');
         break; 
      } 
      case 'Publicidad': { 
        this.aplicarFiltro('categoria', 'N0NAcgWKINN5NQ5nxAFH');
         break; 
      } 
      case 'Rec. Humanos': { 
        this.aplicarFiltro('categoria', 'RYbZZ6fPpZJAk3j70D0b');
         break; 
      } 
      case 'Salud': { 
        this.aplicarFiltro('categoria', 'EWr7t73al9qdP5T5Qh2Q');
         break; 
      } 
      case 'Sistemas': { 
        this.aplicarFiltro('categoria', 'AXfjZmIiZl4AB9X1qjOB');
         break; 
      } 
      case 'Ventas': { 
        this.aplicarFiltro('categoria', 'nQXaX5PlVge41aXd4Px8');
         break; 
      } 
    }

  }

  async aplicarFiltro(tipoFiltro : string, id:string){

    let trabajosPorFiltro : Trabajo[] = [];
    //let fuenteDetrabajo : Trabajo[];

    if (this.filtrosAplicados.length === 1){
      this.todosLosTrabajos = [];
      //fuenteDetrabajo = await this.todosLosTrabajosInicial;
    // }else{
    //   fuenteDetrabajo = await this.todosLosTrabajos;
    }

    if (tipoFiltro === 'categoria'){
      if(this.filtrosAplicados.length === 1){
        trabajosPorFiltro = await this.todosLosTrabajosInicial.filter(trabajo=>trabajo.areaTrabajoId === id)
      }else{
        trabajosPorFiltro = await this.todosLosTrabajos.filter(trabajo=>trabajo.areaTrabajoId === id)
      }
      
      //this.todosLosTrabajos = this.todosLosTrabajos.concat(trabajosPorFiltro);
      this.todosLosTrabajos = trabajosPorFiltro;

    }

    if (tipoFiltro === 'tipotrabajo'){
      if(this.filtrosAplicados.length === 1){
        trabajosPorFiltro = await this.todosLosTrabajosInicial.filter(trabajo=>trabajo.tipoTrabajoId === id);
      }else{
        trabajosPorFiltro = await this.todosLosTrabajos.filter(trabajo=>trabajo.tipoTrabajoId === id);
      }  
      // this.todosLosTrabajos = this.todosLosTrabajos.concat(trabajosPorFiltro);    
      this.todosLosTrabajos = trabajosPorFiltro;    
    }

  }

}
