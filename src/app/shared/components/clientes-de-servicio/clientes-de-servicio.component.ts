import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';

@Component({
  selector: 'app-clientes-de-servicio',
  templateUrl: './clientes-de-servicio.component.html',
  styleUrls: ['./clientes-de-servicio.component.css']
})
export class ClientesDeServicioComponent implements OnInit {
  listadoClientes;
  idservicio = this.route.snapshot.paramMap.get("idservicio");
  nombreServicio = this.route.snapshot.paramMap.get("nombreservicio");
  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private gestionServiciosContratados:GestionServiciosContratadosService) { }

  ngOnInit(): void {
  this.getClientesDeServicios();
    console.log(this.idservicio);
  }

  getClientesDeServicios(){
    this.gestionServiciosContratados.getClientesDeServicios(this.idservicio).subscribe(respuesta=>{
      if (respuesta){
        console.log(respuesta);
        this.listadoClientes = respuesta;
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al activar servicio: ', 'Fallo en el proceso de desactivar el servicio');
    })
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

  backClicked() {
    this._location.back();
  }
}
