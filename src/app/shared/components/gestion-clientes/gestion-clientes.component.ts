import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { GestionClientesService } from 'src/app/shared/services/gestion-clientes.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionUsuariosService } from 'src/app/auth/services/gestion-usuarios.service';
import * as moment from 'moment';

interface ItemData {
  id: string;
  email: string;
}
@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent implements OnInit {
  form: any;
  mesActual = moment().format('M').toString();
  urlTree: any;
  username: any;

  constructor(
    private notification: NzNotificationService,
    private userService: GestionClientesService,
    private gestionUsuario: GestionUsuariosService,
    private _location: Location,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) {
  }

  i = 1;
  editId: string | null = null;
  listOfData: ItemData[] = [];


  ngOnInit(): void {
    this.get_users();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  // funcion que se utiliza para enviar la informacion del correo para registrar el nuevo usuario
  send(): any {
    console.log(this.form.value.email);
    this.enviarCorreoNuevoUsuario(this.form.value.email, 3)
  }

  //Funcion que permite regresar a la pagina anterior
  backClicked() {
    this._location.back();
  }

  //Funcion que hace un llamado a la api para obtener y visualizar los datos
  get_users() {
    this.userService.get_usersAll().subscribe(data => {
      this.listOfData = data;
      console.log(data);
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al obtener los clientes: ', err);
    });
  }



  // notificaciones
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


  // funcion que enviara un correo con la contraseña al usuario, cuando se cree un nuevo usuario solo ingresando el correo
  enviarCorreoNuevoUsuario(email, perfil) {
    let data;

    data = { email: email, perfil: perfil }
    // if (perfil) {
    //   data = { email: email, perfil: perfil }
    // } else {
    //   data = { email: email, perfil: '' }
    // }

    this.userService.envioCorreoNuevoUsuario(data).subscribe(respuesta => {
      if (respuesta) {
        this.createNotification('success', 'Crear Usuario', 'Usuario creado Con éxito');
        this.get_users();
      }
    }, err => {
      this.createNotification('error', 'Crear usuario sin éxito: ', err);
    })
  }



  // funcion que cambiara el estado del usuario de activado a desactivado
  desactivarUsuario(idUser) {
    const data = { user: idUser }
    this.gestionUsuario.desactivarUsuario(data).subscribe(respuesta => {
      if (respuesta) {
        this.createNotification('success', 'Desactivar usuario ', 'Usuario desactivado con éxito');
        this.get_users();
      }
    }, err => {
      this.createNotification('error', 'Desactivar usuario fallo ', 'Error al desactivar usuario');
    })
  }

  // funcion que cambiara el estado del usuario de desactivado a activado
  activarUsuario(idUser) {

    const data = { user: idUser }
    this.gestionUsuario.activarUsuario(data).subscribe(respuesta => {
      if (respuesta) {
        this.createNotification('success', 'Activar usuario ', 'Usuario activado con éxito');
        this.get_users();
      }
    }, err => {
      this.createNotification('error', 'Activar usuario fallo ', 'Error al desactivar usuario');
    })
  }






}
