import { Component, OnInit } from '@angular/core';
import {  AlertController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'
import { Router } from '@angular/router'
import { FCM } from '@ionic-native/fcm/ngx';

import * as firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase/ngx';
@Component({
  selector: 'app-index2',
  templateUrl: './index2.page.html',
  styleUrls: ['./index2.page.scss'],
})
export class Index2Page implements OnInit {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  constructor(private au: AuthService,
    public alertCtrl: AlertController,
    private fcm: FCM,
    private router: Router,
    //prueba sabado
    private fireBase: Firebase,
    
  ) { }
  //@ViewChild('focus', { static: true }) myInput;
  usuario = {
    uid: ""
  }

  correo: string;
  dato: string;
  pass: string;
  password_type: string = 'password';
  password: any
  con: string
  //registro numero
  existe: any
  //codtel =''
  //prueba de sabado
  verificationId = '';
  code = '';
  private uid: any ;
  showCodeInput = false;
  private numero: any;
  private phone: string;

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    })
    /* setTimeout(() => {
       this.myInput.setFocus();
     }, 150) */
  }

  /*
//prueba sabado
async PhoneLoginNative() {
  console.log('+591'+this.numero)
  if (this.numero){
  //  let load = this.au.loadinginicio();
      this.phone = '+591'+this.numero;
      this.fireBase.verifyPhoneNumber(this.phone, 60)

          .then((credential) => {
             this.verificationId = credential.verificationId;   FOR ANDROID    
             //this.verificationId = credential;   FOR IOS 


            load.then(loading => {
              loading.dismiss()
            })

              this.showCodeInput = true;
          }).catch((error) => {
          alert(error)
          console.error(error)
      });
  }
  else alert("Phone Number Cannot Be Empty")
}

*/

  //logueo
  logueo(codtel,phoneNumber) {
    let subs = this.au.verificausuarioexistente(phoneNumber.toString())
      .subscribe(resul => {
        this.existe = resul
        subs.unsubscribe();
        if (this.existe == '') {
          this.au.usuarionoexiste()
        } else {
          let load = this.au.loadinginicio();
          const appVerifier = this.recaptchaVerifier;
          const phoneNumberString = codtel + phoneNumber.toString();
          firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
            .then(async confirmationResult => {
              load.then(loading => {
                loading.dismiss()
              })
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
  }
}

/*
  //logueo pa cualquiera dato ocn
  verificar(dato) {
    const resultado = dato.indexOf('@', 0)
    if (resultado < 0) {
      //signIn(phoneNumber: number) {
      const appVerifier = this.recaptchaVerifier;
      const phoneNumberString = "+591" + dato;
      firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
        .then(async confirmationResult => {
          const alert = await this.alertCtrl.create({
            header: 'Ingrese codigo',
            inputs: [{ name: 'confirmationCode', placeholder: 'Codigo de confirmacion' }],
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
                    this.fauth.actualizatoken({ token: t }, result.user.uid).then(() => {
                      this.fauth.recuperaundato(result.user.uid).subscribe(usuario => {
                        this.usuario = usuario;
                        if (this.usuario.pass == this.pass) {
                          console.log('son iguales');
                          this.router.navigate(["/indexconfirmacion"])
                        } else {
                          console.log('se vino al else');
                          this.fauth.ingresoinvalido()
                        }
                      })
                    }).catch(error => {
                    })
                  }).catch(err => {
                  })
                      //
                }).catch((error) => {
                  console.log('este es el error' + error);
                  this.fauth.codigoinvalido()
                  // User couldn't sign in (bad verification code?)
                })
                }
              }
            ]
          });
          alert.present();
        })
        .catch(function (error) {
          alert('no se envio')
          console.error("SMS not sent", error);
        });
      //}
    } else {
      console.log('es correo');
      // login() {
      let load = this.presentLoading()
      this.fauth.login(dato, this.pass).then(res => {
        //console.log(JSON.stringify(res.user.uid))
        this.fcm.getToken().then(t => {
          this.fauth.actualizatoken({ token: t }, res.user.uid).then(() => {
            load.then(loading => {
              loading.dismiss()
            })

            //prueba trabajar aki
            //this.fauth.recuperaundato(res.user.uid).subscribe(dato=>{
             //alert(JSON.stringify(dato))
            //})
            //
            this.router.navigate(['/tabs/tab2']);
          }).catch(error => {
          })
        }).catch(err => {
        })
      }).catch(err => {
        console.log('tamos en el else login');
        load.then(loading => {
          loading.dismiss()
        })
        this.fauth.ingresoinvalido()
      });
      //}
    }
  }

togglePasswordMode() {
  this.password_type = this.password_type === 'text' ? 'password' : 'text';
}*/