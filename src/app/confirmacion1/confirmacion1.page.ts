import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmService } from '../servicios/fcm.service';

@Component({
  selector: 'app-confirmacion1',
  templateUrl: './confirmacion1.page.html',
  styleUrls: ['./confirmacion1.page.scss'],
})
export class Confirmacion1Page implements OnInit {
  gruponum = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, 'Borrar']
  cont = 0
  pin = ""
  usuario: any = []
  cobrador: any = []
  monto: any
  detalle: any
  fecha: Date
  fechita: any
  cajaactual: number
  cajaactual1: any
  cajainterna: number
  cajainterna1: any
  ruta = (['/ingresoegreso'])
  constructor(private modal: ModalController,
    private au: AuthService,
    public fire: AngularFirestore,
    private fcm: FcmService) { }

  ngOnInit() {
  }

  closeUsuario() {
    this.modal.dismiss()
  }

  // funcion transerencia//
  transferencia(pin) {
    if (parseFloat(this.usuario.cajainterna) >= this.monto) {
      this.fecha = new Date();
      const mes = this.fecha.getMonth() + 1;
      this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
      if (this.monto <= 0) {
        this.au.ingresoinvalido()
      } else {
        if (pin == this.usuario.password) {
          this.cajaactual = parseFloat(this.cobrador.cajainterna) + this.monto;
          this.cajaactual1 = this.cajaactual.toFixed(2)
          this.au.actualizacaja({ cajainterna: this.cajaactual1 }, this.cobrador.uid);
          this.fire.collection('/user/' + this.cobrador.uid + '/ingresos').add({
            monto: this.monto,
            id: this.usuario.uid,
            nombre: this.usuario.nombre,
            telefono: this.usuario.telefono,
            fechita: this.fechita,
            fecha: this.fecha,
            descripcion: 'transferencia',
            saldo: this.cajaactual1,
            identificador: '1'
          })
          this.cajainterna = parseFloat(this.usuario.cajainterna) - this.monto;
          this.cajainterna1 = this.cajainterna.toFixed(2)
          this.au.actualizacaja({ cajainterna: this.cajainterna1 }, this.usuario.uid)
          this.fire.collection('/user/' + this.usuario.uid + '/egreso').add({
            monto: this.monto,
            id: this.cobrador.uid,
            nombre: this.cobrador.nombre,// this.nombresito,
            telefono: this.cobrador.telefono,
            fechita: this.fechita,
            fecha: this.fecha,
            descripcion: 'transferencia',
            saldo: this.cajainterna1,
            identificador: '0'
          })
          this.fire.collection('/user/' + this.usuario.uid + '/cobrostransferencias').add({
            dato: 'enviatransferencia',
            monto: this.monto,
            detalle: this.detalle,
            clave: this.cobrador.uid,
            formatted: this.cobrador.nombre,//this.nombresito,
            telefono: this.cobrador.telefono,
            fechita: this.fechita,
            fecha: this.fecha,
            saldo: this.cajainterna1
          })
          this.fire.collection('/user/' + this.cobrador.uid + '/cobrostransferencias').add({
            dato: 'recibetransferencia',
            monto: this.monto,
            detalle: this.detalle,
            clave: this.usuario.uid,
            formatted: this.usuario.nombre,
            telefono: this.usuario.telefono,
            fechita: this.fechita,
            fecha: this.fecha,
            saldo: this.cajaactual1
          })
          this.au.transexitoso1(this.monto, this.cobrador.nombre); //this.nombresito);
          this.fcm.notificacionforToken("Fastgi", "Acaba de recibir una tranferencia de " + this.monto + "Bs. de " + this.usuario.nombre + " ", this.cobrador.token, this.usuario.uid, "/tabs/tab2")
          this.modal.dismiss();
          this.monto = ''
          this.detalle = ''
        } else {
          this.au.passincorrecta();
        }
      }
    } else {
      this.au.ahorroinsuficiente1(this.ruta);
      this.closeUsuario()
    }
  }
  

  presionar(num) {
    this.pin = this.pin + num
    if (num == 'Borrar') {
      this.pin = ""
    } if (num == '.') {
      this.cont = this.cont + 1
    } if (this.cont > 1) {
      this.pin = ""
      this.cont = 0
    }
  }
}
