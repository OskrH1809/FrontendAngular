import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-edicion-tareas',
  templateUrl: './edicion-tareas.component.html',
  styleUrls: ['./edicion-tareas.component.css']
})
export class EdicionTareasComponent implements OnInit {
  @Input() datosE;
  idE='hola';
  tituloE='hola';
  descripcionE='hola';
  fileE='hola';




  constructor() {

   }

  ngOnInit(): void {
    this.idE= this.datosE['id']; ;
    this.tituloE= this.datosE['titulo'];
    this.descripcionE= this.datosE['descripcion'];
    this.fileE='' ;

    console.log(this.tituloE)
  }


  datosss(){
    console.log(this.datosE)
    console.log(this.tituloE)
  }
   // form modal 2
   public demoReactiveForm = new FormGroup( {

    titulo: new FormControl(``),
    descripcion: new FormControl(''),
    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])
  } );

  public formDataPreview?: string;

  public ngAfterViewInit() {
    this.demoReactiveForm!.valueChanges
      .subscribe( values => {
        this.formDataPreview = JSON.stringify( values );
      } );
  }

  public onSubmit(): void {
    console.log(this.demoReactiveForm.value);
    this.reset();
  }

  public reset(): void {
    this.demoReactiveForm!.reset();
  }

  public get description(): AbstractControl {
    return this.demoReactiveForm!.controls.descripcion;
  }

  get f(){

    return this.demoReactiveForm.controls;

  }

  onFileChange(event) {



    if (event.target.files.length > 0) {

      const file = event.target.files[0];

      this.demoReactiveForm.patchValue({

        fileSource: file

      });

    }

  }

  submit(){

    const formData = new FormData();

    formData.append('file', this.demoReactiveForm.get('fileSource').value);

    console.log(formData);

    // this.http.post('http://localhost:8001/upload.php', formData)

    //   .subscribe(res => {

    //     console.log(res);

    //     alert('Uploaded Successfully.');

    //   })

  }


  // editor
  dataDescripcion:any;
  descripcion:any;
  public Editor = ClassicEditor;

  public onChange( { editor } ) {
      const data = editor.getData();
      console.log(data);

  }

  public info(){
    this.descripcion = this.Editor;
  }


}
