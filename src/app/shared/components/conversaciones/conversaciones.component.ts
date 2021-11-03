import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-conversaciones',
  templateUrl: './conversaciones.component.html',
  styleUrls: ['./conversaciones.component.css']
})
export class ConversacionesComponent implements OnInit {

  idTarea = this.route.snapshot.paramMap.get("idTarea");
  idUsuario = this.route.snapshot.paramMap.get("idUsuario");
  tarea: any;
  documentos;
  comentarios: any;
  helper = new JwtHelperService();                                            // Biblioteca a la cual se le proporcionara un jwt mas adelante para decodificarlo
  decodeToken = this.helper.decodeToken(localStorage.getItem('token'));       // Se utiliza para decodificar la información que contiene el jwt
  usuario = this.decodeToken.username;
  value;
  servicio: any;
  user: any;

  constructor(
    private gestionServiciosContratados: GestionServiciosContratadosService,
    private route: ActivatedRoute,
    private _location: Location,
  ){ }

  ngOnInit(): void {
    this.getTareas();
    this.getDocuments();
    this.getComentariosTareas();
  }



  getTareas() {
    this.gestionServiciosContratados.getTareasAll().subscribe(respuesta => {
      this.tarea = respuesta.filter(respuesta => respuesta.id == this.idTarea);
      console.log(this.tarea);
      this.servicio = this.tarea[this.tarea.length-1]['servicio']
      this.user = this.tarea[this.tarea.length-1]['user']

    })
  }


  getDocuments(){
    this.gestionServiciosContratados.getOneDocumentSpecific(this.idUsuario,2,this.idTarea).subscribe(respuesta=>{
      this.documentos = respuesta;
      console.log(respuesta);
    })
  }

  getComentariosTareas(){
    this.gestionServiciosContratados.getComentariosTareas(this.idTarea).subscribe(respuesta=>{
      console.log(respuesta);
      this.comentarios = respuesta;

    })
  }

  postComentarios(){


    const data = {'tarea':this.idTarea,'text':this.value }
    this.gestionServiciosContratados.postComentariosTarea(data).subscribe(respuesta=>{
      console.log(respuesta);
    })
    this.value=''
    this.getComentariosTareas();
  }

  EnterSubmit(evento) {

    if (evento.keyCode === 13) {
      this.postComentarios();
      this.value=''
    }

  }


  backClicked() {
    this._location.back();
  }

}
