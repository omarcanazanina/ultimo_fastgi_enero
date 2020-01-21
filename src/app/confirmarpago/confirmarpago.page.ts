import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmarpago',
  templateUrl: './confirmarpago.page.html',
  styleUrls: ['./confirmarpago.page.scss'],
})
export class ConfirmarpagoPage implements OnInit {
  usuario:any = []
  cobrador:any = []
  usu: any =[]
  gruponum = [7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, 'Borrar']    
  pin=""
  cont = 0
  constructor(private modal: ModalController) { }

  ngOnInit() {
    console.log(this.usu)
    
    
  }

  closeUsuario() {
    this.modal.dismiss()
  }

  presionar(num) {
    this.pin = this.pin + num
    if (num == 'Borrar') {
      this.pin = ""
    } if (num == '.') {
      this.cont = this.cont + 1
    } if (this.cont > 1) {
      this.pin = ""
      this.cont = 0
    }
  }

}
