import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { LoadingController } from '@ionic/angular';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-transferencias',
  templateUrl: './transferencias.page.html',
  styleUrls: ['./transferencias.page.scss'],
})
export class TransferenciasPage implements OnInit {
  datito = []
  ContactsNone = []
  ContactsTrue = []
  ContactsNoneOrden: any
  ContactsTrueOrden: any = []
  Ordenado: []
  Ordenado1: []
  textoBuscar = ''

  // otro modo
  uu
  usuario = {
    nombre: "",
    telefono: "",
    uid: "",
    badge: "",
    contacts: ""
  }
  listadecontactos: any = []
  lista_contactos: any = []
  cont = 0
  todos: any = []
  todos_ordenado: any = []
  lista_contactos1: any = []
  cont1 = 0
  todos1: any = []
  todos_ordenado1: any = []
  constructor(private au: AuthService,
    private contactos: Contacts,
    public loadingController: LoadingController,
    private route: Router,
    private socialShare: SocialSharing,
    public fire: AngularFirestore
  ) {
  }

  BuscarContacto(event) {
    this.textoBuscar = event.target.value;
  }

  ngOnInit() {
    this.uu = this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
      this.listar_contactos()
      this.listar()
    })
  }
  //importar contacto jalando los datos de la BD directamente
  listar_contactos() {
    if (parseInt(this.usuario.contacts) == 0) {
    let load = this.presentLoading()
      let options = {
        filter: '',
        multiple: true,
        hasPhoneNumber: true
      }
      this.contactos.find(['*'], options).then((contactos: Contact[]) => {
        for (let item of contactos) {
          this.au.verificausuarioActivo(this.codigo(item.phoneNumbers[0].value)).subscribe(resp => {
            if (resp.length > 0) {
              this.fire.collection('/user/' + this.usuario.uid + '/contactos').add({
                nombre: item.name.formatted,
                telefono:this.codigo(item.phoneNumbers[0].value),
                estado:1
              })
            } else {
              this.fire.collection('/user/' + this.usuario.uid + '/contactos').add({
                nombre: item.name.formatted,
                telefono:this.codigo(item.phoneNumbers[0].value),
                estado:0
              })
            }
          })
        
        }
        this.au.actualizarcontacts({ contacts: 1 }, this.usuario.uid);
      })
      load.then(loading => {
        loading.dismiss();
      })
    } else {
      alert('ya se importo los contactos')
    }
  }

  //listar contactos
  listar(){
    this.au.recuperarcontactos(this.usuario.uid,1).subscribe(los_contactos => {
      this.todos = los_contactos
      this.cont = this.todos.length
      this.todos_ordenado=this.au.ordenarjson(this.todos,'nombre','asc')
    })
    this.au.recuperarcontactos(this.usuario.uid,0).subscribe(los_contactos1 => {
      this.todos1 = los_contactos1
      this.cont1 = this.todos1.length
      this.todos_ordenado1=this.au.ordenarjson(this.todos1,'nombre','asc')
    })
  }


  //otro metodo para import contactos
  loadContacts() {
    let load = this.presentLoading()
    let options = {
      filter: '',
      multiple: true,
      hasPhoneNumber: true
    }
    this.contactos.find(['*'], options).then((contactos: Contact[]) => {
      this.ContactsTrueOrden = this.au.ordenarjson(contactos, '_objectInstance.id', 'asc')
      for (let item of contactos) {
        if (item.phoneNumbers) {
      
          this.au.verificausuarioActivo(this.codigo(item.phoneNumbers[0].value))
            .subscribe(resp => {
              if (resp.length > 0) {
                this.ContactsTrue.push(item)
              } else {
                this.ContactsNone.push(item)
              }
            })
        }
      }
      load.then(loading => {
        loading.dismiss();
      })
    })
  }


  codigo(num) {
    let nuevo = num.replace("+591", "").trim()
    return nuevo
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando contactos--',
      duration: 2000
    });
    await loading.present();
    return loading;
  }
  enviadatos(usu) {
    this.route.navigate(['/pagarenviocobro', usu.telefono, usu.nombre])
  }

  invitar() {
    this.socialShare.shareWithOptions({
      message: "Prueba Fastgi, es ideal para realizar pagos y transferencias de una manera secilla y fácil",
      subject: "QR Transaccion",
      url: 'Android:https://play.google.com/store/apps/details?id=com.hegaro.goodme&hl=es_BO  IOS:www.hegaro.com.bo',
      chooserTitle: 'Compartir Via'
    }).then(() => {
      console.log("shared successfull");
    }).catch((e) => {
      console.log("shared failed" + e);
    });
  }
}
