import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { FcmService } from '../servicios/fcm.service';

@Component({
  selector: 'app-confirmapagomonto',
  templateUrl: './confirmapagomonto.page.html',
  styleUrls: ['./confirmapagomonto.page.scss'],
})
export class ConfirmapagomontoPage implements OnInit {
//para el teclado
gruponum = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, 'v']    
pin=""
cont = 0
//datos enviados desde escaner
usuario:any =[]
contelefono :any =[]
monto:any
//datos de la pantalla
cajaactual: number;
cajaactual1: any
cajaresta: number;
cajaresta1: any
real: number;
fecha: Date;
fechita: any;
  constructor(public modal: ModalController,
    private au: AuthService,
    public fire: AngularFirestore,
    public route: Router,
    private fcm: FcmService) { }

  ngOnInit() {
    //alert(JSON.stringify(this.usuario)),
    //alert(JSON.stringify(this.contelefono)),
    //alert(this.monto)
    this.real = parseFloat(this.monto)
  }
  closeUsuario() {
    this.modal.dismiss()
  }
  pagardeuda(pin){
    this.fecha = new Date();
    const mes = this.fecha.getMonth() + 1;
    this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
  
    if (pin == this.usuario.password) {
      this.cajaactual = parseFloat(this.contelefono.cajainterna) +this.real;
      this.cajaactual1 = this.cajaactual.toFixed(2)
      this.au.actualizacaja({ cajainterna: this.cajaactual1 }, this.contelefono.uid);
      this.fire.collection('/user/' + this.contelefono.uid + '/ingresos').add({
        monto: this.real,
        id: this.usuario.uid,
        nombre: this.usuario.nombre,
        telefono: this.usuario.telefono,
        fechita: this.fechita,
        fecha: this.fecha,
        descripcion: 'pago por lectura',
        saldo: this.cajaactual,
        identificador: '1'
      })
      this.cajaresta = parseFloat(this.usuario.cajainterna) - this.real;
      this.cajaresta1 = this.cajaresta.toFixed(2)
      this.au.actualizacaja({ cajainterna: this.cajaresta1 }, this.usuario.uid);
      this.fire.collection('/user/' + this.usuario.uid + '/egreso').add({
        monto: this.real,
        id: this.contelefono.uid,
        nombre: this.contelefono.nombre,
        telefono: this.contelefono.telefono,
        fechita: this.fechita,
        fecha: this.fecha,
        descripcion: 'pago por lectura',
        saldo: this.cajaresta,
        identificador: '0'
      })
      this.au.presentToast(this.real, this.contelefono.telefono);
      this.fcm.notificacionforToken("Fastgi", " prueba scan Acaba de recibir el pago de  " + this.real + "Bs. de " + this.usuario.nombre + " ", this.contelefono.token, this.usuario.uid, "/tabs/tab2")
      this.closeUsuario()
      this.route.navigate(['tabs/tab2'])
    }
    else {
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
