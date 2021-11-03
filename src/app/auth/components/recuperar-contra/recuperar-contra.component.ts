import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, Observer } from 'rxjs';
import { GestionUsuariosService } from '../../services/gestion-usuarios.service';

@Component({
  selector: 'app-recuperar-contra',
  templateUrl: './recuperar-contra.component.html',
  styleUrls: ['./recuperar-contra.component.css']
})
export class RecuperarContraComponent implements OnInit {



  ngOnInit(): void {
  }

  validateForm: FormGroup;                                 //variable que tendra los valores del form

  // funcion que se utiliza para mostrar los mensajes de errores debajo de los inputs
  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项'
    },
    en: {
      required: 'Correo requerido'
    },
    default: {
      email: 'Correo no valido'
    }
  };

  // funcion que se encargara del envio de datos del formulario
  submitForm(value: { userName: string; email: string; password: string; confirm: string; comment: string }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value);
    this.sendEmail(value.email)
  }

  constructor(
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private gestionUsuarios: GestionUsuariosService) {

    const { required, email } = MyValidators;
    // declaración del formulario en la construccion del componente
    this.validateForm = this.fb.group({
      email: ['', [required, email]],

    });
  }

  // funcion que hace un llamado a la api y envia los valores del correo al cual se desea reestablecer la contraseña
  sendEmail(correo) {
    const data = { email: correo }
    this.gestionUsuarios.recuperarcontra(data).subscribe(respuesta => {
      if (respuesta) {
        console.log("respuesta")

        this.createNotification('success', 'Restauración de contraseña enviada.', 'Por favor revise su correo electrónico.');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    }, err => {
      this.createNotification('error', 'Error al restaurar contraseña.', 'El correo no se encuentra registrado.');
    })
  }

  // funcion que se utiliza para crear las notificaciones
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

// validadores personalizados de la libreria de ng-zorro
export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<string, NzSafeAny>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { 'zh-cn': `最小长度为 ${minLength}`, en: `MinLength is ${minLength}` } };
    };
  }



}


