import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { Trabajo } from '../../interfaces/trabajo.interface';

@Component({
  selector: 'app-creartrabajo',
  templateUrl: './creartrabajo.component.html',
  styleUrls: ['./creartrabajo.component.scss']
})
export class CreartrabajoComponent implements OnInit {

  indicarHorarios : boolean = false;
  indicarRemuneracion : boolean = false;
  cantHorariosIndicados : number = 0;
  horarioCortado : boolean = false;
  horario2 : boolean = false;
  horario3 : boolean = false;
  botonVisible : boolean = true;
  botonEliminarVisible : boolean = false;
  diasLaborales : any = [
    {
      "nombre": 'Lunes',
      "value" : 1,
      "selected": false
    },
    {
      "nombre": 'Martes',
      "value" : 2,
      "selected": false
    },
    {
      "nombre": 'Miercoles',
      "value" : 3,
      "selected": false
    },
    {
      "nombre": 'Jueves',
      "value" : 4,
      "selected": false
    },
    {
      "nombre": 'Viernes',
      "value" : 5,
      "selected": false
    },
    {
      "nombre": 'Sabado',
      "value" : 6,
      "selected": false
    },
    {
      "nombre": 'Domingo',
      "value" : 7,
      "selected": false
    }
  ]

  //todasLasEmpresas : Observable<Empresa[]>;
  todasLasEmpresas : Empresa[];
  todosLosTipoTrabajo : Observable<TipoTrabajo[]>;
  todasLasAreaTrabajo : Observable<Categoria[]>;

  nuevoTrabajo : Trabajo;
  trabajo:Trabajo;

  public trabajoForm : FormGroup = this.fb.group({
    empresaId : [ , [Validators.required]],
    puestoTrabajo : [ , [Validators.required]],
    ciudad : [ , [Validators.required]],
    provincia : [ , [Validators.required]],
    tipoTrabajoId : [ , [Validators.required]],
    areaTrabajoId : [ , [Validators.required]],
    descripcionPuesto : [ , [Validators.required]],
    tipoHorario : [ , [Validators.required]],
    diasLaborales1: this.buildDiasLaborales(),
    horarioTrabajo1 : [ , []],
    horario1desde : [ ],
    horario1hasta : [ ],
    horario1desdecortado : [ , []],
    horario1hastacortado : [ , []],
    diasLaborales2: this.buildDiasLaborales(),
    horarioTrabajo2 : [ , []],
    horario2desde : [ ],
    horario2hasta : [ ],
    horario2desdecortado : [ , []],
    horario2hastacortado : [ , []],
    diasLaborales3: this.buildDiasLaborales(),
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

  estadoPantalla:string = 'Crear'

  constructor(private empresasFirestore : EmpresaFirestoreService,
              private tipotrabajoFirestore : TipotrabajoFirestoreService,
              private categoriaFirestore : CategoriaFirestoreService,
              private fb : FormBuilder,
              private mapsAPILoader: MapsAPILoader,
              public authService : AuthService,
              private trabajoFirestoreService : TrabajoFirestoreService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  get diasLaborales1() {
    return this.trabajoForm.get('diasLaborales1') as FormArray;
  }
  
  get diasLaborales2() {
    return this.trabajoForm.get('diasLaborales2') as FormArray;
  }
  
  get diasLaborales3() {
    return this.trabajoForm.get('diasLaborales3') as FormArray;
  }

  ngOnInit(): void {
    
    //ESTO CARGA LA API PARA PODER HACER LA PRE VISUALIZACION DE DIRECCIONES CON GOOGLE MAPS
    this.mapsAPILoader.load().then(() =>{
      this.isApiLoaded = true
    })

    this.empresasFirestore.getAll(this.authService.userID).subscribe(res=>{
      this.todasLasEmpresas = res;
    });

    this.todosLosTipoTrabajo = this.tipotrabajoFirestore.getAll();
    this.todasLasAreaTrabajo = this.categoriaFirestore.getAll();

    const idTrabajo = this.activatedRoute.snapshot.paramMap.get('trabajoId');

    if (idTrabajo != null){

      this.estadoPantalla = 'Actualizar';

      this.trabajoFirestoreService.get(idTrabajo).subscribe((trabajo : any) =>{

        this.trabajo = trabajo;

        console.log(this.trabajo);

        let diasLaborales1Array = trabajo['diasLaborales1'].map((x:any) => {
          return this.fb.control(
            {
              nombre : x.nombre, 
              value : x.value, 
              selected : x.selected
            }
          );
        });

        let diasLaborales2Array = trabajo['diasLaborales2'].map((x:any) => {
          if (x.selected) { 
            this.horario2 = true;
            this.botonEliminarVisible = true;
          }
          return this.fb.control(
            {
              nombre : x.nombre, 
              value : x.value, 
              selected : x.selected
            }
          );
        });
        
        let diasLaborales3Array = trabajo['diasLaborales3'].map((x:any) => {
          if (x.selected) { 
            this.horario3 = true;
            this.botonVisible = false;
            this.botonEliminarVisible = true;
          }
          return this.fb.control(
            {
              nombre : x.nombre, 
              value : x.value, 
              selected : x.selected
            }
          );
        });

        this.trabajoForm = this.fb.group({
          empresaId : [ trabajo['empresaId'] , [Validators.required]],
          puestoTrabajo : [ trabajo['puestoTrabajo'], [Validators.required]],
          ciudad : [ trabajo['ciudad'], [Validators.required]],
          provincia : [ trabajo['provincia'], [Validators.required]],
          tipoTrabajoId : [ trabajo['tipoTrabajoId'], [Validators.required]],
          areaTrabajoId : [ trabajo['areaTrabajoId'], [Validators.required]],
          descripcionPuesto : [ trabajo['descripcionPuesto'], [Validators.required]],
          tipoHorario : [ trabajo['tipoHorario'], [Validators.required]],
          diasLaborales1: this.fb.array(diasLaborales1Array),
          horarioTrabajo1 : [ trabajo['horarioTrabajo1'], []],
          horario1desde : [ trabajo['horario1desde']],
          horario1hasta : [ trabajo['horario1hasta']],
          horario1desdecortado : [ trabajo['horario1desdecortado'], []],
          horario1hastacortado : [ trabajo['horario1hastacortado'], []],
          diasLaborales2: this.fb.array(diasLaborales2Array),
          horarioTrabajo2 : [ trabajo['horarioTrabajo2'], []],
          horario2desde : [ trabajo['horario2desde']],
          horario2hasta : [ trabajo['horario2hasta']],
          horario2desdecortado : [ trabajo['horario2desdecortado'], []],
          horario2hastacortado : [ trabajo['horario2hastacortado'], []],
          diasLaborales3: this.fb.array(diasLaborales3Array),
          horarioTrabajo3 : [ trabajo['horarioTrabajo3'], []],
          horario3desde : [ trabajo['horario3desde']],
          horario3hasta : [ trabajo['horario3hasta']],
          horario3desdecortado : [ trabajo['horario3desdecortado'], []],
          horario3hastacortado : [ trabajo['horario3hastacortado'], []],
          remuneracionOfrecida : [ trabajo['remuneracionOfrecida'], [Validators.required]],
          tipoRemuneracion : [ trabajo['tipoRemuneracion'], []],
          remuneracionMinima : [ trabajo['remuneracionMinima'], []],
          remuneracionMaxima : [ trabajo['remuneracionMaxima'], []],
          genero : [ trabajo['genero'], [Validators.required]],
          edadMinima: [ trabajo['edadMinima'], [Validators.required]],
          edadMaxima: [ trabajo['edadMaxima'], ],
          nivelEstudioMinimo: [ trabajo['nivelEstudioMinimo'], [Validators.required]],
          estadoEstudios: [ trabajo['estadoEstudios'], [Validators.required]],
          areasEstudio: [ trabajo['areasEstudio']],
          experienciasLaboralesPrevias: [ trabajo['experienciasLaboralesPrevias'], [Validators.required]],
          noEspecificarEmpresa : [trabajo['noEspecificarEmpresa']],
          alternativaNombre : [ trabajo['alternativaNombre'], Validators.maxLength(25)]
        }); 

      });

    }

  }

  buildDiasLaborales(){
    const arr = this.diasLaborales.map((dl:any) => {
      return this.fb.control(
        {
          nombre : dl.nombre, 
          value : dl.value, 
          selected : dl.selected
        }
      );
    });
    return this.fb.array(arr);
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
      console.log('REINICIAR HORARIOS 2');
    }else{
      if(this.horario3){
        this.horario3 = false;
        this.botonVisible = true;
        console.log('REINICIAR HORARIOS 3');
      }
    }
  }
  
  validarRemuneracionOfrecida(){
    if (this.trabajoForm.controls['remuneracionOfrecida'].value===1){
      this.indicarRemuneracion = true;
    }else{
      this.indicarRemuneracion = false;
      this.trabajoForm.controls["tipoRemuneracion"].setValue(null);
      this.trabajoForm.controls["remuneracionMinima"].setValue(null);
      this.trabajoForm.controls["remuneracionMaxima"].setValue(null);
    }
  }

  submitTrabajoData(){
    if (this.trabajoForm.valid) {
      if (this.trabajo){
        this.updateData()
      }else{
        this.storeData();
      }
    } else {
      this.validateAllFormFields(this.trabajoForm); //{7}
    }
  }

  crearInformacion(num1 : any ,num2 : any){
    return num1 + num2;
  }

  async updateData(){

    Swal.fire('Actualizando trabajo...')
    Swal.showLoading() 

    this.nuevoTrabajo = {... this.trabajoForm.value};

    this.nuevoTrabajo.id = this.trabajo.id;

    let empresaSeleccionada = await this.todasLasEmpresas.filter((emp) => emp.id == this.nuevoTrabajo.empresaId);

    this.nuevoTrabajo.empresaNombre = empresaSeleccionada[0].nombre;

    this.nuevoTrabajo.descripcionPuesto.replace("\n", "<br>");
    this.nuevoTrabajo.areasEstudio?.replace("\n", "<br>");
    this.nuevoTrabajo.experienciasLaboralesPrevias.replace("\n", "<br>");

    this.trabajoFirestoreService.update(this.nuevoTrabajo).then(res=>{
      Swal.fire({
        title: 'El trabajo fue actualizado de manera exitosa',
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

  async storeData(){

    Swal.fire('Guardando trabajo...')
    Swal.showLoading() 

      this.nuevoTrabajo = {... this.trabajoForm.value};

      console.log(this.nuevoTrabajo)
      
      let empresaSeleccionada = await this.todasLasEmpresas.filter((emp) => emp.id == this.nuevoTrabajo.empresaId);

      this.nuevoTrabajo.empresaNombre = empresaSeleccionada[0].nombre;

      this.nuevoTrabajo.idUsuario = this.authService.userID;
      this.nuevoTrabajo.fechaCreacion = new Date();
      this.nuevoTrabajo.fechaVencimiento = new Date();
      this.nuevoTrabajo.fechaVencimiento.setDate(this.nuevoTrabajo.fechaVencimiento.getDate()+15)
      this.nuevoTrabajo.pagado = false;
  
      this.nuevoTrabajo.descripcionPuesto.replace("\n", "<br>");
      this.nuevoTrabajo.areasEstudio?.replace("\n", "<br>");
      this.nuevoTrabajo.experienciasLaboralesPrevias.replace("\n", "<br>");

      console.log(this.nuevoTrabajo);
  
      this.trabajoFirestoreService.create(this.nuevoTrabajo).then((res)=>{

        Swal.fire({
          title: 'El trabajo fue creado de manera exitosa',
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
      diasLaborales.value[event.target.value - 1].selected = true;
    }else{
      diasLaborales.value[event.target.value - 1].selected = false;
    }
    
  }

  limpiarHorarios(){
    
    if (this.trabajoForm.get('tipoHorario')?.value === 1){
      this.trabajoForm.controls["diasLaborales1"].setValue(this.diasLaborales);
      this.trabajoForm.controls["horarioTrabajo1"].setValue(null);
      this.trabajoForm.controls["horario1desde"].setValue(null);
      this.trabajoForm.controls["horario1hasta"].setValue(null);

      this.trabajoForm.controls["diasLaborales2"].setValue(this.diasLaborales);
      this.trabajoForm.controls["horarioTrabajo2"].setValue(null);
      this.trabajoForm.controls["horario2desde"].setValue(null);
      this.trabajoForm.controls["horario2hasta"].setValue(null);

      this.trabajoForm.controls["diasLaborales3"].setValue(this.diasLaborales);
      this.trabajoForm.controls["horarioTrabajo3"].setValue(null);
      this.trabajoForm.controls["horario3desde"].setValue(null);
      this.trabajoForm.controls["horario3hasta"].setValue(null);
    }
    

    
  }

}
