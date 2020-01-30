import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertController, IonContent } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ModalController } from '@ionic/angular'
import { DetalleenviocobroPage } from '../detalleenviocobro/detalleenviocobro.page'
import { FcmService } from '../servicios/fcm.service';
import { Confirmacion1Page } from '../confirmacion1/confirmacion1.page';
import { ConfirmarpagoPage } from '../confirmarpago/confirmarpago.page';

@Component({
  selector: 'app-pagarenviocobro',
  templateUrl: './pagarenviocobro.page.html',
  styleUrls: ['./pagarenviocobro.page.scss'],
})
export class PagarenviocobroPage implements OnInit {
  @ViewChild('input', { static: true }) myInput;
  controladorteclado=0
  gruponum = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, 'v']
  cont1 = 0
  pin = ""
  estado = true
  uu: any
  //cobro: any = []
  usuario = {
    nombre: "",
    cajainterna: "",
    uid: "",
    password: "",
    telefono: "",
  }
  cobrador: any = []
  fecha: Date
  fechita: any
  actual: any = []
  trans: any = []
  numero = null
  nombresito = null
  caja: number
  caja1: any
  monto
  detalle
  numerosincodigo
  ruta=(['/ingresoegreso'])
  
  @ViewChild("content", { static: true }) content: IonContent
  constructor(private activatedRoute: ActivatedRoute,
    private au: AuthService,
    public alertController: AlertController,
    public fire: AngularFirestore,
    public router: Router,
    public modal: ModalController,
    private fcm: FcmService,
    public route: Router,
    public modalController: ModalController) {
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

  //funcion enviar cobro
  enviacobro( detalle) {
    this.fecha = new Date();
    const mes = this.fecha.getMonth() + 1;
    this.fechita = this.fecha.getDate() + "-" + mes + "-" + this.fecha.getFullYear() + " " + this.fecha.getHours() + ":" + this.fecha.getMinutes() + ":" + this.fecha.getSeconds();
    this.fire.collection('/user/' + this.usuario.uid + '/cobrostransferencias').add({
      monto: this.pin,
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
      monto: this.pin,
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
    this.au.enviocobro(this.pin, this.nombresito)
    this.fcm.notificacionforToken("Fastgi", "Acaba de recibir una solicitud de pago de " + this.pin + "Bs. de " + this.usuario.nombre + " ", this.cobrador.token, this.usuario.uid, "/tabs/tab2")
    this.monto = ''
    this.detalle = ''
  }
// funcion pagar deuda 
  async pagar1(usu) {
    if (parseInt(this.usuario.password) == 0) {
      this.au.enviocorreo1(this.usuario.uid,this.usuario.telefono)
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
// funcion hacer transferencia
  async confirmacion1(detalle) {
    if (parseInt(this.usuario.password) == 0) {
      this.au.enviocorreo1(this.usuario.uid,this.usuario.telefono)
    }else{
      if(parseFloat(this.pin) <= 0 ){
        this.au.ingresoinvalido()
      }else{
        if(parseFloat(this.usuario.cajainterna) >= parseFloat(this.pin)){
          const modal = await this.modalController.create({
            component: Confirmacion1Page,
            cssClass: 'confirmacion1',
            componentProps: {
              usuario_transferencia: this.usuario,
              cobrador_transferencia: this.cobrador,
              monto_transferencia: this.pin,
              detalle_transferencia: detalle
            }
          });
           modal.present();
        }else{
          this.au.ahorroinsuficiente1(this.ruta);
        }
     
      }
    }
  }

//para el teclado en campo monto
  teclado(){
    this.controladorteclado=1
  }
  presionar(num) {
    this.pin = this.pin + num
    if (num == 'v') {
      setTimeout(() => {
        this.myInput.setFocus();
      }, 150)
      this.controladorteclado=0
    } if (num == '.') {
      this.cont1 = this.cont1 + 1
    } if (this.cont1 > 1) {
      this.pin = ""
      this.cont1 = 0
    }
  }

  borrar(){
    this.pin=""
  }
  ok(){
    this.controladorteclado=0
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150)
  }

}
