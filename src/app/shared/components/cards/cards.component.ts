import { Component, OnInit } from '@angular/core';
import { GestionUsuariosService } from 'src/app/auth/services/gestion-usuarios.service';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  administrarService: any;
  mesActual = moment().format('M').toString();
  bloqueador = this.serviciosContratados.bloqueador;
  constructor(
    private serviciosContratados: GestionServiciosContratadosService,
    private notification: NzNotificationService,) {}

  ngOnInit(): void {
    console.log(this.mesActual)
  }

  listaMeses = [
    {
      "id": 1,
      "Mes": "Enero",

    },
    {
      "id": 2,
      "Mes": "Febrero",
    },
    {
      "id": 3,
      "Mes": "Marzo",
    },
    {
      "id": 4,
      "Mes": "Abril",
    },
    {
      "id": 5,
      "Mes": "Mayo"
    },
    {
      "id": 6,
      "Mes": "Junio"
    },
    {
      "id": 7,
      "Mes": "Julio"
    },
    {
      "id": 8,
      "Mes": "Agosto"
    },
    {
      "id": 9,
      "Mes": "Septiembre"
    },
    {
      "id": 10,
      "Mes": "Octubre"
    },
    {
      "id": 11,
      "Mes": "Noviembre"
    },
    {
      "id": 12,
      "Mes": "Diciembre"
    }

  ]

  alerta(){
    this.createNotification('error', 'No permitido: ', 'Los servicios para este mes aun no estan habilitados');
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

}
