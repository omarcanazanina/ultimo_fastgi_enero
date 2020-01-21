import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FcmService } from '../servicios/fcm.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {

  @ViewChild('input', { static: true }) myInput;
  public fecha: Date;
  constructor(public actionSheetController: ActionSheetController,
    private au: AuthService,
    public fire: AngularFirestore,
    public route: Router,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private fcm: FcmService
  ) {
  }
  uid: string;
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
  monto: any;
  telefono = null;
  fechita: any;
  cajaactual: number
  cajaactual1: any
  cajaresta: number
  cajaresta1: any
  real: number
  ruta=(['/ingresoegreso'])
  ngOnInit() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150)

    this.telefono = this.activatedRoute.snapshot.paramMap.get('phoneNumber');
    this.real = this.monto
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
      if (this.au.dos_decimales(this.monto) !== true) {
        this.au.ingresoinvalido()
      } else {
        if (parseInt(this.usuario.cajainterna) >= this.monto) {
          const alert = await this.alertController.create({
            header: 'Se pagara Bs.' + this.monto + ' a ' + this.contelefono.telefono,
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
                    this.au.actualizacaja({ cajainterna: this.cajaresta1 }, this.uu);
                    this.fire.collection('/user/' + this.uu + '/egreso').add({
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
          this.au.ahorroinsuficiente1(this.ruta)
        }
      }
    }
  }
}
