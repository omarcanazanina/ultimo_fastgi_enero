import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { FcmService } from '../servicios/fcm.service';


@Component({
  selector: 'app-escaner',
  templateUrl: './escaner.page.html',
  styleUrls: ['./escaner.page.scss'],
})
export class EscanerPage implements OnInit {
  public fecha: Date;
  monto = null;
  telefono = null;
  constructor(private activatedRoute: ActivatedRoute,
    private au: AuthService,
    public alertController: AlertController,
    public fire: AngularFirestore,
    public route: Router,
    private fcm: FcmService) { }
  uu: any;
  usuario = {
    cajainterna: "",
    nombre: "",
    password: "",
    uid: "",
    telefono: ""
  }
  contelefono = {
    nombre: "",
    uid: "",
    telefono: "",
    cajainterna: "",
    token: ""
  }
  fechita: any;
  cajaactual: number;
  cajaactual1: any
  cajaresta: number;
  cajaresta1: any
  real: number;
  ngOnInit() {
    this.monto = this.activatedRoute.snapshot.paramMap.get('monto');
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

  async pagar() {
    if (parseInt(this.usuario.password) == 0) {
      const alert = await this.alertController.create({
        header: 'Muy importante!',
        subHeader: 'Debe ingresar su PIN para realizar todas las transacciones El CORREO para enviar sus datos para que pueda guardarlo',
        backdropDismiss: false,
        inputs: [
          {
            name: 'pin',
            type: 'number',
            placeholder: 'Pin'
          },
          {
            name: 'correo',
            type: 'text',
            placeholder: 'Correo'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Aceptar',
            handler: data => {
              console.log('Confirm Ok');
              this.au.registrapin({ password: data.pin }, this.uu);
              this.au.registracorreo({ correo: data.correo }, this.uu);
              this.au.datosgmail(data.pin, data.correo, this.usuario.telefono)
            }
          }
        ]
      });
      await alert.present();
    } else {
      if (parseFloat(this.usuario.cajainterna) >= this.real) {
        const alert = await this.alertController.create({
          header: 'Se pagara Bs. ' + this.monto + ' a ' + this.contelefono.telefono,
          inputs: [
            {
              name: 'codigo',
              type: 'tel',
              placeholder: 'PIN de Seguridad'
            },
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Confirmar',
              handler: data => {
                if (data.codigo == this.usuario.password) {
                  this.cajaactual = parseFloat(this.contelefono.cajainterna) + this.real;
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
                  this.au.actualizacaja({ cajainterna: this.cajaresta1 }, this.uu);
                  this.fire.collection('/user/' + this.uu + '/egreso').add({
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
                  this.route.navigate(['tabs/tab2'])
                }
                else {
                  this.au.passincorrecta();
                }
              }
            }
          ]
        });
        await alert.present();
      } else {
        this.au.ahorroinsuficiente()
      }
    }
  }
}
