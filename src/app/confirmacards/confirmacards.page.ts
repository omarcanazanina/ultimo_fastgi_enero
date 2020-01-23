import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmService } from '../servicios/fcm.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-confirmacards',
  templateUrl: './confirmacards.page.html',
  styleUrls: ['./confirmacards.page.scss'],
})
export class ConfirmacardsPage implements OnInit {
  //datos enviados desde cardss
  usuario: any = []
  contelefono: any = []
  monto: any
  //para el teclado numerico
  gruponum = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, 'Borrar']
  cont = 0
  pin = ""
  //datos para la transaccion
  cajaactual: number
  cajaactual1: any
  cajaresta: number
  cajaresta1: any
  //para recuperar la fecha
  fecha: Date;
  fechita: any;
  constructor(private au: AuthService,
    public fire: AngularFirestore,
    private fcm: FcmService,
    public route: Router,
    private modal: ModalController,
    public alertController: AlertController) { }

  ngOnInit() {

  }
  closeUsuario() {
    this.modal.dismiss()
  }
  async pagar(pin) {
    this.fecha = new Date();
    const mes = this.fecha.getMonth() + 1;
    this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
      if (pin == this.usuario.password) {
        this.cajaactual = parseFloat(this.contelefono.cajainterna) + parseFloat(this.monto);
        this.cajaactual1 = this.cajaactual.toFixed(2)
        this.au.actualizacaja({ cajainterna: this.cajaactual1 }, this.contelefono.uid);
        this.fire.collection('/user/' + this.contelefono.uid + '/ingresos').add({
          monto: this.monto,
          fecha: this.fecha,
          fechita: this.fechita,
          descripcion: 'pago',
          id: this.usuario.uid,
          nombre: this.usuario.nombre,
          telefono: this.usuario.telefono,
          identificador: '1',
          saldo: this.cajaactual
        })
        this.cajaresta = parseFloat(this.usuario.cajainterna) - parseFloat(this.monto);
        this.cajaresta1 = this.cajaresta.toFixed(2)
        this.au.actualizacaja({ cajainterna: this.cajaresta1 }, this.usuario.uid);
        this.fire.collection('/user/' + this.usuario.uid + '/egreso').add({
          monto: this.monto,
          id: this.contelefono.uid,
          nombre: this.contelefono.nombre,
          telefono: this.contelefono.telefono,
          fecha: this.fecha,
          fechita: this.fechita,
          descripcion: 'pago',
          saldo: this.cajaresta,
          identificador: '0'
        })
        this.au.presentToast(this.monto, this.contelefono.telefono);
        this.fcm.notificacionforToken("Fastgi", " Acaba de recibir el pago de " + this.monto + "Bs. de " + this.usuario.telefono + " ", this.contelefono.token, this.usuario.uid, "/tabs/tab2")
        this.closeUsuario()
        this.route.navigate(['tabs/tab2'])
      } else {
        this.au.passincorrecta();
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
