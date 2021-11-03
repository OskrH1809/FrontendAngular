import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratarServiciosComponent } from '../shared/components/contratar-servicios/contratar-servicios.component';
import { CreacionServiciosComponent } from '../shared/components/creacion-servicios/creacion-servicios.component';
import { EdicionTareasComponent } from '../components/edicion-tareas/edicion-tareas.component';
import { GestionTareasComponent } from '../shared/components/gestion-tareas/gestion-tareas.component';
import { ListadosSeComponent } from '../shared/components/listados-servicios-contratados-usuario/listados-servicios-contratados-usuario.component';
import { ServicioComponent } from '../shared/components/servicio/servicio.component';
import { AuthGuardGuard } from '../auth/services/auth-guard.guard';
import { VistaDocumentosComponent } from '../shared/components/vista-documentos/vista-documentos.component';
import { RolesGuard } from '../auth/services/role-admin.guard';
import { ListadoTareasAllComponent } from '../shared/components/listado-tareas-all/listado-tareas-all.component';
import { ConversacionesComponent } from '../shared/components/conversaciones/conversaciones.component';
import { ListadoServiciosContradadosAllComponent } from '../shared/components/listado-servicios-contradados-all/listado-servicios-contradados-all.component';

const routes: Routes = [
  {path:'listado/:idUser/:id', component:ListadosSeComponent, canActivate: [AuthGuardGuard,RolesGuard],canLoad:[AuthGuardGuard,RolesGuard]},
  {path:'gestionservicios', component:CreacionServiciosComponent, canActivate: [AuthGuardGuard,RolesGuard],canLoad:[AuthGuardGuard,RolesGuard]},
  {path:'gestiontareas/:nombreservicio/:idusuario/:idservicio', component:GestionTareasComponent, canActivate: [AuthGuardGuard],canLoad:[AuthGuardGuard]},
  {path:'gestiontareas/:mes/:nombreservicio/:idusuario/:idservicio', component:GestionTareasComponent, canActivate: [AuthGuardGuard],canLoad:[AuthGuardGuard]},
  {path:'listado-servicios-all/:idEstado', component:ListadoServiciosContradadosAllComponent, canActivate: [AuthGuardGuard,RolesGuard],canLoad:[AuthGuardGuard]},
  {path:'contratar', component:ContratarServiciosComponent, canActivate: [AuthGuardGuard],canLoad:[AuthGuardGuard]},
  {path:'edit', component:EdicionTareasComponent, canActivate: [AuthGuardGuard],canLoad:[AuthGuardGuard]},
  {path:'documentos/:tarea/:usuario', component:VistaDocumentosComponent},
  {path:'listado-tareas-all/:idEstado', component:ListadoTareasAllComponent, canActivate: [AuthGuardGuard,RolesGuard],canLoad:[AuthGuardGuard]},
  {path:'conversacion/:idTarea/:idUsuario', component:ConversacionesComponent, canActivate: [AuthGuardGuard],canLoad:[AuthGuardGuard]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloServiciosRoutingModule { }
