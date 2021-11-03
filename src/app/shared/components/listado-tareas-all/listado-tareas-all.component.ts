import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';

@Component({
  selector: 'app-listado-tareas-all',
  templateUrl: './listado-tareas-all.component.html',
  styleUrls: ['./listado-tareas-all.component.css']
})
export class ListadoTareasAllComponent implements OnInit {
  listado: any;
  listOfData:any ;
  idEstado = this.route.snapshot.paramMap.get("idEstado");
  radioValue = this.idEstado;
  isVisible = false;
  servicioContratadoId: any;
  tarea: any;
  dataSelect: { id: any; estado: string; };
  editId: string;
  ContadorMensajesAdmin: any;
  ContadorMensajesUser: any;
  comentariosUsuarios;

  constructor( private gestionServiciosContratados: GestionServiciosContratadosService,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private router:Router) { }

  ngOnInit(): void {
    this.getTareas();
    this.filtroInicial();
    this.getComentariosAll();
  }


  getTareas(){
    this.gestionServiciosContratados.getTareasAll().subscribe(respuesta=>{
      this.listOfData = respuesta.filter(respuesta=>respuesta.idEstado==this.radioValue);
      this.listado = respuesta;
      console.log(respuesta);

    })

  }

  filtroInicial(){
  }

  filtro(filtro){
    // this.gestionServiciosContratados.getTareasAll().subscribe(respuesta=>{
    //   console.log(filtro)
    //   console.log(respuesta)
    //   console.log(this.radioValue)

    // })
    this.radioValue=filtro;
    this.listOfData = this.listado.filter(respuesta=>respuesta.idEstado==this.radioValue)
  }

   // modal



   showModal(idTarea): void {
    this.isVisible = true;
    this.tarea = idTarea;

  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.actualizarEstadoTarea(this.dataSelect);

    this.optionList = [
      { label: 'Creado', value: '1' },
      { label: 'En revisión', value: '2' },
      { label: 'Finalizado', value: '3' }
    ];
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  // select
   // select estado
   optionList = [
    { label: 'Creado', value: '1' },
    { label: 'En revisión', value: '2' },
    { label: 'Finalizado', value: '3' }
  ];
  selectedValue = 'Seleccionar estado'
  // tslint:disable-next-line:no-any

  log(value: { value: string; }): void {


    this.dataSelect = { id: this.tarea, estado: value.value }
    console.log( this.dataSelect);

  }

  actualizarEstadoTarea(data) {
    this.gestionServiciosContratados.actualizarEstadoTarea(data).subscribe(respuesta => {
      if (respuesta) {
        this.getTareas();
        this.createNotification('info', 'Tarea', 'Estado actualizado con éxito');
      }

    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al actualizar estado: ', 'Actualizar estado sin éxito');
    })
  }

   // notificaciones
   createNotification(type1: string, type2: string, type3: string,): void {
    this.notification.create(
      type1,
      type2,
      type3,
      { nzDuration: 12000 }
    );

  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(id, tiempo): void {

    console.log(id)
    console.log(tiempo)
    const data = {
      id: id,
      horasTarea: tiempo

    }

    this.gestionServiciosContratados.ingresarHorasTarea(data).subscribe(respuesta=>{
      if (respuesta) {
        this.getTareas();
        this.createNotification('info', 'Tarea', 'Horas actualizadas con éxito');
      }

    }, err => {
      console.log(err);
      this.getTareas();
      this.createNotification('error', 'Error al actualizar estado: ', 'Verificar el tiempo ingresado');
    })
  }

  verComentario(idTarea,idUsuario){
    this.changeViewedUser(idTarea);
    this.router.navigate([`conversacion/${idTarea}/${idUsuario}`])

  }

  getComentariosAll(){
    this.gestionServiciosContratados.getComentariosAll().subscribe(respuesta =>{
      this.comentariosUsuarios = respuesta.filter(respuesta => respuesta.viewed == 2);
    })
  }


  changeViewedUser(idTarea){
    const data= { tarea:idTarea}
    console.log(idTarea);
    this.gestionServiciosContratados.changeViewedUser(data).subscribe(respuesta =>{
      console.log(respuesta)
    })
  }
}
