import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionUsuariosService } from 'src/app/auth/services/gestion-usuarios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  role = this.servicelogin.role()       //contiene el role del usuario que se encuentra logueado, si no esta logueado estara vacio
  perfilUsuario: any;                   //varible que permitira tener el perfil del usuario  temporalmente
  validateForm: FormGroup;              //variable que contendra toda la informacion de los formularios

  constructor(private router: Router, private notification: NzNotificationService, private servicelogin: GestionUsuariosService, private fb: FormBuilder) {
    // En esta validacion se verifica si tiene asignado  un rol la persona que quiere registrarse y si tiene rol de administrador le permitira elegir el rol de la persona que registrara
    if (this.role == "ROLE_ADMIN") {
      this.validateForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
        confirm: ['', [this.confirmValidator]],
        tipoUsuario: ['', [Validators.required]],
      });
    } else {
      this.validateForm = this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required]],
        confirm: ['', [this.confirmValidator]],
      });
    }
  }

  ngOnInit(): void {

  }


  // funcion que se utilizadad para enviar los datos del formulario
  submitForm(value: { email: string; password: string; confirm: string; tipoUsuario: string }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    // validacion de si la existe un tipo de usuario enviado desde los formularios, si no existe por defecto sera vacio, y en la base de datos esta validado que si este campo se recibe vacio, por defecto le asignara el rol de user
    if (value.tipoUsuario=='ROLE_ADMIN') {
      this.perfilUsuario = "1"
    }
    if (value.tipoUsuario=='ROLE_CLIENT') {
      this.perfilUsuario = "3"
    }

    if (!value.tipoUsuario) {
      this.perfilUsuario = "3"
    }


    const datos = { email: value.email, password: value.password, perfil: this.perfilUsuario }
    console.log(datos);
    //esta funcion se utiliza para enviar los datos a la base de datos y registrar el nuevo usuario
    this.servicelogin.sendPostRegistro(datos).subscribe(
      res => {
        console.log(res);

        if (res.email == value.email) {
          this.createNotification('success', 'Usuario: ' + `${value.email}`, 'Registrado con éxito');
          this.router.navigate([''])
        }
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al registrarse: ', err.error.message);
      });

  }


  // Información que se utiliza para poder borrar toda la informacion que contiene el formulario.
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  // funcion para validar la contraseña
  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }
  // funcion para validar la contraseña
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };



 // funcion que se utiliza para crear las notificaciones de las acciones que se le haran al usuario
  createNotification(
    type1: string,        //Muestra el tipo de notificación(Success, Info, Waring, error)
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


