import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import es from '@angular/common/locales/es';
import { TextoEditorComponent } from './components/texto-editor/texto-editor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DashboardComponent } from './views/components/dashboard/dashboard.component';
import { HeaderComponent } from './views/components/header/header.component';
import { ModuloUsuariosModule } from './modulo_usuarios/modulo-usuarios.module';
import { ModuloServiciosModule } from './modulo_servicios/modulo-servicios.module';
import { ModuloServicioContratadoModule } from './modulo_servicio_contratado/modulo-servicio-contratado.module';
import { FooterComponent } from './views/components/footer/footer.component';
import { AsideComponent } from './views/components/aside/aside.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Autentificacion } from './core/interceptors/autentificacion.service';
import { GestionUsuariosService } from './auth/services/gestion-usuarios.service';
import { ClientesDeServicioComponent } from './shared/components/clientes-de-servicio/clientes-de-servicio.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
registerLocaleData(es);


@NgModule({
  declarations: [
    AppComponent,
    TextoEditorComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    ClientesDeServicioComponent,




  ],
  imports: [
    BrowserModule,
    ModuloUsuariosModule,
    ModuloServicioContratadoModule,
    ModuloServiciosModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NzIconModule,
    NzDropDownModule
  ],
  exports:[
    ModuloServiciosModule
  ],

  providers: [

    GestionUsuariosService,

    { provide: NZ_I18N , useValue: es_ES,
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: Autentificacion,
      multi: true
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule{}
