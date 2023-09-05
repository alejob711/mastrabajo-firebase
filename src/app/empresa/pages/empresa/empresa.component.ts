import { DOCUMENT, NgIf } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MapsAPILoader } from '@agm/core';
import { Empresa } from '../../interfaces/empresa.interface';
import { EmpresaFirestoreService } from '../../services/empresa-firestore.service';
import { Storage, StorageReference, UploadResult, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL, list, listAll } from 'firebase/storage';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { RubroempresaFirestoreService } from 'src/app/rubroempresa/services/rubroempresa-firestore.service';
import { AuthService } from '../../../usuarios/services/auth.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  // categorias : Categoria[];
  todosLosRubros: any;

  public empresaForm : FormGroup = this.fb.group({
    nombre : [ , [Validators.required, Validators.minLength(2)]],
    rubro : [ , [Validators.required]],
    logo : [ , [Validators.required]],
    email : [ , [Validators.required, Validators.email, this.emailValidator]],
    telefono : [ , [Validators.required]],
    paginaWeb : [ ],
    direccion : [ , [Validators.required]],
    ciudad : [ , [Validators.required]],
    provincia : [ , [Validators.required]],
    resumen : [ , [Validators.required]],
  }); 

  isApiLoaded = false;
  options: any = {
    componentRestrictions : {country : "AR"},
    types: ['address'],
  }

  nuevaEmpresa : Empresa;
  file : any;
  imgRef : StorageReference;
  empresa : Empresa;
  estadoPantalla : string = 'Crear';
  btnVolver : string = '< Volver'

  constructor(private fb : FormBuilder,
              private location:Location,
              private mapsAPILoader: MapsAPILoader,
              private empresaFirestore : EmpresaFirestoreService,
              private storage : Storage,
              private router : Router,
              private rubroEmpresaFirestore : RubroempresaFirestoreService,
              public authService : AuthService,
              private activatedRoute: ActivatedRoute,) {}

  ngOnInit(): void {

    //ESTO CARGA LA API PARA PODER HACER LA PRE VISUALIZACION DE DIRECCIONES CON GOOGLE MAPS
    this.mapsAPILoader.load().then(() =>{
      this.isApiLoaded = true
    })

    this.todosLosRubros = this.rubroEmpresaFirestore.getAll();

    const idEmpresa = this.activatedRoute.snapshot.paramMap.get('empresa');

    if (idEmpresa != null){

      this.estadoPantalla = 'Actualizar';

      this.empresaFirestore.get(idEmpresa).subscribe((empresa : any) =>{

        this.empresa = empresa;

        console.log(empresa.logo);

        this.empresaForm = this.fb.group({
          nombre : [ empresa.nombre , [Validators.required, Validators.minLength(2)]],
          rubro : [ empresa.rubro , [Validators.required]],
          email : [ empresa.email , [Validators.required, Validators.email, this.emailValidator]],
          telefono : [ empresa.telefono , [Validators.required]],
          paginaWeb : [ empresa.paginaWeb],
          direccion : [ empresa.direccion , [Validators.required]],
          ciudad : [ empresa.ciudad , [Validators.required]],
          provincia : [ empresa.provincia , [Validators.required]],
          resumen : [ empresa.resumen , [Validators.required]],
        }); 
      });

    }

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

  emailValidator(control:any) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

  submitEmpresaData() {

    if (this.empresaForm.valid) {
      if (this.empresa){
        this.updateData()
      }else{
        this.storeData();
      }
    } else {
      this.validateAllFormFields(this.empresaForm); //{7}
    }

  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  async updateData(){

    Swal.fire('Actualizando empresa...')
    Swal.showLoading() 

    this.nuevaEmpresa = {... this.empresaForm.value};

    this.nuevaEmpresa.id = this.empresa.id;

    this.nuevaEmpresa.resumen.replace("\n", "<br>");

    if (this.file){
      await this.subirArchivo().then(async (res: UploadResult)=>{
        const url = await getDownloadURL(this.imgRef)
        this.nuevaEmpresa.imgLogo = url;
      })
    }else{
      this.nuevaEmpresa.imgLogo = this.empresa.imgLogo
    }

    this.empresaFirestore.update(this.nuevaEmpresa).then(res=>{
      Swal.fire({
        title: 'La empresa fue actualizada de manera exitosa',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#5a435c',
        timer: 2000,
        showConfirmButton: false
      }).then(()=>{
        this.router.navigate([`usuarios/${this.authService.userID}/empresas`]);
      });
    })

  }

  storeData(){

    Swal.fire('Guardando empresa...')
    Swal.showLoading() 

    this.subirArchivo().then(async (res: UploadResult)=>{

      const url = await getDownloadURL(this.imgRef)

      this.nuevaEmpresa = {... this.empresaForm.value};

      this.nuevaEmpresa.imgLogo = url;

      // REEMPLAZAR ESTE ID FIJO POR EL ID DE UN USUARIO REAL LOGUEADO EN LA APP
      this.nuevaEmpresa.idUsuario= this.authService.userID;
  
      this.nuevaEmpresa.resumen.replace("\n", "<br>");
  
      this.empresaFirestore.create(this.nuevaEmpresa).then((res)=>{

        Swal.fire({
          title: 'La empresa fue creada de manera exitosa',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#5a435c',
          timer: 2000,
          showConfirmButton: false
        }).then(()=>{
          this.router.navigate([`usuarios/${this.authService.userID}/empresas`]);
        });

      })

    })


    
  }

  // resetForm() {
  //   this.empresaForm.reset();
  // }

  handleAddressChange(address: any) {

    this.empresaForm.controls["direccion"].setValue(address.name);
    this.empresaForm.controls["ciudad"].setValue(address.vicinity);

    let provincia = address.address_components.filter( (ac : any) => ac.types[0] === "administrative_area_level_1" )

    this.empresaForm.controls["provincia"].setValue(provincia[0].short_name);
  }

  crearArchivo(event : any){
    this.file = event.target.files[0];
    this.imgRef = ref(this.storage, `images/${this.file.name}`)
  }

  subirArchivo(){
    return uploadBytes(this.imgRef, this.file).then(res=>{
       return res;
    })
  }

  goBack() {
    this.location.back();
  }
  

}
