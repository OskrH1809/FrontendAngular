import { CardsComponent } from './shared/components/cards/cards.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TextoEditorComponent } from './components/texto-editor/texto-editor.component';
import { DashboardComponent } from './views/components/dashboard/dashboard.component';
import { ClientesDeServicioComponent } from './shared/components/clientes-de-servicio/clientes-de-servicio.component';
import { ServiciosComponent } from './shared/components/servicios/servicios.component';

const routes: Routes = [

  {path:'editor', component:TextoEditorComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'clientes/:idservicio/:nombreservicio', component:ClientesDeServicioComponent},
  {path:'**',pathMatch:'full',redirectTo:''},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
