import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmapagomontoPage } from './confirmapagomonto.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmapagomontoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmapagomontoPage]
})
export class ConfirmapagomontoPageModule {}
