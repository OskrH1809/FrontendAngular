import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuloServicioContratadoRoutingModule } from './modulo-servicio-contratado-routing.module';
import { ServicioComponent } from '../shared/components/servicio/servicio.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzImageModule } from 'ng-zorro-antd/image';
import { CardsComponent } from '../shared/components/cards/cards.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ContratarServiciosComponent } from '../shared/components/contratar-servicios/contratar-servicios.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ModuloServiciosModule } from '../modulo_servicios/modulo-servicios.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { PanelAdministracionComponent } from '../shared/components/panel-administracion/panel-administracion.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ServiciosComponent } from '../shared/components/servicios/servicios.component';

@NgModule({
  declarations: [
    ServicioComponent,
    CardsComponent,
    PanelAdministracionComponent,
    ServiciosComponent


  ],
  imports: [
    CommonModule,
    ModuloServicioContratadoRoutingModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    FontAwesomeModule,
    NzImageModule,
    NzNotificationModule,
    NzModalModule,
    NzButtonModule,
    NzTableModule,
    ModuloServiciosModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzIconModule





  ],
  exports:[

  ]

})
export class ModuloServicioContratadoModule {

 }
