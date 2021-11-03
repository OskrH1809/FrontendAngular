import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from '../auth/services/auth-guard.guard';
import { RolesGuard } from '../auth/services/role-admin.guard';
import { RoleUserGuard } from '../auth/services/role-user.guard';
import { CardsComponent } from '../shared/components/cards/cards.component';
import { PanelAdministracionComponent } from '../shared/components/panel-administracion/panel-administracion.component';
import { ServicioComponent } from '../shared/components/servicio/servicio.component';
import { ServiciosComponent } from '../shared/components/servicios/servicios.component';

const routes: Routes = [
  {path:'servicio/:id', component:ServicioComponent, canActivate: [AuthGuardGuard],canLoad:[AuthGuardGuard]},
  {path:'cards', component:CardsComponent, canActivate: [AuthGuardGuard,RoleUserGuard] },
  {path:'servicios/:id', component:ServiciosComponent},
  {path:'panel', component:PanelAdministracionComponent, canActivate: [AuthGuardGuard,RolesGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloServicioContratadoRoutingModule { }
