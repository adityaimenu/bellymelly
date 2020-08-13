import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CheckoutComponent } from './restaurent/pages/checkout/checkout.component';
import { PaymentComponent } from './restaurent/pages/payment/payment.component';
import { CardsComponent } from './restaurent/pages/payment/cards/cards.component';
import { NetbankingComponent } from './restaurent/pages/payment/netbanking/netbanking.component';
import { CodComponent } from './restaurent/pages/payment/cod/cod.component';
import { PaytmComponent } from './restaurent/pages/payment/paytm/paytm.component';
import { ProfileComponent } from './restaurent/pages/profile/profile.component';
import { BodyComponent } from './restaurent/base-layout/body/body.component';
import { MainStructureComponent } from './restaurent/pages/home/main-structure/main-structure.component';
import { AuthGuard } from "./guards/auth.guard";
import { UsRestaurantsComponent } from './restaurent/pages/us-restaurants/us-restaurants.component';
import { FooddepoComponent } from './restaurent/pages/fooddepo/fooddepo.component';
import { ThankyouComponent } from './restaurent/pages/thankyou/thankyou.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'us/fcff', //testing
    // redirectTo: 'fcff', //live
    pathMatch: 'full'
  },
  { path: 'au/restaurants', component: UsRestaurantsComponent }, //testing
  { path: 'us/restaurants', component: UsRestaurantsComponent }, //testing
  // { path: 'restaurants',  component: UsRestaurantsComponent }, //live

  { path: 'au/org/:org', component: FooddepoComponent }, //testing
  { path: 'us/org/:org', component: FooddepoComponent }, //testing
  // { path: 'org/:org',  component: FooddepoComponent }, //live
  {
    path: ':country/:mobUrl', //testing 
    // path: ':mobUrl', //live
    component: BodyComponent,
    children: [
      { path: '', component: MainStructureComponent },
      {
        path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard], children: [
          { path: 'cards', component: CardsComponent },
          { path: 'paytm', component: PaytmComponent },
          { path: 'netbanking', component: NetbankingComponent },
          { path: 'cashondelivery', component: CodComponent }
        ]
      },
      { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
      { path: 'thankyou', canActivate: [AuthGuard], component: ThankyouComponent },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
