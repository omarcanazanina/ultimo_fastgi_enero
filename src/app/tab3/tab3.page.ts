import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { firestore } from 'firebase';

export interface Image {
  id: string;
  image: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  url: any;
  newImage: Image = {
    id: this.afs.createId(), image: ''
  }
  loading: boolean = false;

  constructor(private au: AuthService,
    public alertController: AlertController,
    private route: Router,
    //
    private afs:AngularFirestore,
    private storage: AngularFireStorage,
    private camera: Camera,
   
    ) { }
  usuario = {
    cajainterna: "",
    correo: "",
    nombre: "",
    pass: "",
    telefono: "",
    cajabancaria: "",
    uid: "",
    codtel:""
  }

  tarjetas: any = []
  uu = null;
  monto: number;
  cajaactual: number;

  controlnombre = 0
  controlcorreo = 0
  ngOnInit() {
   // this.uu = this.activate.snapshot.paramMap.get('id')
    this.uu = this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario;
      if(this.usuario.nombre != ''){
        this.controlnombre = 1
      }
      if(this.usuario.correo != ''){
        this.controlcorreo = 1
      }
    })
    this.au.recuperatarjeta(this.uu).subscribe(data =>{
      this.tarjetas=data;
    })
  }
 
  async editarnombre() {
    const alert = await this.alertController.create({
      header: 'Editar nombre',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: this.usuario.nombre,
          placeholder: 'Nuevo nombre'
        }
      ],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            this.au.registranombre({ nombre: data.nombre }, this.uu);
            if(data.nombre == ''){
              this.controlnombre = 0
            }else{
              this.controlnombre = 1
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editarcorreo() {
    const alert = await this.alertController.create({
      header: 'Editar correo',
      inputs: [
        {
          name: 'correo',
          type: 'text',
          value: this.usuario.correo,
          placeholder: 'Nuevo correo'
        }
      ],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {
            this.au.registracorreo({ correo: data.correo}, this.uu);
            
            if(data.correo == ''){
              this.controlcorreo = 0
            }else{
              this.controlcorreo = 1
            }
     
          }
        }
      ]
    });
    await alert.present();
  }

  mod(){
    this.route.navigate(['/modpin'])
  }
  
  async cerrarsesion() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Esta seguro que desea cerrar sesión',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
           this.au.cerrarsesion()
          }
        }
      ]
    });
    await alert.present();
  }
  /*
  capture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
   
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  } // End of capture camera
*/

  
/*
  uploadImage(event) {
    this.loading = true;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
     
      reader.readAsDataURL(event.target.files[0]);
      // For Preview Of Image
      reader.onload = (e:any) => { // called once readAsDataURL is completed
        this.url = e.target.result;
      
        // For Uploading Image To Firebase
        const fileraw = event.target.files[0];
        console.log(fileraw)
        const filePath = '/Image/' + this.newImage.id + '/' + 'Image' + (Math.floor(1000 + Math.random() * 9000) + 1);
        const result = this.SaveImageRef(filePath, fileraw);
        const ref = result.ref;
        result.task.then(a => {
          ref.getDownloadURL().subscribe(a => {
            console.log(a);
            
            this.newImage.image = a;
            this.loading = false;
          });

          this.afs.collection('Image').doc(this.newImage.id).set(this.newImage);
        });
      }, error => {
        alert("Error");
      }

    }
  }



  SaveImageRef(filePath, file) {

    return {
      task: this.storage.upload(filePath, file)
      , ref: this.storage.ref(filePath)
    };
  }
*/
}
