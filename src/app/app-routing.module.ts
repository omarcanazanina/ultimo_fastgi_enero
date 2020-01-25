import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {NologinGuard} from './guards/nologin.guard'
const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  //{ path: 'escaner/:monto/:phoneNumber', loadChildren: './escaner/escaner.module#EscanerPageModule' },
  //{ path: 'cards/:phoneNumber', loadChildren: './cards/cards.module#CardsPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'tab2', loadChildren: './tab2/tab2.module#Tab2PageModule' , canActivate:[AuthGuard]},
  { path: 'index', loadChildren: './index/index.module#IndexPageModule'  ,canActivate:[NologinGuard]},
  { path: 'index2', loadChildren: './index2/index2.module#Index2PageModule' ,canActivate:[NologinGuard]},
  { path: 'tab4', loadChildren: './tab4/tab4.module#Tab4PageModule' },
  { path: 'detalleingresoegreso/:id', loadChildren: './detalleingresoegreso/detalleingresoegreso.module#DetalleingresoegresoPageModule' },
  { path: 'detalleegreso/:id', loadChildren: './detalleegreso/detalleegreso.module#DetalleegresoPageModule' },
  { path: 'detalleenviocobro', loadChildren: './detalleenviocobro/detalleenviocobro.module#DetalleenviocobroPageModule' },
  { path: 'historial', loadChildren: './historial/historial.module#HistorialPageModule' },
  { path: 'confirmacion1', loadChildren: './confirmacion1/confirmacion1.module#Confirmacion1PageModule' },
  { path: 'confirmarpago', loadChildren: './confirmarpago/confirmarpago.module#ConfirmarpagoPageModule' },
  { path: 'confirmacards', loadChildren: './confirmacards/confirmacards.module#ConfirmacardsPageModule' },
  { path: 'confirmapagomonto', loadChildren: './confirmapagomonto/confirmapagomonto.module#ConfirmapagomontoPageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
