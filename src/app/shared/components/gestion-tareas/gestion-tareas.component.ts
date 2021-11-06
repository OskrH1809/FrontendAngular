import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-gestion-tareas',
  templateUrl: './gestion-tareas.component.html',
  styleUrls: ['./gestion-tareas.component.css']
})

export class GestionTareasComponent implements OnInit {
  helper = new JwtHelperService();
  decodeToken = this.helper.decodeToken(localStorage.getItem('token'))
  idServicio = this.route.snapshot.paramMap.get("idservicio");
  idUsuario = this.route.snapshot.paramMap.get("idusuario");
  servicio = this.route.snapshot.paramMap.get("nombreservicio");
  idMes = this.route.snapshot.paramMap.get("mes");
  idTarea;
  ArchivoCap: any;
  documentoBase64;
  documentos;
  mesActual = moment().format('M').toString();
  id: string;
  administrarService: boolean;
  role = this.decodeToken.roles


  // editor enriquecido
  dataDescripcion: any;
  descripcion: any;
  public Editor = ClassicEditor;
  tiempo_restante: any;
  nombreUsuario: any;
  public onChange({ editor }) {
    const data = editor.getData();
    console.log(data);
  }
  public info() {
    this.descripcion = this.Editor;
  }
  //  editor enriquecido end


  constructor(
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router:Router,
    private _location: Location,
    private modalService: NgbModal,
    private gestionServicios: GestionServiciosContratadosService,
    private ServiciosContratados: GestionServiciosContratadosService) {
  }

  i = 1;

  editId: string | null = null;
  listOfData: any = [];


  idEdit = '';
  tituloEdit = '';
  descripcionEdit = '';
  fileEdit = '';
  arrayEdit;


  // funcion que se utiliza para llenar los datos en el formulario cuando se desea editar la informacion
  llenarDatos(id, titulo, descripcion) {
    this.arrayEdit = {
      descripcion2: descripcion,
      file: "",
      fileSource: "",
      id: id,
      titulo: titulo
    }
    this.demoReactiveForm2.setValue(this.arrayEdit);
  }


  ngOnInit(): void {
    this.getTareas();
    this.getTiempo();
    this.getName();
    this.id = this.route.snapshot.paramMap.get("id");
  }

  // funcion que abre el modal para el ingreso de nuevas tareas
  closeModal: string;
  triggerModal(content) {
    this.modalService.open(content,
      { size: 'xl', ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
        this.closeModal = `Closed with: ${res}`;
      }, (res) => {
        this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // final funcion que abre el modal para el ingreso de nuevas tareas


  //funcion que regresa a la pagina anterior
  backClicked() {
    this._location.back();
  }

  // formulario de registro de nuevas tareas
  public demoReactiveForm = new FormGroup({
    id: new FormControl(),
    titulo: new FormControl(),
    descripcion: new FormControl(),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  public formDataPreview?: string;

  public ngAfterViewInit() {
    this.demoReactiveForm!.valueChanges
      .subscribe(values => {
        this.formDataPreview = JSON.stringify(values);
      });

  }
  // Funcion que envia los datos para crear la nueva tarea
  public onSubmit(): void {
    console.log(this.demoReactiveForm.value);
    const dataTareas = { titulo: this.demoReactiveForm.value.titulo, descripcion: this.demoReactiveForm.value.descripcion, servicio: this.idServicio, }
    this.postTareas(dataTareas);
    console.log(this.demoReactiveForm.value.id);
    console.log(parseInt(this.idTarea));
    this.reset();
  }

  // funcion que limpia todo lo que contenga el formulario para dejar libre a un nuevo registro
  public reset(): void {
    this.demoReactiveForm!.reset();
  }

  public get description(): AbstractControl {
    return this.demoReactiveForm!.controls.descripcion;
  }

  get f() {
    return this.demoReactiveForm.controls;
  }

  // funcion que captura el documento cargado en el formulario
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.demoReactiveForm.patchValue({
        fileSource: file
      });
    }
  }
  // funcion que envia los datos recolectados en el file enviado a travez del input
  submit() {
    const formData = new FormData();
    formData.append('file', this.demoReactiveForm.get('fileSource').value);
    console.log(formData);
  }

  // declaración del formulario 2 que se utilizara para la edición
  public demoReactiveForm2 = new FormGroup({

    id: new FormControl(),
    titulo: new FormControl(),
    descripcion2: new FormControl(),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  public formDataPreview2?: string;

  // funcion que se utilizara para enviar los datos que se han editado para realizar el proceso de actualización
  public onSubmit2(): void {
    console.log(this.demoReactiveForm2.value);
    this.editTarea(this.demoReactiveForm2.value.id, this.demoReactiveForm2.value.titulo, this.demoReactiveForm2.value.descripcion2);
    this.reset2();
  }
  // funcion que se utilizara para limpiar todo el formulario de edición
  public reset2(): void {
    this.demoReactiveForm2!.reset();
  }

  public get descripcion2(): AbstractControl {
    return this.demoReactiveForm2!.controls.descripcion2;
  }

  get f2() {
    return this.demoReactiveForm2.controls;
  }

  // funcion que captura el documento cargado en el formulario
  onFileChange2(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.demoReactiveForm2.patchValue({
        fileSource: file
      });
    }
  }

  // funcion que envia los datos recolectados en el file enviado a travez del input
  submit2() {
    const formData = new FormData();
    formData.append('file', this.demoReactiveForm2.get('fileSource').value);
    console.log(formData);
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

  // modal que contiene el formulario de edicion
  isVisibleFormulario = false;

  showModalFormulario(): void {
    this.isVisibleFormulario = true;
  }

  handleOkFormulario(): void {
    this.isVisibleFormulario = false;
  }

  handleCancelFormulario(): void {
    this.isVisibleFormulario = false;
  }
  // fin del modal que contiene el formulario de edicion

  // funcion que hace un llamado a la api para obtener y visualizar los datos en la tabla
  getTareas() {
    this.ServiciosContratados.getTareasEspeficas(this.idUsuario, this.idServicio).subscribe(
      respuesta => {
        console.log(respuesta);

        this.listOfData = respuesta;
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al obtener las tareas: ', err);
      })
  }
  getName() {
    this.ServiciosContratados.getName(this.idUsuario).subscribe(
      respuesta => {
        console.log(respuesta);

        this.nombreUsuario = respuesta['0'].email;
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al obtener las tareas: ', err);
      })
  }

  getTiempo(){
    this.ServiciosContratados.getServicioEspecifico(this.idServicio).subscribe(
      respuesta=>{
        console.log(respuesta[0].time_remaining);
        this.tiempo_restante = respuesta[0].time_remaining
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al enviar la nueva tarea: ', err);
      }
    )
  }

  // funcion que se utiliza para enviar los datos para la creacion de una nueva tarea
  postTareas(data) {
    this.gestionServicios.newTareas(data).subscribe(
      respuesta => {
        console.log(respuesta);
        if (this.documentoBase64) {
          this.posDocument(parseInt(respuesta.id), this.documentoBase64);
        }
        this.getTareas();
        this.createNotification('info', 'Tarea', 'Agregada con éxito');

      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al enviar la nueva tarea: ', err);
      }
    )
  }

  // funcion que se utiliza para enviar los datos para la creacion de un nuevo documento perteneciente a una tarea
  posDocument(tarea, documento) {
    const data = { tipo: '2', dependent: tarea, base64Image: documento }
    this.gestionServicios.postDocumentServiceContracted(data).subscribe(
      respuesta => {
        console.log(respuesta);
        if (respuesta) {
          this.createNotification('info', 'Tareas: ', 'Documento cargado con éxito');

        }
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al enviar el documento de tareas: ', err);
      })
  }

  // funcion que convierte a base64 los documentos
  getBase64(event) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    let dataDocument;

    reader.readAsDataURL(file);
    reader.onload = function () {
      // me.modelvalue = reader.result;
      console.log('Documento base 64: ' + reader.result);
      me.documentoBase64 = reader.result
    };

    // console.log(this.documentoBase64)
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  // funcion que hace un llamado a la api para realizar un put de las tareas
  editTarea(id, titulo, descripcion) {

    const data = { id: id, titulo: titulo, descripcion: descripcion }
    this.gestionServicios.editarTarea(data).subscribe(respuesta => {
      console.log(respuesta);
      if (this.documentoBase64) {
        this.posDocument(parseInt(id), this.documentoBase64);
      }
      this.getTareas();
      this.createNotification('info', 'Tarea', 'Actualizada con éxito');

    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al actualizar tarea: ', err);
    })
  }

  // funcion que hace un llamado a la api para realizar un delete de las tareas
  eliminarTarea(id) {

    console.log(id);
    this.gestionServicios.eliminarTarea(id).subscribe(respuesta => {
      console.log(respuesta);
      if (respuesta) {
        this.getTareas();
        this.createNotification('warning', 'Tarea', 'Eliminada con éxito');
      }

    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al eliminar tarea: ', err);
    })


  }


  // modal del estado de la tarea

  isVisible = false;
  tarea;
  showModal(tarea): void {
    this.tarea = tarea
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

  // select estado
  optionList = [
    { label: 'Creado', value: '1' },
    { label: 'En revisión', value: '2' },
    { label: 'Finalizado', value: '3' }
  ];
  selectedValue = 'Seleccionar estado'
  // tslint:disable-next-line:no-any

  log(value: { value: string; }): void {
    console.log(value.value);
    const data = { id: this.tarea, estado: value.value }
    this.actualizarEstadoTarea(data);


    this.optionList = [
      { label: 'Creado', value: '1' },
      { label: 'En revisión', value: '2' },
      { label: 'Finalizado', value: '3' }
    ];
  }

  actualizarEstadoTarea(data) {
    this.gestionServicios.actualizarEstadoTarea(data).subscribe(respuesta => {
      if (respuesta) {
        this.getTareas();
        this.createNotification('info', 'Tarea', 'Estado actualizado con éxito');
      }

    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al actualizar estado: ', 'Actualizar estado sin éxito');
    })
  }

  startEdit(id: string): void {
    this.editId = id;
  }


  //Funcion que indica que se ha finalizado la edicion y pasa los nuevos parametros para actualizarlos
  stopEdit(id, tiempo): void {

    console.log(id)
    console.log(tiempo)
    const data = {
      id: id,
      horasTarea: tiempo

    }

    this.gestionServicios.ingresarHorasTarea(data).subscribe(respuesta=>{
      if (respuesta) {
        this.getTareas();
        this.createNotification('info', 'Tarea', 'Horas actualizadas con éxito');
      }

    }, err => {
      console.log(err);
      this.getTareas();
      this.createNotification('error', 'Error al actualizar estado: ', err);
    })
  }

  verComentario(idTarea,idUsuario){
    this.changeViewedAdmin(idTarea);
    this.router.navigate([`conversacion/${idTarea}/${idUsuario}`])

  }

  verComentarioAdmin(idTarea,idUsuario){
    this.changeViewedUser(idTarea);
    this.router.navigate([`conversacion/${idTarea}/${idUsuario}`])

  }

  changeViewedAdmin(idTarea){
    const data= { tarea:idTarea}
    console.log(idTarea);
    this.gestionServicios.changeViewedAdmin(data).subscribe(respuesta =>{
      console.log(respuesta)
    })
  }
  changeViewedUser(idTarea){
    const data= { tarea:idTarea}
    console.log(idTarea);
    this.gestionServicios.changeViewedUser(data).subscribe(respuesta =>{
      console.log(respuesta)
    })
  }
}
