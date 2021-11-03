import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionClientesComponent } from '../shared/components/gestion-clientes/gestion-clientes.component';
import { LoginComponent } from '../auth/components/login/login.component';
import { RegistroComponent } from '../auth/components/registro/registro.component';
import { RecuperarContraComponent } from '../auth/components/recuperar-contra/recuperar-contra.component';
import { AuthGuardGuard } from '../auth/services/auth-guard.guard';
import { LogueadoGuard } from '../auth/services/logueado.guard';
import { PerfilComponent } from '../auth/components/perfil/perfil.component';
import { RolesGuard } from '../auth/services/role-admin.guard';
import { RegistroGuard } from '../auth/services/registro.guard';

const routes: Routes = [
  {path:'', component:LoginComponent,canActivate:[LogueadoGuard]},
  {path:'registro', component:RegistroComponent,canActivate:[RegistroGuard],},
  {path:'recuperar', component:RecuperarContraComponent,canActivate:[LogueadoGuard]},
  {path:'gestionclientes', component:GestionClientesComponent, canActivate: [AuthGuardGuard,RolesGuard],canLoad:[AuthGuardGuard,RolesGuard]},
  {path:'perfil', component:PerfilComponent,canActivate: [AuthGuardGuard],canLoad:[AuthGuardGuard]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloUsuariosRoutingModule { }
