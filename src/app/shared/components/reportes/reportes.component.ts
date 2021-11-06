import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GestionClientesService } from '../../services/gestion-clientes.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosService } from '../../services/gestion-servicios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  isVisible = false;
  dataSelect: { id: any; estado: string; };
  usuarios;
  usuarioSeleccionado: { id: string; };
  fecha_2: string;
  fecha_1: string;

  constructor(
    private _location: Location,
    private gestionCliente: GestionClientesService,
    private notification: NzNotificationService,
    private gestioServicio: GestionServiciosService,
    private fb: FormBuilder

  ) { }


  ngOnInit(): void {
    this.usuariosAll();

    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });

  }
  backClicked() {
    this._location.back();

  }

  showModal(): void {
    this.isVisible = true;
    this.optionList = this.usuarios
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    console.log(this.dataSelect);
    console.log(this.usuarioSeleccionado)
    this.gestioServicio.get_reporte(this.usuarioSeleccionado.id).subscribe(
      respuesta => {
        console.log(respuesta);
      }
    )

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
  optionList = [];
  selectedValue = 'Seleccionar estado'
  // tslint:disable-next-line:no-any

  log(value: { value: string; }): void {


    this.dataSelect = { id: 1, estado: value.value }
    this.usuarioSeleccionado = { id: value.value }
    console.log(this.dataSelect);

  }

  usuariosAll() {
    this.gestionCliente.usuariosAll().subscribe(respuesta => {
      if (respuesta) {
        this.usuarios = respuesta.data;
        console.log(this.usuarios)
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al cargar datos: ', err);                // si hay algun error mostrara una notificacion y el detalle del error
    })
  }




  createNotification(type1: string, type2: string, type3: string,): void {
    this.notification.create(
      type1,
      type2,
      type3,
      { nzDuration: 12000 }
    );

  }
  // forlario
  validateForm!: FormGroup;
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }


  }
  serviciosMasContratados(){
    this.gestionCliente.servicioMasContratado().subscribe(respuesta => {
      if (respuesta) {
        console.log(respuesta)
      }
    })
  }



  servicios_contratados_fechas(){
    this.gestionCliente.servicios_contratados_fechas(this.fecha_1,this.fecha_2).subscribe(respuesta => {
      if (respuesta) {
        console.log(respuesta)
      }
    })
  }
  serviciosMenosContratados(){
    this.gestionCliente.servicioMenosContratado().subscribe(respuesta => {
      if (respuesta) {
        respuesta
      }
    })
  }

  onValueChange(value: Date): void {
    console.log(`Current value: ${value}`);
    this.fecha_1 = moment(value).format('YYYY-MM-DD');
    console.log(this.fecha_1)

  }

  onPanelChange(change: { date: Date; mode: string }): void {
    console.log(`Current value: ${change.date}`);
    console.log(`Current mode: ${change.mode}`);
  }
  // calendario 2
  onValueChange2(value2: Date): void {
    console.log(`Current value: ${value2}`);
    console.log(moment(value2).format('YYYY-MM-DD'))
    this.fecha_2 = moment(value2).format('YYYY-MM-DD');
  }

  onPanelChange2(change2: { date2: Date; mode2: string }): void {
    console.log(`Current value: ${change2.date2}`);
    console.log(`Current mode: ${change2.mode2}`);
  }
  // reporte entre fechas

  isVisible2 = false;



  showModal2(): void {
    this.isVisible2 = true;
  }

  handleOk2(): void {
    console.log('Button ok clicked!');
    this.isVisible2 = false;
  }

  handleCancel2(): void {
    console.log('Button cancel clicked!');
    this.isVisible2 = false;
  }
}
