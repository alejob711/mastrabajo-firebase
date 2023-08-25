import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/usuarios/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  // buscoTrabajo: boolean = false;
  // contratoPersonal: boolean = false;
  // userLogged: boolean = false;
  inciarSessionEmail: boolean = false;
  crearCuentaNueva: boolean = false;
  captchaResolved : boolean = false;
  errorCredenciales : boolean = false;
  errorUsuarioExistente : boolean = false;
  usuarioForm = {
    email: '',
    password: ''
  }
  // usuario : User = {
  //   displayName: '',
  //   email: '',
  //   emailVerified : false,
  //   photoURL : '',
  //   uid : ''
  // };
  tipoUsuario : string = 'BT';

  @ViewChild('closeModal') closeModal?: ElementRef<HTMLElement>;

  crearCuentaForm : FormGroup = this.fb.group({
    tipoUsuario : [ , [Validators.required]],
    email : [ , [Validators.required, Validators.email, this.emailValidator]],
    password : [ , [Validators.required, Validators.minLength(8)]],
    recaptcha : [ , [Validators.required]],
  });

  iniciarSesionForm : FormGroup = this.fb.group({
    email : [ , [Validators.required, Validators.email, this.emailValidator]],
    password : [ , [Validators.required, Validators.minLength(8)]],
  });

  constructor( //private renderer: Renderer2,
              @Inject(DOCUMENT) private _document: any,
              // private usuarioService: UsuarioService,
              // private router: Router,
              private fb : FormBuilder,
              public authService : AuthService,
              private router : Router) { }

  ngOnInit(): void {

    this.crearCuentaForm.get('tipoUsuario')?.valueChanges.subscribe(res=>{
      this.tipoUsuario = res;
    });

  }

  ngAfterViewInit() {
    // var s = this.renderer.createElement("script");
    // s.type = "text/javascript";
    // s.src = "assets/plugins/nice-select/js/jquery.nice-select.min.js";
    // this.renderer.appendChild(this._document.body, s);

    // var s2 = this.renderer.createElement("script");
    // s2.type = "text/javascript";
    // s2.src = "assets/js/custom.js";

    // this.renderer.appendChild(this._document.body, s2);

    // Agrego el listener que detecta el click en el backdrop del modal e inicio el 
    // reinicio de las variables del modal para que se vuelva a ver como estaba antes de abrir
    this._document.querySelector('.modal').addEventListener('click', (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        this.reiniciarVariables();
      }
    });

  }

  emailValidator(control:any) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }

  reiniciarVariables() {

    // this.buscoTrabajo = false;
    // this.contratoPersonal = false;
    // this.userLogged = false;
    this.inciarSessionEmail = false;
    this.crearCuentaNueva = false;

    this.crearCuentaForm.reset();
    this.iniciarSesionForm.reset();

    //Reinicio la clase active sobre los elementos que indican si busco trabajo o contrato personal
    var elems = this._document.querySelectorAll('.nav-item');
    elems.forEach((el: any) => {
      el.classList.remove("active");
    });

  }

  checkCaptcha(captchaResponse : string) {
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
  } 

  // setBuscoTrabajo() {
  //   this.buscoTrabajo = true;
  //   this.contratoPersonal = false;
  // }

  // setContratoPersonal() {
  //   this.buscoTrabajo = false;
  //   this.contratoPersonal = true;
  // }

  iniciarSesionEmailOption() {
    this.inciarSessionEmail = true;
    this.crearCuentaNueva = false;
    this.errorCredenciales = false;
    this.errorUsuarioExistente = false;
  }

  crearNuevaCuentaOption(){
    this.inciarSessionEmail = false;
    this.crearCuentaNueva = true;
    this.errorCredenciales = false;
    this.errorUsuarioExistente = false;
  }

  cerrarModal(){
    this._document.querySelector('.modal').style.display = 'none';
    this._document.querySelector('.modal-open').classList.remove('modal-open');
  }

  iniciarSesionEmail() {
    this.usuarioForm = {...this.iniciarSesionForm.value};
    this.authService.login(this.iniciarSesionForm.value).then((res)=>{
      this.closeModal?.nativeElement.click();
    }).catch(err=>console.log(err))
  }

  crearNuevaCuenta(){
    this.authService.register({... this.crearCuentaForm.value}).then((res)=>{
      this.closeModal?.nativeElement.click();
    }).catch(err=>console.log(err));
  }

  recuperarContrasenia(){
    this.closeModal?.nativeElement.click();
    this.router.navigate(['usuarios/recuperarcontrasenia']);

  }

  miCuenta(){
    this.router.navigate([`usuarios/${this.authService.userID}`]);
  }

  loginWithGoogle() {
    // this.usuarioService.loginWithGoogle().then((res: UserCredential) => {
    //   this.userLogged = true;
    //   this.closeModal?.nativeElement.click();
    //   this.router.navigate([`/usuarios/${res.user.uid}`])
    // })
    // .catch(err => {
    //   console.log(err);
    // })
    //this.authService.GoogleAuth()
  }

  logout() {
    // // this.usuarioService.logout().then(res => {
    // //   this.userLogged = false;
    // // })
    // // .catch(err => {
    // //   console.log(err);
    // // })

    // this.authService.SignOut();
    // this.reiniciarVariables();
  }

}
