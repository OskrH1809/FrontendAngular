import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { decode } from 'querystring';
import { Observable, Observer } from 'rxjs';
import { GestionClientesService } from 'src/app/shared/services/gestion-clientes.service';
import { StringLiteralLike } from 'typescript';
import { GestionUsuariosService } from '../../services/gestion-usuarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  helper = new JwtHelperService();                                            // Biblioteca a la cual se le proporcionara un jwt mas adelante para decodificarlo
  decodeToken = this.helper.decodeToken(localStorage.getItem('token'));       // Se utiliza para decodificar la información que contiene el jwt
  user = this.decodeToken.username;                                           // Se utiliza para almacenar el nombre del usuario logueado que se encuentra en el jwt
  isPasswordVisible = true;                                                   // Se utiliza para controlar el tipo de input del input password
  disableInput = true;                                                        // Se utiliza para deshabilitar el input que contiene el formControlName = email
  datosUsuario;                                                               // Se utiliza para almacenar teporalmente los datos del usuario
  cuentaBanco;                                                                // Almacena la cuenta de banco del usuario
  telefono;                                                                   // Almacena el numero de telefono del usuario
  direccion;                                                                  // Almacena la direccion del usuario
  validateForm: FormGroup;                                                    // variable para almacenar los datos del form de cambio de contraseña


  ngOnInit(): void {
    this.get_data_this_user();                                                // hace un llamado a la api para obtener y mostrar los datos del cliente cuando cargue la pagina

  }
  constructor(private notification: NzNotificationService,
    private gestionClientes: GestionClientesService,
    private GestionUsuarios: GestionUsuariosService,
    private fb: FormBuilder
  ) {


    //Declaracion del formulario para el cambio de contraseña
    this.validateForm = this.fb.group({
      email: [{ disabled: this.disableInput, value: "" }],
      password: ['', Validators.required],
      passwordcurrent: ['', Validators.required],
      confirm: ['', [this.confirmValidator]]
    });

    console.log(this.datosUsuario)

    //Declaracion del formulario para la actualizacion de datos
    this.validateForm2 = this.fb.group({
      cuentaBanco: [],
      telefono: [],
      direccion: [],

    });


  }
  //funcion que se encarga de llenar y enviar los datos a la funcion de actualizar contraseña
  submitForm(value2: { passwordcurrent: string; password: string; confirm: string }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value2.passwordcurrent, value2.password);
    // console.log(value2.password)
    this.actualizarContraseña(value2.passwordcurrent, value2.password)

  }

  // funcion que se encarga del proceso de cambiar la contraseña despues de que le asignaron los parametros especificados
  actualizarContraseña(passwordCurrent, newPassword) {
    const data = {
      passwordCurrent: passwordCurrent,
      password: newPassword
    }
    this.GestionUsuarios.cambiarContraseña(data).subscribe(respuesta => {
      if (respuesta) {
        console.log("respuesta")
        this.createNotification('info', 'Actualizar Contraseña', 'La contraseña ha sido actualizada con éxito');
        this.get_data_this_user();

      }
    }, err => {
      this.createNotification('error', 'Cambiar contraseña fallo', 'Revise su contraseña');
    })

  }

  // funcion que se utiliza para verificar si las contraseñas
  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  // funcion que se utiliza para verificar si las contraseñas
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };




  // segundo form que contiene la informacion de cuenta bancaria, telefono y dirección

  validateForm2: FormGroup;
  submitForm2(value: { cuentaBanco: string; email: string; password: string; confirm: string; comment: StringLiteralLike; telefono:string; direccion:string }): void {
    for (const key in this.validateForm2.controls) {
      this.validateForm2.controls[key].markAsDirty();
      this.validateForm2.controls[key].updateValueAndValidity();
    }
    let cuentaBanco;
    let telefono;
    let direccion;

    // cuenta bancaria
    if (value.cuentaBanco) {
      cuentaBanco = value.cuentaBanco;
    } else {
      cuentaBanco = ''
    }

    // telefono
    if (value.telefono) {
      telefono = value.telefono;
    } else {
      telefono = ''
    }
      // direccion
      if (value.direccion) {
        direccion = value.direccion;
      } else {
        direccion = ''
      }

    const data = { cuentaBanco: cuentaBanco, telefono:telefono, direccion:direccion }

    console.log(data);
    if (this.datosUsuario) {                                              //en esta seccion verifica si en cliente ya contiene información, si contiene informacion solo la actualizara y si no creara una nueva entidad de dataUser en la base de datos para almacenarla
      this.actualizarDatos(data);
      console.log('actualizar')
    } else {
      this.nuevoRegistroDatosUsuarios(data)
      console.log('data')
      console.log(data);
    }


  }
  // funcion que se utiliza para verificar si las contraseñas
  validateConfirmPassword2(): void {
    setTimeout(() => this.validateForm2.controls.confirm.updateValueAndValidity());
  }

  // funcion que se utiliza para verificar si las contraseñas
  confirmValidator2 = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm2.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };







  // función que se utiliza para hacer un llamado a la api, obtener y mostrar los datos del usuario logueado
  get_data_this_user() {

    this.gestionClientes.get_data_this_user().subscribe(respuesta => {
      this.datosUsuario = respuesta;
      if (this, this.datosUsuario) {
        console.log(this.datosUsuario);
        this.cuentaBanco = this.datosUsuario['cuentaBanco'];
        this.telefono = this.datosUsuario['telefono'];
        this.direccion = this.datosUsuario['direccion'];
        this.direccion = this.datosUsuario['direccion'];
        console.log(this.user);
      }
    })





  }
  // función que se utiliza para hacer un llamado a la api, actualizar y mostrar los datos del usuario logueado
  actualizarDatos(data) {
    this.gestionClientes.actualizarDatosUsuario(data).subscribe(respuesta => {

      if (respuesta) {
        console.log("respuesta")
        this.createNotification('info', 'Perfil', 'Datos actualizados con éxito ');
        this.get_data_this_user();
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al iniciar sesión: ', err.error.message);
    });
  }

  // función que se utiliza para hacer un llamado a la api, registrar y mostrar los datos del usuario logueado
  nuevoRegistroDatosUsuarios(data) {
    this.gestionClientes.nuevoRegistroDatosUsuarios(data).subscribe(respuesta => {
      if (respuesta) {
        console.log("respuesta")
        this.createNotification('Success', 'Perfil', 'Datos Ingresados con éxito ');
        this.get_data_this_user();
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al iniciar sesión: ', err.error.message);
    });
  }




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








