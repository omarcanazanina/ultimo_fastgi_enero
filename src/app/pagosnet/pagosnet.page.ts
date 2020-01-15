import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-pagosnet',
  templateUrl: './pagosnet.page.html',
  styleUrls: ['./pagosnet.page.scss'],
})
export class PagosnetPage implements OnInit {

  constructor(private brow:InAppBrowser) { }

  ngOnInit() {
    this.brow.create("https://test.sintesis.com.bo/payment/#/pay?581=4&ref=&red=http://www.abc.com");
  }


}
