import { Component, OnInit} from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthService } from '../servicios/auth.service';

import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recibedinero',
  templateUrl: './recibedinero.page.html',
  styleUrls: ['./recibedinero.page.scss'],
 
})
export class RecibedineroPage implements OnInit {
  usuario={
    telefono:"",
    nombre:""
   }
   
   uu:any;
   correo =null;
   createdCode =null;
   usu=0
   //prueba para descargar
   qrData='omarcanazanina';
   scannedCode = null;
   scannedCode1 :any;
   elementType: 'url'|'canvas'| 'img' ='canvas';
  constructor( private barcode:BarcodeScanner, 
        private au:AuthService,
        private base64ToGallery: Base64ToGallery,
        public toastController: ToastController
        ) { 
  }
  
  //otro lector
  scan(){
    this.barcode.scan().then(
      barcodeData =>{
       this.scannedCode = barcodeData
       this.scannedCode1 = JSON.stringify(this.scannedCode.text) 
      }
    )
  }

  downloadQR(){
    let canvas =document.querySelector('canvas') as HTMLCanvasElement;
    let imageData = canvas.toDataURL('image/jpeg').toString();
    console.log('data:',imageData);
    let data = imageData.split(',')[1];
    console.log(data);
    

      this.base64ToGallery.base64ToGallery(data,{prefix:'_img', mediaScanner: true}).then( res=>{
           alert('se guardo existosamente' + res)
            //let toast =await this.toastController.create({
            //  header:'se guardo exitosamente'
            //});
            //toast.present()
           },err => alert('err:'+ err) )    

   // this.base64ToGallery.base64ToGallery(data,{prefix:'_img', mediaScanner: true}).then( res=>{
   //   alert('se guardo existosamente', res)
   //    //let toast =await this.toastController.create({
   //    //  header:'se guardo exitosamente'
   //    //});
   //    //toast.present()
   //   },err => alert('err:'+ err) )
  }
  downloadQR1(){
    let canvas =document.querySelector('canvas') as HTMLCanvasElement;
    let imageData = canvas.toDataURL('image/jpeg').toString();
    console.log('data:',imageData);
    let data = atob(imageData)
   // let data = imageData.split(',')[0];
   // console.log(data);
    

      this.base64ToGallery.base64ToGallery(btoa(data),{prefix:'_img', mediaScanner: true}).then( res=>{
           alert('se guardo existosamente' + JSON.stringify(res))
            //let toast =await this.toastController.create({
            //  header:'se guardo exitosamente'
            //});
            //toast.present()
           },err => alert('err:'+ err) )

   // this.base64ToGallery.base64ToGallery(data,{prefix:'_img', mediaScanner: true}).then( res=>{
   //   alert('se guardo existosamente', res)
   //    //let toast =await this.toastController.create({
   //    //  header:'se guardo exitosamente'
   //    //});
   //    //toast.present()
   //   },err => alert('err:'+ err) )
  }


  ngOnInit() {
    this.uu=this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario=>{
      this.usuario=usuario;
      this.createdCode = this.usuario.telefono;
      if(this.usuario.nombre == ''){
        this.usu=0
      }else{
        this.usu=1
      }
    })
   
  }
 

}
