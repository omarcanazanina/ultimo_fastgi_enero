import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'
import {  ActivatedRoute } from '@angular/router';
import { Confirmacion1Page } from '../confirmacion1/confirmacion1.page';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {

 // @ViewChild('input', { static: true }) myInput;
  
  fecha: Date;
  controladorteclado=1
  gruponum = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, 'v']
  cont = 0
  monto = ""
  constructor(public actionSheetController: ActionSheetController,
    private au: AuthService,
    private activatedRoute: ActivatedRoute,
    public modal: ModalController,
  ) {
  }
  usuario = {
    cajainterna: "",
    nombre: "",
    password: "",
    telefono: "",
    uid: ""
  }
  contelefono = {
    nombre: "",
    uid: "",
    telefono: "",
    pass: "",
    cajainterna: "",
    token: ""
  }
  uu: any;
  telefono = null;
  fechita: any;
  real: number
  ruta = (['/ingresoegreso'])
  ngOnInit() {
   // setTimeout(() => {
   //   this.myInput.setFocus();
   // }, 150)

    this.telefono = this.activatedRoute.snapshot.paramMap.get('phoneNumber');
    this.real = parseFloat(this.monto)
    this.uu = this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
    })
    this.au.verificausuarioexistente(this.telefono).subscribe(contelefono => {
      this.contelefono = contelefono[0]
    })

    this.fecha = new Date();
    const mes = this.fecha.getMonth() + 1;
    this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
  }

  async confirmapago(monto) {
    if (parseInt(this.usuario.password) == 0) {
     this.au.enviocorreo1(this.usuario.uid,this.usuario.telefono)
    } else {
        if (parseFloat(this.usuario.cajainterna) >= parseFloat(monto)) {
          this.modal.create({
            component: Confirmacion1Page,
            //cssClass: 'detalleenviocobro',
            componentProps: {
              usuario_sinmonto: this.usuario,
              contelefono_sinmonto: this.contelefono,
              monto_sinmonto: monto
            }
          }).then((modal) => modal.present())
        } else {
          this.au.ahorroinsuficiente1(this.ruta)
        }
    }
  }

  //funciones para el teclado
  presionar(num) {
    this.monto = this.monto + num
    if (num == 'v') {
      this.borrar()
      this.controladorteclado=0
    } if (num == '.') {
      this.cont = this.cont + 1
    } if (this.cont > 1) {
      this.monto = ""
      this.cont = 0
    }
  }
  borrar() {
    this.monto=this.monto.substring(0,this.monto.length-1)
  }
  label() {
    this.controladorteclado = 1
  }
  
}
