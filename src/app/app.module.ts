import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxStripeModule } from '@nomadreservations/ngx-stripe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CategoriesComponent } from './restaurent/pages/home/sidebar/categories/categories.component';
import { SidebarComponent } from './restaurent/pages/home/sidebar/sidebar.component';
import { CartComponent } from './restaurent/base-layout/cart/cart.component';
import { HeaderComponent } from './restaurent/base-layout/header/header.component';
import { MainStructureComponent } from './restaurent/pages/home/main-structure/main-structure.component';
import { RestaurentInfoComponent } from './restaurent/base-layout/header/restaurent-info/restaurent-info.component';
import { DishItemsComponent } from './restaurent/pages/dish-items/dish-items.component';
import { LocationSidebarComponent } from './restaurent/pages/location-sidebar/location-sidebar.component';
import { ModalComponent } from './restaurent/pages/dish-items/modal/modal.component';
import { CheckoutComponent } from './restaurent/pages/checkout/checkout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbStepperModule,
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbRadioModule,
  NbPopoverModule,
  NbInputModule, NbDatepicker, NbDatepickerModule, NbCheckboxModule, NbTabsetModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CouponsComponent } from './restaurent/pages/coupons/coupons.component';
import { PaymentComponent } from './restaurent/pages/payment/payment.component';
import { CardsComponent } from './restaurent/pages/payment/cards/cards.component';
import { NetbankingComponent } from './restaurent/pages/payment/netbanking/netbanking.component';
import { CodComponent } from './restaurent/pages/payment/cod/cod.component';
import { PaytmComponent } from './restaurent/pages/payment/paytm/paytm.component';
import { ProfileComponent } from './restaurent/pages/profile/profile.component';
import { BodyComponent } from './restaurent/base-layout/body/body.component';
import { OrdersComponent } from './restaurent/pages/profile/orders/orders.component';
import { AddressComponent } from './restaurent/pages/profile/address/address.component';
import { SavedCardsComponent } from './restaurent/pages/profile/saved-cards/saved-cards.component';
import { AddAddressComponent } from './restaurent/pages/location-sidebar/add-address/add-address.component';
import { ManageCouponsComponent } from './restaurent/pages/profile/manage-coupons/manage-coupons.component';
import { LoginComponent } from './restaurent/pages/login/login.component';
import { RegisterComponent } from './restaurent/pages/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {GetAuthInterceptorService} from "./services/get-auth-interceptor/get-auth-interceptor.service";
import {SetAuthInterceptorService} from "./services/set-auth-interceptor/set-auth-interceptor.service";
import {NgxSpinnerModule} from "ngx-spinner";
import {ToastrModule} from "ng6-toastr-notifications";
import {FormsModule} from "@angular/forms";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {AgmCoreModule} from "@agm/core";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import { AddAddressResponsiveComponent } from './restaurent/pages/location-sidebar/add-address-responsive/add-address-responsive.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { OrderSuccessComponent } from './restaurent/pages/order-success/order-success.component';
import {GoogleLoginProvider, FacebookLoginProvider, AuthServiceConfig, SocialLoginModule} from "angularx-social-login";
import { FilterPipe } from './services/pipe/filter.pipe';

import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { UsRestaurantsComponent } from './restaurent/pages/us-restaurants/us-restaurants.component';
import { PaginationModule } from 'ngx-bootstrap';
import { environment } from 'src/environments/environment.prod';
import { FooddepoComponent } from './restaurent/pages/fooddepo/fooddepo.component';

import { ThankyouComponent } from './restaurent/pages/thankyou/thankyou.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    // provider: new GoogleLoginProvider("1064827801224-imho4avna2eifv1h7lmod5b3kulfcjno.apps.googleusercontent.com")
    provider: new GoogleLoginProvider('225833542944-pd02si30gmpsvmnetvcv8ht9e03cd4oa.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("508670599928622")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    SidebarComponent,
    CartComponent,
    HeaderComponent,
    MainStructureComponent,
    RestaurentInfoComponent,
    DishItemsComponent,
    LocationSidebarComponent,
    ModalComponent,
    CheckoutComponent,
    CouponsComponent,
    PaymentComponent,
    CardsComponent,
    NetbankingComponent,
    CodComponent,
    PaytmComponent,
    ProfileComponent,
    BodyComponent,
    OrdersComponent,
    AddressComponent,
    SavedCardsComponent,
    AddAddressComponent,
    ManageCouponsComponent,
    LoginComponent,
    RegisterComponent,
    AddAddressResponsiveComponent,
    OnlyNumberDirective,
    OrderSuccessComponent,
    FilterPipe,
    UsRestaurantsComponent,
    FooddepoComponent,
    ThankyouComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxStripeModule.forRoot('225833542944-pd02si30gmpsvmnetvcv8ht9e03cd4oa.apps.googleusercontent.com'),
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbStepperModule,
    NbCardModule,
    NbIconModule,
    NbPopoverModule,
    NbButtonModule,
    NbRadioModule,
    NbInputModule,
    NbDatepickerModule.forRoot(),
    NbCheckboxModule,
    NbTabsetModule,
    NbTabsetModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    PaginationModule.forRoot(),
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBXm7UUp0mQF1gmX67DqfX7RKk1iTGrDvo',
      libraries: ['places']
    }),
    SocialLoginModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
  ],
  providers: [
    // {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: GetAuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: SetAuthInterceptorService, multi: true},
    {provide: AuthServiceConfig, useFactory: provideConfig},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
