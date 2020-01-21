import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertController, IonContent } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ModalController } from '@ionic/angular'
import { DetalleenviocobroPage } from '../detalleenviocobro/detalleenviocobro.page'
import { FcmService } from '../servicios/fcm.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Confirmacion1Page } from '../confirmacion1/confirmacion1.page';
import { ConfirmarpagoPage } from '../confirmarpago/confirmarpago.page';

@Component({
  selector: 'app-pagarenviocobro',
  templateUrl: './pagarenviocobro.page.html',
  styleUrls: ['./pagarenviocobro.page.scss'],
})
export class PagarenviocobroPage implements OnInit {
  idcobro = null;
  estado = true
  uu: any
  cobro: any = []
  usuario = {
    nombre: "",
    cajainterna: "",
    uid: "",
    password: "",
    telefono: "",
  }
  idcobrador: any
  cobrador: any = []
  cajaactual: number
  cajaactual1: any
      fecha: Date
      fechita: any
  cajainterna: number
  cajainterna1: any
  prueba1: any = []
  cobros: any = []
  recupera: any = []
  actual: any = []
  trans: any = []
  unidos: any[]

  numero = null
  nombresito = null
  caja: number
  caja1: any
  monto
  detalle

  //
  numerosincodigo
  //
     ruta=(['/ingresoegreso'])

  dato='omarorafa'
  @ViewChild("content", { static: true }) content: IonContent
  constructor(private activatedRoute: ActivatedRoute,
    private au: AuthService,
    public alertController: AlertController,
    public fire: AngularFirestore,
    public router: Router,
    public modal: ModalController,
    private fcm: FcmService,
    public route: Router,
    public modalController: ModalController,
    private localNotifications: LocalNotifications) {
  }
  callFunction(es) {
    if (es) {
      this.content.scrollToBottom(2000);
    }
  }
  ngOnInit() {
    this.numero = this.activatedRoute.snapshot.paramMap.get('id')
    this.nombresito = this.activatedRoute.snapshot.paramMap.get('nombre')
    //quitamos el codigo +591
    this.numerosincodigo = this.numero.replace("+591", "").trim()
    this.au.verificausuarioActivo(this.numerosincodigo).subscribe(cont => {
      this.cobrador = cont[0]
      this.uu = this.au.pruebita();
      this.au.recuperaundato(this.uu).subscribe(usuario => {
        this.usuario = usuario;
        this.caja = parseFloat(this.usuario.cajainterna)
        this.caja1 = this.caja.toFixed(2)
        this.au.recuperacobrostransferencias(this.cobrador.uid, this.usuario.uid).subscribe(dat => {
          this.trans = dat
          this.actual = this.au.ordenarjson(this.trans, 'fecha', 'asc')
        })
      })
    })
  }
//funcion pagar deuda
 //async pagar(usu) {
 //  if (parseInt(this.usuario.password) == 0) {
 //    const alert = await this.alertController.create({
 //      header: 'Muy importante!',
 //      subHeader: 'Debe ingresar su PIN para realizar todas las transacciones El CORREO para enviar sus datos para que pueda guardarlo',
 //      backdropDismiss: false,
 //      inputs: [
 //        {
 //          name: 'pin',
 //          type: 'number',
 //          placeholder: 'Pin'
 //        },
 //        {
 //          name: 'correo',
 //          type: 'text',
 //          placeholder: 'Correo'
 //        }
 //      ],
 //      buttons: [
 //        {
 //          text: 'Cancelar',
 //          role: 'cancel',
 //          cssClass: 'secondary',
 //          handler: () => {
 //            console.log('Confirm Cancel');
 //          }
 //        }, {
 //          text: 'Aceptar',
 //          handler: data => {
 //            console.log('Confirm Ok');
 //            this.au.registrapin({ password: data.pin }, this.uu);
 //            this.au.registracorreo({ correo: data.correo }, this.uu);
 //            this.au.datosgmail(data.pin, data.correo, this.usuario.telefono)
 //          }
 //        }
 //      ]
 //    });
 //    await alert.present();
 //  } else {
 //    if (parseFloat(this.usuario.cajainterna) >= parseFloat(usu.monto)) {
 //      const alert = await this.alertController.create({
 //        header: 'Monto a pagar ' + ' ' + usu.monto + ' ' + 'Bs.',
 //        cssClass: 'prompt_alert',
 //        inputs: [
 //          {
 //            name: 'codigo',
 //            type: 'tel',
 //            placeholder: 'Pin de seguridad'

 //          },
 //        ],
 //        buttons: [
 //          {
 //            text: 'Cancelar',
 //            role: 'cancel',
 //            cssClass: 'secondary',
 //            handler: () => {
 //              console.log('Confirm Cancel');
 //            }
 //          }, {
 //            text: 'Confirmar',
 //            handler: data => {
 //             this.fecha = new Date();
 //             const mes = this.fecha.getMonth() + 1;
 //             this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();

 //             this.au.recuperaenviocobros(this.usuario.uid, this.cobrador.uid, usu.fechita).subscribe(dat => {
 //               let prueba11 = dat[0]
 //               this.au.agregafechapagocobros({ fechapago: this.fechita }, this.uu, usu.id)
 //               this.au.agregafechapagocobros({ fechapago: this.fechita }, this.cobrador.uid, prueba11.id)
 //               this.au.actualizaestadodecobro({ estado: 1 }, this.cobrador.uid, prueba11.id)
 //             })
 //             if (data.codigo == this.usuario.password) {
 //               this.cajaactual = parseFloat(this.usuario.cajainterna) - parseFloat(usu.monto);
 //               this.cajaactual1 = this.cajaactual.toFixed(2)
 //               this.au.actualizacaja({ cajainterna: this.cajaactual1 }, this.usuario.uid);
 //               this.au.actualizaestadodecobro({ estado: 1 }, this.usuario.uid, usu.id)
 //               this.fire.collection('/user/' + this.usuario.uid + '/egreso').add({
 //                 monto: usu.monto,
 //                 id: this.cobrador.uid,
 //                 nombre: this.nombresito,
 //                 telefono: this.cobrador.telefono,
 //                 fechita: this.fechita,
 //                 fecha: this.fecha,
 //                 descripcion: 'pago por envio de cobro',
 //                 saldo: this.cajaactual1,
 //                 identificador: '0'
 //               })
 //                this.cajainterna = parseFloat(this.cobrador.cajainterna) + parseFloat(usu.monto);
 //                this.cajainterna1 = this.cajainterna.toFixed(2)
 //                this.au.actualizacaja({ cajainterna: this.cajainterna }, this.cobrador.uid)
 //             this.fire.collection('/user/' + this.cobrador.uid + '/ingresos').add({
 //               monto: usu.monto,
 //               id: this.usuario.uid,
 //               nombre: this.usuario.nombre,
 //               telefono: this.usuario.telefono,
 //               fechita: this.fechita,
 //               fecha: this.fecha,
 //               descripcion: 'recibio por envio de cobro',
 //               saldo: this.cajainterna1,
 //               identificador: '1'
 //             })
 //                this.au.pagodecobroexitoso(usu.monto, this.nombresito);
 //                this.estado = true
 //              } else {
 //                this.au.passincorrecta();
 //              }
 //            }
 //          }
 //        ]
 //      });
 //      await alert.present();
 //    } else {
 //      this.au.ahorroinsuficiente1(this.ruta);
 //    }
 //  }
 //}

//abrir detalle del cobro a apgar
  opendetalle(usu) {
    this.modal.create({
      component: DetalleenviocobroPage,
      cssClass: 'detalleenviocobro',
      componentProps: {
        usu: usu
      }
    }).then((modal) => modal.present())
  }

//async transferencia(monto, detalle) {
//  if (parseInt(this.usuario.password) == 0) {
//    const alert = await this.alertController.create({
//      header: 'Muy importante!',
//      subHeader: 'Debe ingresar su PIN para realizar todas las transacciones El CORREO para enviar sus datos para que pueda guardarlo',
//      backdropDismiss: false,
//      inputs: [
//        {
//          name: 'pin',
//          type: 'number',
//          placeholder: 'Pin'
//        },
//        {
//          name: 'correo',
//          type: 'text',
//          placeholder: 'Correo'
//        }
//      ],
//      buttons: [
//        {
//          text: 'Cancelar',
//          role: 'cancel',
//          cssClass: 'secondary',
//          handler: () => {
//            console.log('Confirm Cancel');
//          }
//        }, {
//          text: 'Aceptar',
//          handler: data => {
//            console.log('Confirm Ok');
//            this.au.registrapin({ password: data.pin }, this.uu);
//            this.au.registracorreo({ correo: data.correo }, this.uu);
//            this.au.datosgmail(data.pin, data.correo, this.usuario.telefono)
//          }
//        }
//      ]
//    });
//    await alert.present();
//  } else {
//  // if (monto <= 0) {
//  //   this.au.ingresoinvalido()
//  // } else {
//  //   if (parseFloat(this.usuario.cajainterna) >= monto) {
//  //     const alert = await this.alertController.create({
//  //       header: 'Monto a transferir' + ' ' + monto + ' ' + 'Bs. a ' + this.nombresito,
//  //       cssClass: 'prompt_alert',
//  //       backdropDismiss: false,
//  //       inputs: [
//  //         {
//  //           name: 'codigo',
//  //           type: 'tel',
//  //           placeholder: 'Pin de seguridad'
//  //         },
//  //       ],
//  //       buttons: [
//  //         {
//  //           text: 'Cancelar',
//  //           role: 'cancel',
//  //           cssClass: 'secondary',
//  //           handler: () => {
//  //             console.log('Confirm Cancel');
//  //           }
//  //         }, {
//  //           text: 'Confirmar',
//  //           handler: data => {
//  //            //this.fecha = new Date();
//  //            //const mes = this.fecha.getMonth() + 1;
//  //            //this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
//
//  //            // if (data.codigo == this.usuario.password) {
//  //            //   this.cajaactual = parseFloat(this.cobrador.cajainterna) + monto;
//  //            //   this.cajaactual1 = this.cajaactual.toFixed(2)
//  //            //   this.au.actualizacaja({ cajainterna: this.cajaactual1 }, this.cobrador.uid);
//  //            //   this.fire.collection('/user/' + this.cobrador.uid + '/ingresos').add({
//  //            //     monto: monto,
//  //            //     id: this.usuario.uid,
//  //            //     nombre: this.usuario.nombre,
//  //            //     telefono: this.usuario.telefono,
//  //            //     fechita: this.fechita,
//  //            //     fecha: this.fecha,
//  //            //     descripcion: 'transferencia',
//  //            //     saldo: this.cajaactual1,
//  //            //     identificador: '1'
//  //            //   })
//  //            //   this.cajainterna = parseFloat(this.usuario.cajainterna) - monto;
//  //            //   this.cajainterna1 = this.cajainterna.toFixed(2)
//  //            //   this.au.actualizacaja({ cajainterna: this.cajainterna1 }, this.usuario.uid)
//  //            //   this.fire.collection('/user/' + this.usuario.uid + '/egreso').add({
//  //            //     monto: monto,
//  //            //     id: this.cobrador.uid,
//  //            //     nombre: this.nombresito,
//  //            //     telefono: this.cobrador.telefono,
//  //            //     fechita: this.fechita,
//  //            //     fecha: this.fecha,
//  //            //     descripcion: 'transferencia',
//  //            //     saldo: this.cajainterna1,
//  //            //     identificador: '0'
//  //            //   })
//  //           ////
//  //            //   this.fire.collection('/user/' + this.usuario.uid + '/cobrostransferencias').add({
//  //            //     dato: 'enviatransferencia',
//  //            //     monto: monto,
//  //            //     detalle: detalle,
//  //            //     clave: this.cobrador.uid,
//  //            //     formatted: this.nombresito,
//  //            //     telefono: this.cobrador.telefono,
//  //            //     fechita: this.fechita,
//  //            //     fecha: this.fecha,
//  //            //     saldo: this.cajainterna1
//  //            //   })
//  //            //   this.fire.collection('/user/' + this.cobrador.uid + '/cobrostransferencias').add({
//  //            //     dato: 'recibetransferencia',
//  //            //     monto: monto,
//  //            //     detalle: detalle,
//  //            //     clave: this.usuario.uid,
//  //            //     formatted: this.usuario.nombre,
//  //            //     telefono: this.usuario.telefono,
//  //            //     fechita: this.fechita,
//  //            //     fecha: this.fecha,
//  //            //     saldo: this.cajaactual1
//
//  //            //   })
//  //            //   this.au.transexitoso1(monto, this.nombresito);
//  //            //   this.fcm.notificacionforToken("Fastgi", "Acaba de recibir una tranferencia de " + monto + "Bs. de " + this.usuario.nombre + " ", this.cobrador.token, this.usuario.uid, "/tabs/tab2")
//  //            //   this.modal.dismiss();
//  //            //   this.monto = ''
//  //            //   this.detalle = ''
//  //            // } else {
//  //            //   this.au.passincorrecta();
//  //            // }
//  //           }
//  //         }
//  //       ]
//  //     });
//  //     await alert.present();
//  //   } else {
//  //    this.au.ahorroinsuficiente1(this.ruta);
//
//  //   }
//  // }
//  }
//  //
//
//
//}

  enviacobro(monto, detalle) {
    this.fecha = new Date();
    const mes = this.fecha.getMonth() + 1;
    this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
    this.fire.collection('/user/' + this.usuario.uid + '/cobrostransferencias').add({
      monto: monto,
      dato: 'enviado',
      clave: this.cobrador.uid,
      formatted: this.nombresito,
      telefono: this.cobrador.telefono,
      fechita: this.fechita,
      fecha: this.fecha,
      fechapago: '',
      detalle: detalle,
      estado: 0
    })
    this.fire.collection('/user/' + this.cobrador.uid + '/cobrostransferencias').add({
      monto: monto,
      dato: 'recibio',
      clave: this.usuario.uid,
      formatted: this.usuario.nombre,
      telefono: this.usuario.telefono,
      fechita: this.fechita,
      fecha: this.fecha,
      fechapago: '',
      detalle: detalle,
      estado: 0
    })
    this.au.enviocobro(monto, this.nombresito)
    this.fcm.notificacionforToken("Fastgi", "Acaba de recibir una solicitud de pago de " + monto + "Bs. de " + this.usuario.nombre + " ", this.cobrador.token, this.usuario.uid, "/tabs/tab2")
    this.monto = ''
    this.detalle = ''
  }

  async pagar1(usu) {

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
    }else{
      if(parseFloat(this.usuario.cajainterna) >= parseFloat(usu.monto) ){
        const modal = await this.modalController.create({
          component: ConfirmarpagoPage,
          cssClass: 'confirmarpago',
          componentProps: {
            usu:usu,
            usuario: this.usuario,
            cobrador: this.cobrador,
          }
        });
        return await modal.present();
      }else{
        this.au.ahorroinsuficiente1(this.ruta);
      }
    } 
  }
  async confirmacion1(monto,detalle) {
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
    }else{
      if(monto <= 0 ){
        this.au.ingresoinvalido()
      }else{
        const modal = await this.modalController.create({
          component: Confirmacion1Page,
          cssClass: 'confirmacion1',
          componentProps: {
            usuario: this.usuario,
            cobrador: this.cobrador,
            monto: monto,
            detalle: detalle
          }
        });
         modal.present();
      }
    }
  }

}
