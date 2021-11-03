import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';
import { GestionUsuariosService } from 'src/app/auth/services/gestion-usuarios.service';
import { JwtHelperService } from '@auth0/angular-jwt';


// upload

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit {
  id = this.route.snapshot.paramMap.get("id");
  imagen;
  panelOpenState = false;
  administrarService: any;
  closeModal: string;
  fileExist = false; //declara si la imagen existe
  verificarAcceso = this.gestionUsuario.verificarAcceso();
  dataDocuments; //variable que se utilizara para enviar la imagen a documentos
  documentoEspecifico;
  mesActual = moment().format('M').toString();
  diaActual = moment().format('D')
  helper = new JwtHelperService();
  decodeToken = this.helper.decodeToken(localStorage.getItem('token'))
  role = this.decodeToken.roles[0];
  user = this.decodeToken.username;                                           // Se utiliza para almacenar el nombre del usuario logueado que se encuentra en el jwt
  checked = false;
  currentDate: moment.Moment = moment();
  isVisible = false;  //variable que controla el abrir y cerrar del modal
  diasRestantesPagoFinMes   = (parseInt( moment().endOf('months').format('D'))) - ((parseInt(this.diaActual)+13)) ;
  diasRestantesPagoInicioMes = parseInt(this.diaActual) - (parseInt(moment().startOf('month').format('D')));

  bloqueador;

  cambiarPeriodoPago(idServicioContratado){

    const data = {servicioContratado: idServicioContratado}
    this.serviciosContratados.cambiarPeriodoPagoServicioContratado(data).subscribe(respuesta=>
      {
        if (respuesta) {
          this.getServiciosContratadosByUser();                                              // llamara a la funcion de getServiciosContratadosByUser el cual mostrara todos los servicios contratados por el cliente que se encuentre logueado
          this.nuevoEstado(idServicioContratado,'7');
          this.createNotification('success', 'Periodo de pago actualizado ', 'Actualizado con éxito');  // si el envio fue exitoso se  mostrara una notificacion
        }
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al cargar documento: ', err);                // si hay algun error mostrara una notificacion y el detalle del error
      })
  }

  constructor(private router: Router,
    private serviciosContratados: GestionServiciosContratadosService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private gestionUsuario: GestionUsuariosService,
    private _location: Location,
    )
  {


  }

  ngOnInit(): void {
    console.log('restante'+this.diasRestantesPagoFinMes);
    console.log('dia actuaal'+this.diaActual);
    console.log(this.id);
    console.log(this.diasRestantesPagoInicioMes);
    this.getImageDocuments();
    this.getServiciosContratadosByUser();


  }

  observadorPagoFinMes(listado){
   listado.forEach(element => {
      if (element.idEstado ==7 && this.diasRestantesPagoFinMes<=0 ) {
        this.serviciosContratados.bloqueador = true;
        this.bloqueador = this.serviciosContratados.bloqueador;
      }
    });

    console.log(this.bloqueador);

  }

  observadorPagoInicioMes(listado){
    listado.forEach(element => {
       if (element.idEstado==1 && this.diasRestantesPagoInicioMes>=10 ) {
         this.serviciosContratados.bloqueador = true;
         this.bloqueador = this.serviciosContratados.bloqueador;
       }
     });
     console.log(this.bloqueador);
   }




  // array para mostrar el encabezado en el encabezado el mes
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
    10: "Octumbre",
    11: "Noviembre",
    12: "Diciembre",
  }




  // subir archivo
  public previsualizacion: string;
  public previsualizacion2: string;
  public archivos: any = [];
  public loading: boolean;
  idImagen;

  // funcion que captura la imagen cargada en el input para mostrarla
  capturarFile(event, idImage): any {
    this.idImagen = idImage;
    const archivoCapturado = event.target.files[0]
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;

      this.imagen = imagen;
    })
    this.archivos.push(archivoCapturado)
    // //
    console.log(event.target.files);
    console.log(archivoCapturado);//array con informacion de la imagen
    this.fileExist = true;        //establece que el archivo ya ha sido cargado

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
    // el tipo 1 declara que es un la imagene es de un servicio contratado
    // el dependent establace a que servicio contratado pertenece
    // el base64image es la imagen en formato base64


    console.log(data);

    this.serviciosContratados.postDocumentServiceContracted(data).subscribe(      //peticion post que envia los datos para el registro
      respuesta => {
        console.log(respuesta);
        if (respuesta) {
          this.createNotification('success', 'Documento: ', 'Documento cargado con éxito');  // si el envio fue exitoso se  mostrara una notificacion
          this.getServiciosContratadosByUser();                                              // llamara a la funcion de getServiciosContratadosByUser el cual mostrara todos los servicios contratados por el cliente que se encuentre logueado
          this.getImageDocuments();                                                          /// llamara a la funcion getImageDocuments la cual mostrara la imagen siempre y cuando el estado del servicio sea pendiente de aprobacion

        }
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al cargar documento: ', err);                // si hay algun error mostrara una notificacion y el detalle del error
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

  // funcion el cual se utiliza para mostrar todos los servicios contratados por el usuario que se encuentre logueado
  ListaserviciosContratados = [];
  getServiciosContratadosByUser() {
    this.serviciosContratados.getServiciosContratadosByUser().subscribe(
      resp => {
        this.ListaserviciosContratados = resp;
        this.observadorPagoFinMes(resp);
        this.observadorPagoInicioMes(resp)
        console.log(this.ListaserviciosContratados);

      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al obtener los servicios contratados: ', err);
      })

  }


  // funcion que permite cambiar el estado del servicio contratado cuando se cargue una imagen
  nuevoEstado(servicio, nuevoEstado) {

    const data = { estado: nuevoEstado }

    this.serviciosContratados.updateEstadoServicioContratado(servicio, data).subscribe(
      respuesta => {
        if (respuesta) {
        }
        this.getServiciosContratadosByUser()
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al actualizar estado: ', err);
      })



  }

  // funcion(que no se esta utizando) que sirve para pasar los archivos a base64
  getBase64(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //me.modelvalue = reader.result;
      console.log('Imagenasdasd: ' + reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  // funcion que se utiliza paraa mostrar las imagenes de los servicios contratados
  getImageDocuments() {
    this.serviciosContratados.getDocumentsServiceContracted().subscribe(
      respuesta => {
        this.documentoEspecifico = respuesta;
        console.log(respuesta);
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al obtener la imagen: ', err);
      }
    )
  }


  // modal para el poder agregar servicios
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
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
        this.getServiciosContratadosByUser();
        this.createNotification('success', `Registro de servicio: ${nombreServicio} `, 'Registrado con éxito');

      }
    }, err => {
      console.log(err);
      this.createNotification('error', `El servicio: ${nombreServicio}`, 'Ya se encuentra registrado ');
    });
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
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

}
