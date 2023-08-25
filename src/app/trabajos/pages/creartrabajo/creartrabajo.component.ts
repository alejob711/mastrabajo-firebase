import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/empresa/interfaces/empresa.interface';
import { EmpresaFirestoreService } from '../../../empresa/services/empresa-firestore.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { TipotrabajoFirestoreService } from '../../../tipotrabajo/services/tipotrabajo-firestore.service';
import { TipoTrabajo } from '../../../tipotrabajo/interfaces/tipotrabajo.interface';
import { CategoriaFirestoreService } from '../../../categorias/services/categoria-firestore.service';
import { Categoria } from 'src/app/categorias/interfaces/categoria';
import Swal from 'sweetalert2';
import { AuthService } from '../../../usuarios/services/auth.service';
import { TrabajoFirestoreService } from '../../services/trabajo-firestore.service';
import { Router } from '@angular/router';
import { Trabajo } from '../../interfaces/trabajo.interface';
import  * as moment  from 'moment';

@Component({
  selector: 'app-creartrabajo',
  templateUrl: './creartrabajo.component.html',
  styleUrls: ['./creartrabajo.component.scss']
})
export class CreartrabajoComponent implements OnInit {

  indicarHorarios : boolean = false;
  indicarRemuneracion : boolean = false;
  horarioCortado : boolean = false;
  horario2 : boolean = false;
  horario3 : boolean = false;
  botonVisible : boolean = true;
  botonEliminarVisible : boolean = false;
  diasLaborales : any = [
    {
      nombre: 'Lunes',
      value : 1
    },
    {
      nombre: 'Martes',
      value : 2
    },
    {
      nombre: 'Miercoles',
      value : 3
    },
    {
      nombre: 'Jueves',
      value : 4
    },
    {
      nombre: 'Viernes',
      value : 5
    },
    {
      nombre: 'Sabado',
      value : 6
    },
    {
      nombre: 'Domingo',
      value : 7
    }
  ]

  //todasLasEmpresas : Observable<Empresa[]>;
  todasLasEmpresas : Empresa[];
  todosLosTipoTrabajo : Observable<TipoTrabajo[]>;
  todasLasAreaTrabajo : Observable<Categoria[]>;

  nuevoTrabajo : Trabajo;

  public trabajoForm : FormGroup = this.fb.group({
    empresaId : [ , [Validators.required]],
    puestoTrabajo : [ , [Validators.required]],
    ciudad : [ , [Validators.required]],
    provincia : [ , [Validators.required]],
    tipoTrabajoId : [ , [Validators.required]],
    areaTrabajoId : [ , [Validators.required]],
    descripcionPuesto : [ , [Validators.required]],
    tipoHorario : [ , [Validators.required]],
    diasLaborales1: this.fb.array([]),
    horarioTrabajo1 : [ , []],
    horario1desde : [ ],
    horario1hasta : [ ],
    horario1desdecortado : [ , []],
    horario1hastacortado : [ , []],
    diasLaborales2: this.fb.array([]),
    horarioTrabajo2 : [ , []],
    horario2desde : [ ],
    horario2hasta : [ ],
    horario2desdecortado : [ , []],
    horario2hastacortado : [ , []],
    diasLaborales3: this.fb.array([]),
    horarioTrabajo3 : [ , []],
    horario3desde : [ ],
    horario3hasta : [ ],
    horario3desdecortado : [ , []],
    horario3hastacortado : [ , []],
    remuneracionOfrecida : [ , [Validators.required]],
    tipoRemuneracion : [ , []],
    remuneracionMinima : [ , []],
    remuneracionMaxima : [ , []],
    genero : [ , [Validators.required]],
    edadMinima: [ , [Validators.required]],
    edadMaxima: [ , ],
    nivelEstudioMinimo: [ , [Validators.required]],
    estadoEstudios: [ , [Validators.required]],
    areasEstudio: [],
    experienciasLaboralesPrevias: [ , [Validators.required]],
    noEspecificarEmpresa : [false],
    alternativaNombre : [, Validators.maxLength(25)]
  }); 

  isApiLoaded = false;
  options: any = {
    componentRestrictions : {country : "AR"},
    types: ['(cities)'],
  }

  constructor(private renderer: Renderer2,
              @Inject(DOCUMENT) private _document : any,
              private empresasFirestore : EmpresaFirestoreService,
              private tipotrabajoFirestore : TipotrabajoFirestoreService,
              private categoriaFirestore : CategoriaFirestoreService,
              private fb : FormBuilder,
              private mapsAPILoader: MapsAPILoader,
              public authService : AuthService,
              private trabajoFirestoreService : TrabajoFirestoreService,
              private router: Router) { }

  ngOnInit(): void {
    
    //ESTO CARGA LA API PARA PODER HACER LA PRE VISUALIZACION DE DIRECCIONES CON GOOGLE MAPS
    this.mapsAPILoader.load().then(() =>{
      this.isApiLoaded = true
    })

    // this.todasLasEmpresas = this.empresasFirestore.getAll(this.authService.userID);

    this.empresasFirestore.getAll(this.authService.userID).subscribe(res=>{
      this.todasLasEmpresas = res;
    });


    this.todosLosTipoTrabajo = this.tipotrabajoFirestore.getAll();
    this.todasLasAreaTrabajo = this.categoriaFirestore.getAll();
  }

  ngAfterViewInit(){
    // var s = this.renderer.createElement("script");
    // s.type = "text/javascript";
    // s.src = "assets/plugins/nice-select/js/jquery.nice-select.min.js";
    // this.renderer.appendChild(this._document.body, s);

    // var s2 = this.renderer.createElement("script");
    // s2.type = "text/javascript";
    // s2.src = "assets/js/custom.js";
    // this.renderer.appendChild(this._document.body, s2);

  }

  addHorario(){
    if (!this.horario2) {
      this.horario2 = true
      this.botonEliminarVisible = true
    }else{
      if(!this.horario3){
        this.horario3 = true;
        this.botonVisible = false;
      }
    }
  }

  eliminarHorario(){
    if (this.horario2 && !this.horario3) {
      this.horario2 = false
      this.botonEliminarVisible = false
    }else{
      if(this.horario3){
        this.horario3 = false;
      }
    }
  }

  // validarTipoHorario(){
  //   if (this.trabajoForm.controls['tipoHorario'].value===2){
  //     this.indicarHorarios = true;
  //   }else{
  //     this.indicarHorarios = false;
  //   }
  // }

  // validarHorarioTrabajo(){
  //   if (this.trabajoForm.controls['horarioTrabajo1'].value===2){
  //     this.horarioCortado = true;
  //   }else{
  //     this.horarioCortado = false;
  //   }
  // }
  
  validarRemuneracionOfrecida(){
    if (this.trabajoForm.controls['remuneracionOfrecida'].value===1){
      this.indicarRemuneracion = true;
    }else{
      this.indicarRemuneracion = false;
    }
  }

  submitTrabajoData(){
    if (this.trabajoForm.valid) {
      this.storeData();
    } else {
      this.validateAllFormFields(this.trabajoForm); //{7}
    }
  }

  crearInformacion(num1 : any ,num2 : any){
    return num1 + num2;
  }

  async storeData(){

    Swal.fire('Guardando trabajo...')
    Swal.showLoading() 

      this.nuevoTrabajo = {... this.trabajoForm.value};
      
      let empresaSeleccionada = await this.todasLasEmpresas.filter((emp) => emp.id == this.nuevoTrabajo.empresaId);

      this.nuevoTrabajo.empresaNombre = empresaSeleccionada[0].nombre;

      this.nuevoTrabajo.idUsuario = this.authService.userID;
      this.nuevoTrabajo.fechaCreacion = new Date();
      this.nuevoTrabajo.fechaVencimiento = new Date();
      this.nuevoTrabajo.fechaVencimiento.setDate(this.nuevoTrabajo.fechaVencimiento.getDate()+15)
  
      this.nuevoTrabajo.descripcionPuesto.replace("\n", "<br>");
      this.nuevoTrabajo.areasEstudio?.replace("\n", "<br>");
      this.nuevoTrabajo.experienciasLaboralesPrevias.replace("\n", "<br>");

      console.log(this.nuevoTrabajo);
  
      this.trabajoFirestoreService.create(this.nuevoTrabajo).then((res)=>{

        Swal.fire({
          title: 'El nuevo trabajo fue creado de manera exitosa',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#5a435c',
          timer: 2000,
          showConfirmButton: false
        }).then(()=>{
          this.router.navigate([`usuarios/${this.authService.userID}/trabajos`]);
        });

      })
  }

  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  }

  handleAddressChange(address: any) {

    this.trabajoForm.controls["ciudad"].setValue(address.name);

    let provincia = address.address_components.filter( (ac : any) => ac.types[0] === "administrative_area_level_1" )

    this.trabajoForm.controls["provincia"].setValue(provincia[0].short_name);

  }

  //VALIDO QUE DIAS SELECCIONE EN EL FORMULARIO COMO DIAS LABORALES Y LOS AGREGO AL CAMPO DEL FORMULARIO COMO UN ARRAY
  onCheckChange(event : any, field:string){

    const diasLaborales: FormArray = this.trabajoForm.get(field) as FormArray;

    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      diasLaborales.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      diasLaborales.controls.forEach((ctrl: any) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          diasLaborales.removeAt(i);
          return;
        }

        i++;
      });
  }

  }

}
