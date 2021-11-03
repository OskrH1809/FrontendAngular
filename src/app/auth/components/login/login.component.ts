import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionUsuariosService } from 'src/app/auth/services/gestion-usuarios.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  helper = new JwtHelperService();                                     //Biblioteca a la cual se le proporcionara un jwt mas adelante para decodificarlo
  validateForm!: FormGroup;

  submitForm(): void {                                                //funcion para enviar el formulario
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.aut.login_check(this.validateForm.value).subscribe(data => { //funcion que enviara por medio el metodo post los parametros del formulario para iniciar session
      localStorage.setItem('token', data.token);                      // se almacena el token en el localstorage
      if (data.data.role == "ROLE_ADMIN") {

        window.location.reload();
        this.router.navigate(['/panel'])                                     // se actualiza la pagina para que se pueda visualizar el token

      } else {

        this.router.navigate([''])                                      // se actualiza la pagina para que se pueda visualizar el token
          .then(() => {
            window.location.reload();
          });
      }

    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al iniciar sesión', err.error.message);   // si hay algun error mostrara una notificacion y el detalle del error
    })

  }

  constructor(
    private router: Router,
    private aut: GestionUsuariosService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
  ) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],

    });
  }


  // funcion que se utiliza para crear las notificaciones de las acciones que se le haran al usuario
  createNotification(
    type1: string,        //Muestra el tipo de notificación(Success,Info,Waring, error)
    type2: string,        //Muestra un mensaje elegido por el usuario
    type3: string         //Muestra un mensaje elegido por el usuario
  ): void {
    this.notification.create(
      type1,
      type2,
      type3
    );

  }



}
