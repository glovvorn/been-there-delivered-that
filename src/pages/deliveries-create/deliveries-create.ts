import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-deliveries-create',
  templateUrl: 'deliveries-create.html'
})
export class DeliveriesCreatePage {

  

  isReadyToSave: boolean;

  item: any;

  isAndroid: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform) {
    this.isAndroid = platform.is('android');
    this.item = {
      'deliveryId': navParams.get('id'),
      'status': 'New'
    };
    this.isReadyToSave = true;
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    // Google Places API auto complete
    let input = document.getElementById('googlePlaces').getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // retrieve the place object for your use
      let place = autocomplete.getPlace();
      console.log(place);
    });
 }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() { 
    this.viewCtrl.dismiss(this.item);
  }


}
