import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

const baseUrlF = environment.baseURLF;


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  helper = new JwtHelperService();
  decodeToken = this.helper.decodeToken(localStorage.getItem('token'))
  role = this.decodeToken.roles[0];
  user = this.decodeToken.username;
  fechaActual = moment();
  fecha1 = moment("2021-07-01 04:05:34");
  fechaz = this.fechaActual.diff(this.fecha1, 'month')

  id = this.route.snapshot.paramMap.get("id");
  diaActual = moment().format('D')
  anioActual = moment().format('Y')
  mesActual = moment().format('M').toString();
  diasRestantesPagoFinMes = (parseInt(moment().endOf('months').format('D'))) - ((parseInt(this.diaActual) + 10));
  diasRestantesPagoInicioMes = parseInt(this.diaActual) - (parseInt(moment().startOf('month').format('D')));
  bloqueador;
  ListaserviciosContratados = [];
  fileExist = false;
  Servicios: any;
  previsualizacion: any;
  idImagen: any;
  imagen: any;
  baseUrl = baseUrlF
  contador: any;
  x = 0;
  serviciosMesActual: any;
  bloqueadorInicioMes = true;
  bloqueadorFinMes = true;
  bloqueadorMesAnterior: boolean;
  contadorMesAnterior = 1
  alerta = "";
  serviciosMesAnterior: void;



  constructor(
    private serviciosContratados: GestionServiciosContratadosService,
    private _location: Location,
    private notification: NzNotificationService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,


  ) { }

  ngOnInit(): void {
    this.getPayServiceByUser();
    console.log(this.mesActual)
    console.log(this.anioActual);
  }

  backClicked() {
    this._location.back();
  }
  panels = [
    {
      active: false,
      name: 'Desplegar Acciones',
      disabled: false
    },

  ];


  // modal para solicitar servicios
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  // modal para solicitar servicioss end





  getPayServiceByUser() {
    this.serviciosContratados.getPayServiceByUser().subscribe(
      respuesta => {
        this.Servicios = respuesta.data.filter(respuesta => (respuesta.servicio_contratado_activo == 1 || respuesta.servicio_activo ==1 ))
        this.serviciosMesActual = respuesta.data.filter(respuesta => ((respuesta.servicio_contratado_activo==1 && respuesta.servicio_activo==1 && respuesta.visualizar == 0) || (respuesta.servicio_contratado_activo==1 && respuesta.servicio_activo==1 && respuesta.subido == null)  ))
        this.serviciosMesAnterior = respuesta.data.filter(respuesta => (respuesta.servicio_contratado_activo==1 && respuesta.servicio_activo==1 && respuesta.subido <= this.id || ( respuesta.servicio_contratado_activo==1 && respuesta.servicio_activo==1 && respuesta.subido == null) )  )
        console.log(parseInt(this.id))
        console.log(this.Servicios);
        console.log(this.serviciosMesAnterior)
        console.log(this.serviciosMesActual);
        this.observadorPagoInicioMes(this.serviciosMesActual);
        this.observadorPagoFinMes(this.serviciosMesActual);
        this.observadorPagoMesesAnterior(this.Servicios);
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al obtener los servicios contratados: ', '');
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

  agregarServicio(array) {

    console.log(array)
    array.forEach(element => {

      console.log(element.name)
      this.contratarNuevosServicios(element.id, element.name);
    });
    // this.listOfData = this.listOfData.concat(array);
  }

  contratarNuevosServicios(idServicio, nombreServicio) {
    const data = {
      email: this.user,
      servicio: idServicio
    }
    this.serviciosContratados.registrarNuevosServiciosOpcional(data).subscribe(respuesta => {
      if (respuesta) {
        this.getPayServiceByUser();
        this.createNotification('success', `Registro de servicio: ${nombreServicio} `, 'Registrado con éxito');

      }
    }, err => {
      console.log(err);
      this.createNotification('error', `El servicio: ${nombreServicio}`, 'Ya se encuentra registrado ');
    });
  }
  // capturar imagen y convertirla a base64
  getBase64(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //me.modelvalue = reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  // funcion que captura la imagen cargada en el input para mostrarla
  capturarFile(event, idImage): any {
    this.idImagen = idImage;
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;

      this.imagen = imagen;
    })
    // this.archivos.push(archivoCapturado)
    // //
    console.log(event.target.files);
    // console.log(archivoCapturado);//array con informacion de la imagen
    this.fileExist = true;        //establece que el archivo ya ha sido cargado
    console.log(this.fileExist);

  }

  // funcion el cual transforma la imagen en base64
  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })


  // funcion para subir archivo
  subirArchivo(idServicioContracted,): any {

    const data = { tipo: '1', dependent: String(idServicioContracted), base64Image: this.imagen['base'] } //el tipo 1 declara que es un la imagene es de un servicio contratado
    const data2 = {createAt:`${this.anioActual}-${this.id}-01`, tipo: '1', dependent: String(idServicioContracted), base64Image: this.imagen['base'] } //el tipo 1 declara que es un la imagene es de un servicio contratado

    // el tipo 1 declara que es un la imagene es de un servicio contratado
    // el dependent establace a que servicio contratado pertenece
    // el base64image es la imagen en formato base64


    console.log(this.imagen['base']);

    if (this.id == this.mesActual) {
      this.serviciosContratados.postDocumentServiceContracted(data).subscribe(      //peticion post que envia los datos para el registro
        respuesta => {
          console.log(respuesta);
          if (respuesta) {
            this.createNotification('success', 'Documento: ', 'Documento cargado con éxito');  // si el envio fue exitoso se  mostrara una notificacion
            this.getPayServiceByUser();                                              // llamara a la funcion de getPayServiceByUser el cual mostrara todos los servicios contratados por el cliente que se encuentre logueado
          }
        }, err => {
          console.log(err);
          this.createNotification('error', 'Error al cargar documento: ', err);                // si hay algun error mostrara una notificacion y el detalle del error
        })
    } else {
      this.serviciosContratados.postDocumentosMesAnterior(data2).subscribe(      //peticion post que envia los datos para el registro
        respuesta => {
          console.log(respuesta);
          if (respuesta) {
            this.createNotification('success', 'Documento: ', 'Documento cargado con éxito');  // si el envio fue exitoso se  mostrara una notificacion
            this.getPayServiceByUser();                                              // llamara a la funcion de getPayServiceByUser el cual mostrara todos los servicios contratados por el cliente que se encuentre logueado
          }
        }, err => {
          console.log(err);
          this.createNotification('error', 'Error al cargar documento: ', err);                // si hay algun error mostrara una notificacion y el detalle del error
        })
    }

  }

  cambiarPeriodoPago(idServicioContratado) {

    const data = { servicioContratado: idServicioContratado }
    this.serviciosContratados.cambiarPeriodoPagoServicioContratado(data).subscribe(respuesta => {
      if (respuesta) {
        this.getPayServiceByUser();
        this.createNotification('success', 'Periodo de pago actualizado ', 'Actualizado con éxito');  // si el envio fue exitoso se  mostrara una notificacion
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al cargar documento: ', err);                // si hay algun error mostrara una notificacion y el detalle del error
    })
  }



  observadorPagoFinMes(listado) {
    let contador = 0
    listado.forEach(element => {
      if ((element.subido == null || element.subido < 8) && this.diasRestantesPagoFinMes <= 0 && element.periodo_pago == "2") {
        contador += 1;
      }
    });
    if (contador >= 1) {
      this.serviciosContratados.bloqueadorFinMes = true;
      this.bloqueadorFinMes = this.serviciosContratados.bloqueadorFinMes
      this.alerta = "Los servicios se han deshabilitado hasta que se realice el pago pendiente.";
    }
    if (contador == 0) {
      this.serviciosContratados.bloqueadorFinMes = false;
      this.bloqueadorFinMes = this.serviciosContratados.bloqueadorFinMes;
    }


  }

  observadorPagoInicioMes(listado) {
    let contador = 0
    listado.forEach(element => {
      // (servicio.subido<id && servicio.periodo_pago=='1')
      if ((element.subido == null || element.subido < 8) && this.diasRestantesPagoInicioMes >= 10 && element.periodo_pago == "1") {
        contador += 1;
      }
    });
    if (contador >= 1) {
      this.serviciosContratados.bloqueadorInicioMes = true;
      this.bloqueadorInicioMes = this.serviciosContratados.bloqueadorInicioMes
      this.alerta = "Los servicios se han deshabilitado hasta que se realice el pago pendiente."
    }
    if (contador == 0) {
      this.serviciosContratados.bloqueadorInicioMes = false;
      this.bloqueadorInicioMes = this.serviciosContratados.bloqueadorInicioMes;
    }
  }



  observadorPagoMesesAnterior(listado) {
    let fecha1
    let fecha2
    listado.forEach(element => {
      const data = { idServicioContratado: element.servicio_contratado_id }
      this.serviciosContratados.contadorDocumentosServicioContratado(data).subscribe(respuesta => {
        respuesta.forEach(element => {
          fecha1 = moment(element.creado);
          fecha2 = this.fechaActual.diff(fecha1, 'months')
          if (parseInt(element.documentos) < parseInt(fecha2)) {
            this.contadorMesAnterior += 1
            console.log(element.creado);
            console.log(this.fechaActual);
            console.log(fecha1)
            console.log(fecha2)
            console.log(respuesta)


          }
          this.verificador(this.contadorMesAnterior)

        });

      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al cargar documento: ', err);                // si hay algun error mostrara una notificacion y el detalle del error
      })

    }
    );

  }

  verificador(contador) {
    if (contador > 1) {
      this.serviciosContratados.bloqueadorMesAnteriores = true;
      this.bloqueadorMesAnterior = this.serviciosContratados.bloqueadorMesAnteriores;
      this.alerta = "Los servicios se han deshabilitado hasta que se realice el pago pendiente.";
    }

    if (contador == 1) {
      this.serviciosContratados.bloqueadorMesAnteriores = false;
      this.bloqueadorMesAnterior = this.serviciosContratados.bloqueadorMesAnteriores;
    }

  }


  Mes = {
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
  }
}
