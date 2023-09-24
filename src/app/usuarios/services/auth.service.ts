import { Injectable } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updatePassword, User } from '@angular/fire/auth';
import { UsuarioFirestoreService } from './usuario-firestore.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: Usuario; // Save logged in user data

  userLogged : User;

  constructor(private auth : Auth,
              private router: Router,
              private usuarioFirestoreService : UsuarioFirestoreService){}

  

  get userID(): string{
    const user = JSON.parse(localStorage.getItem('user')!);
    return user.uid;
  }    

  // Devuelve true cuando el usuario esta logueado y el email verificado
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  register(newUser : any){
    return createUserWithEmailAndPassword(this.auth, newUser.email, newUser.password).then((res : UserCredential)=>{
      this.sendVerificationMail(res.user);

      console.log(newUser);

      let nuevoUsuario : Usuario = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
        emailVerified: res.user.emailVerified,
        tipoUsuario : newUser.tipoUsuario
     };

      this.usuarioFirestoreService.create(nuevoUsuario).then(()=>{
        this.setUserData(nuevoUsuario);
        this.router.navigate([`usuarios/verificacionemail`]);
      })
      return res.user;
    })
    .catch((error) => {
      Swal.fire({
        title: 'El email ingresado ya tiene una cuenta asociada.',
        icon: 'info',
        timer: 4000,
        showConfirmButton: false
      })
      console.log(error);
      return false;
    });
  }

  login({email, password} : any){
    return signInWithEmailAndPassword(this.auth, email, password).then(res=>{
      if (res.user?.emailVerified){

        this.userLogged = res.user;

        let sub = this.usuarioFirestoreService.get(res.user.uid).subscribe(resBD =>{

          sub.unsubscribe();

          resBD[0].displayName = res.user.displayName;
          resBD[0].emailVerified = res.user.emailVerified;
          resBD[0]. photoURL = res.user. photoURL;
          resBD[0].displayName = res.user.displayName;

          this.setUserData(resBD[0]);
          this.usuarioFirestoreService.update(resBD[0]);
          this.router.navigate([`usuarios/${res.user?.uid}`]);
        })
      }else{
        Swal.fire({
          title: 'Por favor, verifica tu cuenta de email para poder acceder al sitio.',
          icon: 'info',
          timer: 4000,
          showConfirmButton: false
        }).then(()=>{
          this.router.navigate(['']);
        });
      }
      return true;
    })
    .catch((error) => {
      Swal.fire({
        title: 'El usuario/contraseña ingresados son incorrectos.',
        icon: 'info',
        timer: 4000,
        showConfirmButton: false
      })
      console.log(error.message);
      return false;
    })
  }

  sendVerificationMail(user : any){
    return sendEmailVerification(user);
  }

  logOut() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      
      this.router.navigate(['/']);
    });
  }

  // Reinicio de contraseña
  ForgotPassword(passwordResetEmail: string) {
    return sendPasswordResetEmail(this.auth,passwordResetEmail)
      .then((res) => {
        //window.alert('Password reset email sent, check your inbox.');
        console.log(res);
        return true;
      })
      .catch((error) => {
        return false;
        console.log(error);
      });
  }

  setUserData(user: Usuario){
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(this.userData));
    JSON.parse(localStorage.getItem('user')!);
  }

  updatePassword(newPassword:string){
    console.log(this.userLogged);
    return updatePassword(this.userLogged,newPassword).then(()=>{
      return true
    }).catch((error)=>{
      console.log(error);
      return false;
    });
  }
}
