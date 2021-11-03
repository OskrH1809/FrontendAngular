import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GestionUsuariosService } from 'src/app/auth/services/gestion-usuarios.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  role = this.gestionUsuario.role();
  username= this.gestionUsuario.username();
  constructor(private gestionUsuario:GestionUsuariosService,private router: Router, private gestion: GestionUsuariosService) { }

  token = localStorage.getItem('token');
  verificarAcceso = this.gestion.verificarAcceso()
  ngOnInit() {
    console.log(this.role)
  }

  logout() {
    this.gestion.logout();

  }

}

