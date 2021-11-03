import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';

@Component({
  selector: 'app-vista-documentos',
  templateUrl: './vista-documentos.component.html',
  styleUrls: ['./vista-documentos.component.css']
})
export class VistaDocumentosComponent implements OnInit {
  documentos: any;
  idTarea = this.route.snapshot.paramMap.get("tarea");
  idUsuario = this.route.snapshot.paramMap.get("usuario")
  documentosFiltrados: Array<any>;

  constructor(
    private gestionServicios: GestionServiciosContratadosService,
    private route: ActivatedRoute,
    private _location: Location,

  ) { }

  ngOnInit(): void {
    this.getOneDocumentSpecific();
  }


  //  get documents
  // getDocuments(){
  //   this.gestionServicios.getDocumentsServiceContracted().subscribe(respuesta=>{
  //     console.log(respuesta);
  //     this.documentos = respuesta;
  //     this.documentos.array.forEach(element => {

  //     });
  //   })
  // }

  getOneDocumentSpecific() {
    console.log(this.idUsuario);
    console.log(this.idTarea);
    const tipo = '2';
    this.gestionServicios.getOneDocumentSpecific(this.idUsuario, tipo, this.idTarea).subscribe(respuesta => {
      this.documentos = respuesta;
      console.log(respuesta);
    })
  }


  backClicked() {
    this._location.back();
  }

}
