import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Router,  ActivatedRoute } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import {  AlertController } from '@ionic/angular';
//import { EnviadatosgmailPage } from '../enviadatosgmail/enviadatosgmail.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {
  //lo nuevo
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  //

  public data = {
    text: ""
  };
  uu :any
  option: BarcodeScannerOptions;
  constructor(public bar: BarcodeScanner,
    private route: Router,
    public fire: AngularFirestore,
    private au: AuthService,
    public alertController: AlertController,
    ) {
    //lo nuevo
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }
  cont
  correo: string;
  usuario = {
    cajainterna: "",
    correo: "",
    telefono: "",
    password: "",
    monto: "",
    nombre: "",
    uid: "",
    pass: "",
    estado: ""
  }
 ;
  lista: any;
  caja: number
  caja1: any

  vegetales = [{nombre:'Aepollo'},{nombre:'Xabo'} ,{nombre:'Rábano'} ,{nombre:'Zanahoria'} ];
  ordenado: any = []

  valor:any
  ngOnInit() {
    
   this.uu = this.au.pruebita();
    this.au.recuperaundato(this.uu).subscribe(usuario => {
      this.usuario = usuario; 
    })   
   this.ordenado =this.au.ordenarjson(this.vegetales,"nombre","desc")
   console.log(this.ordenado);
    
  }
  

  scan() {
    this.option = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      resultDisplayDuration: 500,
      formats: 'QR_CODE,PDF_417 ',
      orientation: 'landscape',
      prompt: "por favor lea el codigo QR"
    }
    this.bar.scan(this.option).then(barcodeData => {
      this.data = barcodeData;
      const convertido = this.data.text.split("/");
      const convertido1 = convertido[0];
      const convertido2 = convertido[1];
      var c = 0;
      var letra = "/"
      for (var i = 0; i <= this.data.text.length; i++) {
        if (this.data.text[i] == letra) {
          c++
        }
      }
      if (c == 0 && this.data.text != "") {
        this.route.navigate(['/cards', this.data.text])
      } else {
        this.route.navigate(['/escaner', convertido1, convertido2])
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  historial() {
    this.route.navigate(['/ingresoegreso'])
  }

  verificar(){
    let campo = this.valor
    if(this.au.dos_decimales(campo) !== true){
    this.valor=""
    }else{
      alert('formato correcto')
    }
  }

}






