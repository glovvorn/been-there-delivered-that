import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConfirmSignInPage } from '../pages/confirmSignIn/confirmSignIn';
import { ConfirmSignUpPage } from '../pages/confirmSignUp/confirmSignUp';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { TabsPage } from '../pages/tabs/tabs';
import { DeliveriesPage } from '../pages/deliveries/deliveries';
import { DeliveriesCreatePage } from '../pages/deliveries-create/deliveries-create';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamoDB } from '../providers/aws.dynamodb';

import { DeliveryService } from '../services/delivery-service';
import { IdService } from '../services/id-service';

import Amplify from 'aws-amplify';
const aws_exports = require('../aws-exports').default;

Amplify.configure(aws_exports);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    DeliveriesPage,
    DeliveriesCreatePage,
    HomePage,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmSignInPage,
    ConfirmSignUpPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    DeliveriesPage,
    DeliveriesCreatePage,
    HomePage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    DynamoDB,
    Geolocation,
    DeliveryService,
    IdService
  ]
})
export class AppModule {}

declare var AWS;
AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';
