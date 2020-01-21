import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { LoadingController, AlertController } from '@ionic/angular';
//import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { FcmService } from '../servicios/fcm.service';
import { AuthService } from '../servicios/auth.service';
//import { firebaseConfig } from '../app.module';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})

export class IndexPage implements OnInit {
  
  constructor(public db: AngularFireDatabase,
    private loadingController: LoadingController,
    // private googlePlus:GooglePlus,
    private route: Router,
    private au: AuthService,
    private fcm: FcmService,
    public alertCtrl: AlertController,
    private Platform:Platform,
    private router: Router

  ) { }
  //registro numero
  existe: any
  usuario = {
    uid: ""
  }
  nombre = ''
  email = ''
  contrasena = ''
  pin = 0
  cajainterna = 0
  estado = 0
  phoneNumber
  result='ShFT2jNNpadqJXA2jYevAoZM1sH2'
  ngOnInit() {

  }

  //logueo
  logueo() {
    if (this.Platform.is('ios')) {
      alert('es ios')
      this.au.recuperaundato('ShFT2jNNpadqJXA2jYevAoZM1sH2').subscribe(usuario => {
        this.usuario = usuario;
        this.router.navigate(["/tabs/tab2"])
      })
  
    }else{
      this.route.navigate(['/index2'])
    
    }
    
/*
    alert('entro al logueo conel nro ' + this.phoneNumber)
    this.au.verificausuarioActivo(this.phoneNumber).subscribe(recuperado => {
      this.existe = recuperado
      if (this.existe == '') {
        this.au.usuarionoexiste()
      } else {
        const appVerifier = this.recaptchaVerifier;
        const phoneNumberString = "+591" + this.phoneNumber;
        firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
          .then(async confirmationResult => {
            const alert = await this.alertCtrl.create({
              header: 'Ingrese codigo',
              inputs: [{ name: 'confirmationCode', placeholder: 'Codigo de confirmacion login' }],
              backdropDismiss: false,
              buttons: [
                {
                  text: 'Cancelar',
                  handler: data => { console.log('Cancel clicked'); }
                },
                {
                  text: 'Enviar',
                  handler: data => {
                    confirmationResult.confirm(data.confirmationCode).then((result) => {
                      this.fcm.getToken().then(t => {
                        this.au.actualizatoken({ token: t }, result.user.uid).then(() => {
                          this.au.recuperaundato(result.user.uid).subscribe(usuario => {
                            this.usuario = usuario;
                            this.router.navigate(["/tabs/tab2"])
                          })
                        }).catch(error => {
                        })
                      }).catch(err => {
                      })

                    }).catch((error) => {
                      console.log('este es el error' + error);
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
            alert('no se envio sms desde el logueo')
            console.error("SMS not sent", error);
          });
      }
    })
    */
  }

  //registrarse
  registro() {
    this.route.navigate(['/telefono'])
    /*
    alert('entro al registro con el nro ' +phoneNumber)
    const appVerifier1 = this.recaptchaVerifier;
    const phoneNumberString = "+591" + phoneNumber;
    const phoneNumber1 = phoneNumber.toString();
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier1)
      .then(async confirmationResult => {
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
                    let load = this.presentLoading();
                    this.fcm.getToken().then(token => {
                      this.au.crearcontel(result.user.uid, this.email, this.pin, this.nombre, phoneNumber1, this.cajainterna, token, this.estado)
                      this.au.creocorrecto();
                      load.then(loading => {
                        loading.dismiss()
                      })
                      this.route.navigate(['/indexconfirmacion']);
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
      */
  }

  
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Guardando"
    });
    await loading.present();
    return loading
  }


  /*
     //FUNCIONES DE LOGUEO PON GOOGLE
     async doGoogleLogin(){
      const loading = await this.loadingController.create({
        message: 'Espera porfavor...'
      });
      this.presentLoadin(loading);
      this.googlePlus.login({
        'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': "558881935841-6u48b95j7jehggjblbt7kdm93srvchce.apps.googleusercontent.com", // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        })
        .then(user => {
          //save user data on the native storage
          loading.dismiss();
          this.route.navigate(['/password',user.displayName,user.email])
        }, err => {
          alert(JSON.stringify(err))
          loading.dismiss();
        })
    }
  */
}
