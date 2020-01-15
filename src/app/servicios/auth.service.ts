import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastController, AlertController, NavController, LoadingController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


export interface usu {
  cuenta: string;
  numerito: string,
  correo: string,
  nombre: string,
  id: string,
  telefono: string,
  cajabancaria: number,
  cajainterna: number,
  monto: number,
  clave: string,
//  badge:number
}
export interface actualizado {
  id: string
  nombre: string
}
export interface cont {
  numero: string
  id: string
}
export interface ingresos {
  id: string,
  descripcion: string,
  fecha: string,
  monto: number,
  saldo: number,
  nombre: string
}
export interface transferencias {
  id: string,
  clave: string,
  dato: string,
  detalle: string,
  fecha: string,
  fechita: string,
  monto: number,
  nombre: string,
  saldo: number,
  telefono: string
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public tran: any;
  public datito: any = [];
  public uid: any;
  database: any;
  nombre: any;
  id_cajaapp = 'ZRyippkKqJIiL1Ha5PR9';
  ingresoscollection: AngularFirestoreCollection<ingresos>;
  ingresos: Observable<ingresos[]>;
  ingresosDoc: AngularFirestoreDocument<ingresos>;
  abcs: any
  constructor(
    private db: AngularFireAuth,
    private route: Router,
    public fire: AngularFirestore,
    public abase: AngularFireDatabase,
    public toastController: ToastController,
    public alertController: AlertController,
    public nav:NavController,
    private emailComposer: EmailComposer,
    private loadingController: LoadingController
  ) { }


  login(dato: string, pass: string): Promise<any> {
    return new Promise((resolve, rejected) => {
      this.db.auth.signInWithEmailAndPassword(dato, pass).then(usuario => {
        const id = usuario.user.uid;
        const email = usuario.user.email;
        this.datito.push(email);
        resolve(usuario);
      }).catch(err => rejected(err));
    })
  }

  logintel(numero,appverifica):Promise<any>{
    return new Promise((resolve,reject) =>{
      this.db.auth.signInWithPhoneNumber(numero,appverifica).then(user =>{
        console.log(user);
      }).catch((error) => {
        console.log(error);
      });
    })
  }
 //verifica si el usuario existe 
 verificausuarioexistente(telefono): Observable<any> {
  var query = ref => ref.where('telefono', '==', telefono)
  return this.fire.collection('user', query).valueChanges()
}


  async usuarionoexiste() {
    const alert = await this.alertController.create({
      header: 'Registrese!',
      message: 'Usuario inexistente, registrese por favor',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.route.navigate(['/telefono'])
          }
        }
      ]
    });
    await alert.present();
  }

  async usuarioyaexiste() {
    const alert = await this.alertController.create({
      header: 'Registrese!',
      message: 'Usuario ya registrado, ingrese por favor',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.route.navigate(['/index2'])
          }
        }
      ]
    });
    await alert.present();
  }


  async usuarionoexiste1() {
    const alert = await this.alertController.create({
      header: 'Registrese',
      // subHeader: 'Envio Exitoso',
      message: 'Usuario inexistente primero registrese por favor.',
      buttons: ['Aceptar']

    });
    await alert.present();
  }

  //para recuperar el logueado
  pruebita() {
    var user = this.db.auth.currentUser;
    var email, uid;
    if (user != null) {
      email = user.email;
      uid = user.uid;
      return user.uid;
    }
  }
  //solo sirve para pantalla *registrate*
  crear1(correo: string, pass: string, confirmpass: string, password: number, nombre: string, telefono: string, cajainterna: number, token: string) {
    return new Promise((resolve, reject) => {
      this.db.auth.createUserWithEmailAndPassword(correo, pass).then(res => {
        const uid = res.user.uid;
        this.fire.collection('user').doc(uid).set({
          correo: correo,
          nombre: nombre,
          pass: pass,
          telefono: telefono,
          cajainterna: cajainterna,
          token: token,
          password: password,
          uid: uid
        })
        resolve(res);
      }).catch(err => reject(err));
    })
  }

  crearq(correo:string, pass: string){
    return new Promise((resolve, reject) => {
      this.db.auth.createUserWithEmailAndPassword(correo, pass).then(res => {
       // const uid = res.user.uid;
        this.fire.collection('user').doc(res.user.uid).set({
          correo: correo,
          pass: pass
          
        })
        resolve(res);
      }).catch(err => reject(err));
    })
  }
  crear(correo: string, pass: string,  password: number, nombre: string, telefono: number, cajainterna: number,estado:number) {
    return new Promise((resolve, reject) => {
      this.db.auth.createUserWithEmailAndPassword(correo, pass).then(res => {
        const uid = res.user.uid;
        this.fire.collection('user').doc(uid).set({
          correo: correo,
          nombre: nombre,
          pass: pass,
          telefono: telefono,
          cajainterna: cajainterna,
        //  token: token,
          password: password,
          uid: uid,
          estado:estado
        })
        resolve(res);
      }).catch(err => reject(err));
    })
  }
//no esta funcionando
  crearcontel(uid:string, correo: string,  password: number, nombre: string, codtel:string, telefono: string, cajainterna: number,token: string,estado:number) {
      this.fire.collection('user').doc(uid).set({
        uid: uid,
        correo: correo,
        nombre: nombre,
        codtel : codtel,
        telefono: telefono,
        cajainterna: cajainterna,
        token: token,
        password: password,
        estado: estado
      })
    }

  cerrarsesion() {
    this.db.auth.signOut().then(() => {
      this.route.navigate(['/index']);
    });
  }
  cerrarsesion1(eltoken) {
    this.db.auth.signOut().then(() => {
      this.nav.navigateRoot(['/confirmarnum',eltoken])
    });
  }
  //recupera la caja de la aplicacion
  recuperacajaapp(): Observable<any> {
    return this.fire.collection('cajaapp').doc(this.id_cajaapp).valueChanges()
  }
  actualizacajaapp(monto) {
    return this.fire.collection('cajaapp').doc(this.id_cajaapp).set(monto, { merge: true })
  }
  //
  actualizabadge(badge, id) {
    return this.fire.collection('user').doc(id).set(badge, { merge: true })
  }

  //actualiza token
  actualizatoken(token, id) {
    return this.fire.collection('user').doc(id).set(token, { merge: true })
  }

  //recupera datos de los usuarios
  recuperadatos() {
    return this.fire.collection('user').snapshotChanges().pipe(map(dat => {
      return dat.map(a => {
        const data = a.payload.doc.data() as usu;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  recuperaundato(usu_id: string): Observable<any> {
    return this.fire.collection('user').doc(usu_id).valueChanges()
  }
  //actualiza cajainterna del usuario
  actualizacaja(cajainterna, id) {
    return this.fire.collection('user').doc(id).set(cajainterna, { merge: true })
  }
  //regitra pin
  registrapin(pin, id) {
    return this.fire.collection('user').doc(id).set(pin, { merge: true })
  }
   //regitra correo
   registracorreo(correo, id) {
    return this.fire.collection('user').doc(id).set(correo, { merge: true })
  }
  //regitra o actualiza nombre 
  registranombre(nombre, id) {
    return this.fire.collection('user').doc(id).set(nombre, { merge: true })
  }
  //actualiza cajabancaria del usuario
  actualizacajabancaria(cajabancaria, id) {
    return this.fire.collection('user').doc(id).set(cajabancaria, { merge: true })
  }
    //actualiza badge (envio de correo) del usuario
    enviocorreo(badge, id) {
      return this.fire.collection('user').doc(id).set(badge, { merge: true })
    }
  //recupera datos del usuario con el correo
  recuperaconcorreo(correo: string): Observable<any> {
    var query = ref => ref.where('correo', '==', correo)
    return this.fire.collection('user', query).valueChanges()
  }
  recuperacontoken(token: string): Observable<any> {
    var query = ref => ref.where('token', '==', token)
    return this.fire.collection('user', query).valueChanges()
  }

  recupera1ingreso(id: string, uid: string): Observable<any> {
    return this.fire.collection('/user/' + id + '/ingresos').doc(uid).valueChanges()
  }

  ordenaringresos(id: string): Observable<any> {
    this.ingresoscollection = this.fire.collection('/user/' + id + '/ingresos/', x => x.orderBy('fecha', 'desc'));
    return this.ingresos = this.ingresoscollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  recupera1egreso(id: string, uid: string): Observable<any> {
    return this.fire.collection('/user/' + id + '/egreso').doc(uid).valueChanges()
  }
  ordenaregresos(id: string): Observable<any> {
    this.ingresoscollection = this.fire.collection('/user/' + id + '/egreso/', x => x.orderBy('fecha', 'desc'));
    return this.ingresos = this.ingresoscollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }
  // alertas de aviso para el pago
  async presentToast(monto, usu) {
    const toast = await this.toastController.create({
      message: 'El pago de ' + monto + ' Bs. a ' + usu + ' se realizo correctamente',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async passincorrecta() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Su contraseña es incorrecta ',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  //alertas de aviso para la transferencia

  async transexitoso1(monto, usu) {
    const alert = await this.alertController.create({
      header: 'GoPay',
      // subHeader: 'Envio Exitoso',
      message: 'La transferencia de ' + monto + '  Bs. a ' + usu + ' se realizo con éxito.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async ahorroinsuficiente() {
    const alert = await this.alertController.create({
      header: 'Fastgi',
      // subHeader: 'Envio Exitoso',
      message: 'Su ahorro es insuficiente para realizar el pago',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
 
  async transexitoso() {
    const toast = await this.toastController.create({
      message: 'La transferencia se realizo con exito',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async pagodecobroexitoso(monto, usu) {
    const toast = await this.toastController.create({
      message: 'el pago de ' + monto + ' Bs. a ' + usu + ' se realizo con exito',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async insuficiente() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Tu ahorro es insuficiente para realizar esta acción',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  //
  async haberhaber(uid) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Este es el uid' +uid,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  //alertas para mover el dinero de banco a app y visceversa
  async muevesexitoso() {
    const toast = await this.toastController.create({
      message: 'La transferencia de Cta. Banco a Cta de la App fue exitosa',
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
  //alertas para ingresar por tarjeta
  async ingresotarjeta() {
    const toast = await this.toastController.create({
      message: 'El ingreso de monto desde su tarjeta fue exitoso',
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
  //alertas ingreso de monto obligatorio
  async ingresemonto() {
    const toast = await this.toastController.create({
      message: 'Debe ingresar monto',
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
  //alertas de error ingreso de tarjetas **confirmacargasaldo**
  async revisedatos() {
    const toast = await this.toastController.create({
      message: 'Revise sus datos',
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
  async ingresoinvalido() {
    const alert = await this.alertController.create({
      header: 'INGRESO INVALIDO',
      // subHeader: 'Envio Exitoso',
      message: 'Revise sus datos por favor.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async codigoinvalido() {
    const alert = await this.alertController.create({
      header: 'INGRESO INVALIDO',
      // subHeader: 'Envio Exitoso',
      message: 'PIN incorrecto.',
      buttons: ['Aceptar']

    });
    await alert.present();
  }
  //se modifico exitosamente
  async modificardatos() {
    const alert = await this.alertController.create({
      header: 'CORRECTO',
      // subHeader: 'Envio Exitoso',
      message: 'Se modifico exitosamente.',
      buttons: ['Aceptar']

    });
    await alert.present();
  } 
  //usuario registrado
  async creocorrecto() {
    const alert = await this.alertController.create({
      header: 'CORRECTO',
      // subHeader: 'Envio Exitoso',
      message: 'Se creo el usuario de manera satisfactoria.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  //solo un punto *cobroqr*
  async solounpunto() {
    const alert = await this.alertController.create({
      header: 'INCORRECTO',
      // subHeader: 'Envio Exitoso',
      message: 'Solo puede ingresar un punto decimal.',
      buttons: ['Aceptar']

    });
    await alert.present();
  }
  //tarjeta registrada
  async creotarjeta(monto, usu) {
    const alert = await this.alertController.create({
      header: 'CORRECTO',
      // subHeader: 'Envio Exitoso',
      message: 'La carga de ' + monto + 'Bs. de ' + usu + ' y el registro la tarjeta fue exitoso',
      buttons: ['Aceptar']

    });
    await alert.present();
  }
   //para confirmar el telefono
   async confirmatelefono(numero) {
    const alert = await this.alertController.create({
      header: 'VERIFIQUE',
      // subHeader: 'Envio Exitoso',
      message: 'El numero ingresado es ' + numero,
      buttons: ['Cerrar']

    });
    await alert.present();
  }
  //tarjeta registrada
  async cargocontarjeta(monto, usu) {
    const alert = await this.alertController.create({
      header: 'CORRECTO',
      // subHeader: 'Envio Exitoso',
      message: '  La carga de ' + monto + ' Bs. desde ' + usu + ' fue exitoso',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  //retirodirecto
  async retiracuenta(monto, usu) {
    const alert = await this.alertController.create({
      header: 'CORRECTO',
      // subHeader: 'Envio Exitoso',
      message: 'El retiro del monto a su cuenta fue exitoso',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  //tarjeta registrada
  async creocuenta(monto, usu, nombre) {
    const alert = await this.alertController.create({
      header: 'CORRECTO',
      // subHeader: 'Envio Exitoso',
      message: 'El retiro de ' + monto + 'Bs. a la cuenta ' + usu + ' de ' + nombre + ' y registro de la cuenta fue exitosa',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  //para recuperar datos de la tarjeta
  recuperatarjeta(id: string) {
    return this.fire.collection('/user/' + id + '/tarjetas').snapshotChanges().pipe(map(dat => {
      return dat.map(a => {
        const data = a.payload.doc.data() as usu;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  recupera1tarjeta(numero: string, uid: string): Observable<any> {
    var query = ref => ref.where('numero', '==', numero)
    return this.fire.collection('/user/' + uid + '/tarjetas', query).valueChanges()
  }

  actualizacajatarjeta(monto, id) {
    return this.fire.collection('/user/' + id + '/tarjetas').doc(id).set(monto, { merge: true })
  }

  //para recuperar datos de la cuenta
  recuperacuenta(id: string) {
    return this.fire.collection('/user/' + id + '/cuentas').snapshotChanges().pipe(map(dat => {
      return dat.map(a => {
        const data = a.payload.doc.data() as usu;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }
  //mensaje de seleccione distintas tarjetas
  async distintastarjetas() {
    const alert = await this.alertController.create({
      header: 'ATENCIÓN',
      // subHeader: 'Envio Exitoso',
      message: 'Seleccione cuentas distintas por favor',
      buttons: ['Aceptar']

    });
    await alert.present();
  }
  // validar correo
  async correoinvalido() {
    const alert = await this.alertController.create({
      header: 'CORREO INVALIDO',
      // subHeader: 'Envio Exitoso',
      message: 'Campo correo no permite caracter /.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  // validar telefono
  async telefonoinvalido() {
    const alert = await this.alertController.create({
      header: 'TELEFONO INVALIDO',
      // subHeader: 'Envio Exitoso',
      message: 'Campo telefono incorrecto revise por favor.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  // validar contraseña
  async contraseñainvalida() {
    const alert = await this.alertController.create({
      header: 'CONTRASEÑA INVALIDA',
      // subHeader: 'Envio Exitoso',
      message: 'Campo contraseña no tiene 6 caracteres o no son iguales .',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  // validar pin
  async pininvalido() {
    const alert = await this.alertController.create({
      header: 'PIN INVALIDO',
      // subHeader: 'Envio Exitoso',
      message: 'Campo pin solo acepta números y 4 digitos.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  // confirmacion de envio de cobro
  async enviocobro(monto, usu) {
    const alert = await this.alertController.create({
      header: 'GoPay',
      // subHeader: 'Envio Exitoso',
      message: 'Se envio la petición de pago de ' + monto + '  Bs. a ' + usu + ' exitosamente.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  
  //ordena cobrosapagar *tab1* no utilizado
 /* ordenarcobros(id: string): Observable<any> {
    this.ingresoscollection = this.fire.collection('/user/' + id + '/cobros/', x => x.orderBy('fecha', 'desc'));
    return this.ingresos = this.ingresoscollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }*/

  /* recuperaprueba(id): Observable<any> {
    return this.fire.collection('/user/' + id + '/cobros').valueChanges()
  }*/

  // recupera cobrosapagar por id *pagarenviocobro* 
 /* recuperacobros(id, id1): Observable<any> {
    var query = ref => ref.where('clave', '==', id)
    return this.fire.collection('/user/' + id1 + '/cobros', query).snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }*/
  //recupera las transferencias para meter en *pagarenviocobro* aun no usado
  recuperacobrostransferencias(idco, id): Observable<any> {
    var query = ref => ref.where('clave', '==', idco)
    return this.fire.collection('/user/' + id + '/cobrostransferencias', query).snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }


  ordenarjson(data, key, orden) {
    return data.sort(function (a, b) {
      var x = a[key],
        y = b[key];
      if (orden === 'asc') {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }
      if (orden === 'desc') {
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
      }
    });
  }

  //actualiza el estado de cobrosapagar *pagarenviocobro*
  actualizaestadodecobro(estado, id, id1) {
    return this.fire.collection('/user/' + id + '/cobrostransferencias').doc(id1).set(estado, { merge: true })
  }
  //recupera enviocobros por id *pagarenviocobro* 
  recuperaenviocobros(pagador, cobrador, fechita): Observable<any> {
    var query = ref => ref.where('clave', '==', pagador).where('fechita', '==', fechita)
    return this.fire.collection('/user/' + cobrador + '/cobrostransferencias', query).snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }


  //actualiza el estado de enviocobro *pagarenviocobro*
  agregafechapagocobros(fecha, id, id1) {
    return this.fire.collection('/user/' + id + '/cobrostransferencias').doc(id1).set(fecha, { merge: true })
  }

  //recupera los badges por id *tab1* 
  recuperabadge(pagador, cobrador): Observable<any> {
    var query = ref => ref.where('clave', '==', pagador)
    return this.fire.collection('/user/' + cobrador + '/cobrostransferencias', query).snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }
  //recupera usuario por numero
  verificausuarioActivo(numero): Observable<any> {
    var query = ref => ref.where('telefono', '==', numero)
    return this.fire.collection('user', query).valueChanges()
  }

  
  //ordena historial 1er pantalla
  ordenarcobrostransferencias(id: string): Observable<any> {
    this.ingresoscollection = this.fire.collection('/user/' + id + '/cobrostransferencias/', x => x.orderBy('fecha', 'asc'));
    return this.ingresos = this.ingresoscollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as ingresos;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  async datosgmail(pin,correo,telefono) {
    const alert = await this.alertController.create({
      header: 'Fastgi',
      message:   '<div> Por su seguridad y respaldo se enviara los datos a su correo <strong>' + correo + '</strong><br><br></div><table><tr><td><strong>Telefono:</strong></td><td>' + telefono + '</td></tr> <tr><td><strong>Correo:</strong></td><td>' + correo + '</td></tr><tr><td><strong>Pin:</strong></td><td>' + pin + '</td></tr></table>',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Enviar',
          handler: () => {
            let email = {
              to: correo,
              cc: [],
              bcc: [],
              attachments: [],
              subject: 'Fastgi',
              body: 'MUY IMPORTANTE, SE RECOMIENDA GUARDAR SUS DATOS <br><br>' + ' ' + '<strong>Telefono:</strong>' + ' ' + telefono + '<br> ' + '<strong>Correo:</strong>' + ' ' + correo + ' <br>' + '<strong>Pin:</strong>' + ' ' + pin,
              isHtml: true
              //app: 'Gmail'
            }
            this.emailComposer.open(email);
            //modificar el estado
            //this.au.enviocorreo({ estado: 1 }, this.usuario.uid)
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async loadinginicio() {
    const loading = await this.loadingController.create({
      message: 'Espere por favor...!'
    });
    await loading.present();
    return loading
  }
  // generar numero serial para el pago
  recuperacont(){
    return this.fire.collection('cont').snapshotChanges().pipe(map(dat => {
      return dat.map(a => {
        const data = a.payload.doc.data() as cont;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  actualizacontpago(numero, id) {
    return this.fire.collection('cont').doc(id).set(numero, { merge: true })
  }

  dos_decimales(cadena){
    let expresion=/^\d+(\.\d{0,2})?$/;
    let resultado=expresion.test(cadena);
    return resultado;
    }

}



