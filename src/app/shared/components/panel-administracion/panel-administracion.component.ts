import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-panel-administracion',
  templateUrl: './panel-administracion.component.html',
  styleUrls: ['./panel-administracion.component.css']
})
export class PanelAdministracionComponent implements OnInit {
  pendientes: any;
  aprobado: any;
  tareasCreadas: any;
  sinAprobar: any;

  constructor(
    private notification: NzNotificationService,
    private gestionServiciosContratados: GestionServiciosContratadosService,
    private _location: Location,
    ) { }

  ngOnInit(): void {
    this.getServiciosContratadosPendientesDeAprobar();
    this.getServiciosContratadosAprobado();
    this.getServiciosContratadosSinAprobar();
    this.getTareas();
  }

  // getServiciosContratadosPendientes() {
  //   this.gestionServiciosContratados.getServiciosContratadosAll().subscribe(respuesta => {
  //     this.pendientes = respuesta.filter(respuesta => respuesta.idEstado == 2).length

  //     console.log(this.pendientes);
  //   })
  // }


  // getServiciosContratadosAprobados() {
  //   this.gestionServiciosContratados.getServiciosContratadosAll().subscribe(respuesta => {
  //     this.aprobado = respuesta.filter(respuesta => respuesta.idEstado == 3).length

  //     console.log(this.aprobado);
  //   })
  // }

  getTareas(){
    this.gestionServiciosContratados.getTareasAll().subscribe(respuesta=>{
      this.tareasCreadas = respuesta.filter(respuesta=>respuesta.idEstado==1).length
      console.log(this.tareasCreadas);
    })

  }

  //
  getServiciosContratadosSinAprobar() {
    this.gestionServiciosContratados.getServiciosContratadosSinAprobar().subscribe(respuesta => {
      this.sinAprobar = respuesta.data.length;
      console.log(this.sinAprobar);

    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al obtener los datos', '');
    })
  }

  getServiciosContratadosPendientesDeAprobar() {
    this.gestionServiciosContratados.getServiciosContratadosPendientesDeAprobar().subscribe(respuesta => {
      this.pendientes = respuesta.data.length;
      console.log(this.pendientes)

    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al obtener los datos', '');
    })
  }

  getServiciosContratadosAprobado() {
    this.gestionServiciosContratados.getServiciosContratadosAprobados().subscribe(respuesta => {
      this.aprobado = respuesta.data.length;

      console.log(this.aprobado)
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al obtener los datos', '');
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

  backClicked() {
    this._location.back();
  }

}
