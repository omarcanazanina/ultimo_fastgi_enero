import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { AlertController, NavController, LoadingController, Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'src/app/servicios/auth.service';
import { FCM } from '@ionic-native/fcm/ngx';
@Component({
  selector: 'app-telefono',
  templateUrl: './telefono.page.html',
  styleUrls: ['./telefono.page.scss'],
})
export class TelefonoPage implements OnInit {
  nombre = ''
  email = ''
  contrasena = ''
  pin = 0
  cajainterna = 0
  estado = 0
  control = 0
  eltoken: any
  phoneNumber: any
  //ahora
  datos: any
  //
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  constructor(private route: Router,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public fire: AngularFirestore,
    public au: AuthService,
    private loadingController: LoadingController,
    private fcm: FCM, private nav: NavController,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container1', {
      'size': 'invisible'
    })

  }
  //REVISAR
  // registrar usuario
  registrar(codtel,phoneNumber) {
    let verifi = this.au.verificausuarioexistente(phoneNumber.toString()).subscribe(usu => {
      this.datos = usu
      verifi.unsubscribe()
      if (this.datos != '') {
        this.au.usuarioyaexiste()
      } else {
        let load = this.au.loadinginicio();
        const appVerifier1 = this.recaptchaVerifier;
        const phoneNumberString = codtel + phoneNumber.toString();
        const phoneNumber1 = phoneNumber.toString();
        firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier1)
          .then(async confirmationResult => {
            load.then(loading => {
              loading.dismiss()
            })
            const alert = await this.alertCtrl.create({
              header: 'Ingrese codigo',
              inputs: [{ name: 'confirmationCode', placeholder: 'Codigo de confirmacion registrarse' }],
              backdropDismiss: false,
              buttons: [
                {
                  text: 'Cancelar',
                  handler: data => { console.log('Cancel clicked'); }
                },
                {
                  text: 'Enviar',
                  handler: data => {
                    confirmationResult.confirm(data.confirmationCode)
                      .then((result) => {
                        let load = this.au.loadinginicio();
                        this.fcm.getToken().then(token => {
                          this.au.crearcontel(result.user.uid, this.email, this.pin, this.nombre, codtel, phoneNumber1, this.cajainterna, token, this.estado)
                          this.au.creocorrecto();
                          load.then(loading => {
                            loading.dismiss()
                          })
                          this.route.navigate(['/tabs/tab2']);
                        })
                      }).catch((error) => {
                        this.au.codigoinvalido()
                        // User couldn't sign in (bad verification code?)
                      })
                  }
                }
              ]
            });
            alert.present();
          })
          .catch(function (error) {
            alert('no se envio el sms desde el registro')
            console.error("SMS not sent", error);
            alert(error)
          });
      }
    })
  }


  /*
    registroemail(){
      this.fcm.getToken().then(token => {
        console.log('nombre'+this.nombre+ 'email'+this.email + 'contraseña' +this.contrasena + 'pin' + this.pin);    
        console.log('telefono'+ this.phoneNumber);
       
        this.au.crear(this.email,this.contrasena,this.pin,this.nombre,this.phoneNumber,this.cajainterna,this.estado)
        this.au.creocorrecto();
        this.route.navigate(['/indexconfirmacion']) 
        //this.eltoken=token
        //this.au.confirmatelefono(phoneNumberString1)
      }).catch((error) => {
        console.log('este es el error' + error);
      })
    }
    
    
    //pantalla verificar numero anterior
    verificar(phoneNumber:number){
      this.fcm.getToken().then(token => {
        const phoneNumberString1 = phoneNumber.toString()
        this.au.crear(this.email,this.contrasena,this.pin,this.nombre,phoneNumberString1,this.cajainterna,token,this.estado)
        //this.au.creocorrecto();
        this.eltoken=token
        //this.au.confirmatelefono(phoneNumberString1)
        this.nav.navigateRoot(['/confirmarnum',this.eltoken,phoneNumberString1])
      })
    }*/
}
