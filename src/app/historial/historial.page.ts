import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  usuario = {
    nombre: "",
    telefono: "",
    uid: "",
    badge: ""
  }
  uu: any
  historial = []
  cont: any

  datos = []
  textoBuscar = '' 
  c = 0
  //para importar contactos
  ContactsNone = []
  ContactsTrue = []
  controlador = 0
  //para los badges
  num = []
  badge = 0
  idusuario: any
  badges = []
  controladores: []
  asd: []
  datito
  todos_contactos=[]
  constructor(private router: Router,
    private au: AuthService,
    private route: Router,
    private contactos: Contacts,
    private socialShare: SocialSharing,
    public fire: AngularFirestore) {

  }

  ngOnInit() {
    // this.doRefresh(event)
    this.uu = this.au.pruebita();
    let h = this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
      this.idusuario = this.usuario.uid


       this.au.ordenarcobrostransferencias(this.usuario.uid).subscribe(info => {
        this.historial = info.filter((valor, indiceActual, arreglo) => arreglo.findIndex((item) => item.telefono === valor.telefono
        ) === indiceActual);

        // cambiar estados1
    //   this.historial.forEach(element => {
    //       this.au.recuperacobrostransferencias1(element.clave, this.usuario.uid, false).subscribe(datos => {
    //       this.controladores = datos 
    //       const numeritos = this.controladores.length
    //       this.badges.push( {'a':numeritos} )
    //       //console.log(this.badges)
    //     })
//
    //   });
        // cambiar estados
        // this.historial.forEach(element => {
        //   let a =this.au.recuperacobrostransferencias1(element.clave, this.usuario.uid, false).subscribe(datos => {
        //     this.controladores = datos
        //     const numeritos = this.controladores.length
        //     this.badges.push({ 'a': numeritos })
        //     console.log(this.badges)
        //     a.unsubscribe()
        //   })


        // e.unsubscribe()
        //funcion para filtro de busqueda
        if (this.historial.length > 0)
          this.c = 1

        // //importar contactos      
         let options = {
           filter: '',
           multiple: true,
           hasPhoneNumber: true
         }

        this.contactos.find(['*'], options).then((contactos: Contact[]) => {
          for (let item of contactos) {
           //guardar los contactos a la BD
         

           if (item.phoneNumbers) {
              // item["value"] = this.codigo(item.phoneNumbers[0].value)
              // alert(item["value"])
              this.au.verificausuarioActivo(this.codigo(item.phoneNumbers[0].value))
                .subscribe(resp => {
                  if (resp.length > 0) {
                    this.ContactsTrue.push(item)
                    //this.ContactsTrueOrden=this.au.ordenarjson(this.ContactsTrue,'usu.name.givenName','asc')
                  } else {
                    this.ContactsNone.push(item)
                    //this.ContactsNoneOrden=this.au.ordenarjson(this.ContactsNone,'usu.name.giveName','asc')
                  }
                })
            }
          }
        })
          .catch(error => {
            console.log(error);
        
          })

      })
      //h.unsubscribe()
    })

  }
  codigo(num) {
    let nuevo = num.replace("+591", "").trim()
    return nuevo
  }

  // doRefresh(event) {
  //   console.log('Begin async operation');
  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     event.target.complete();
  //   }, 2000);
  // }
  BuscarHistorial(event) {
    this.textoBuscar = event.target.value;
    if (this.textoBuscar != '') {
      this.controlador = 1
    } else {
      this.controlador = 0
    }
  }

  paso() {
    this.router.navigate(['/tabs/historial/transferencias'])
  }

  enviadatos(usu,i) {
    this.datito=this.badges[i] = 0
    this.route.navigate(['pagarenviocobro', usu.telefono, usu.formatted])
    let aux: any = []
    this.controladores.forEach((element: any) => {
      aux.push(this.au.actualizaestados({ estado: true }, element.id, this.usuario.uid))
    })
    Promise.all(aux).then(da => {
    //  console.log('termino de actualizar estados');
      console.log(i);

    })
    //this.au.recuperacobrostransferencias1(usu.clave,this.usuario.uid,false).subscribe (datos =>{
    //  datos.forEach(element => {
    //    console.log(element);
    //    this.au.actualizaestados({ estado: true }, this.usuario.uid)
    //  });
    //  //
    //})
  }

  enviadatos2(usu) {
    this.route.navigate(['/tabs/historial/pagarenviocobro', usu.phoneNumbers[0].value, usu.name.formatted])
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
