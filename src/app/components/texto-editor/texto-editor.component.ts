import { Component, Input, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DomSanitizer } from '@angular/platform-browser';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-texto-editor',
  templateUrl: './texto-editor.component.html',
  styleUrls: ['./texto-editor.component.css']
})
export class TextoEditorComponent implements OnInit {
  // public Editor = DecoupledEditor;

  @Input() dataEntrante: any;
  public Editor = ClassicEditor;

    public onChange( { editor }: ChangeEvent ) {
        const data = editor.getData();

        console.log( data );
    }


  constructor(private sanitizer: DomSanitizer) {

   }

  ngOnInit(): void {
  }



  // upload file
  public previsualizacion: string;
public previsualizacion2: string;
public archivos: any = []
public loading: boolean
fileExist= false; //declara si la imagen existe

capturarFile(event): any {
  const archivoCapturado = event.target.files[0]
  this.extraerBase64(archivoCapturado).then((imagen:any)=>{
    this.previsualizacion = imagen.base;
    console.log(imagen);
  })
  this.archivos.push(archivoCapturado)
  // //
  console.log(event.target.files);
  console.log(archivoCapturado);
  this.fileExist=true;


}
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

subirArchivo(): any {
  try {

    const formularioDeDatos = new FormData();
    this.archivos.forEach(archivo => {
      formularioDeDatos.append('files', archivo)
      console.log(archivo);
    })
    // formularioDeDatos.append('_id', 'MY_ID_123')
    // this.rest.post(`http://localhost:3001/upload`, formularioDeDatos)
    //   .subscribe(res => {
    //     this.loading = false;
    //     console.log('Respuesta del servidor', res);

      // }
      //  () => {
      //   this.loading = false;
      //   alert('Error');
      // })
  } catch (e) {

    console.log('ERROR', e);

  }
}



}
