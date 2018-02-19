import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Delivery, DeliveryStatus } from '../../models';

declare var google: any;

@Component({
  selector: 'page-deliveries-create',
  templateUrl: 'deliveries-create.html'
})
export class DeliveriesCreatePage {

  isReadyToSave: boolean;

  item: Delivery;

  isAndroid: boolean;

  formattedAddress: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform) {
    this.isAndroid = platform.is('android');

    console.log(this.item);

    this.item = new Delivery();
    this.item.deliveryId = navParams.get('id')
    this.item.status = DeliveryStatus.New;

    this.isReadyToSave = true;
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    // Google Places API auto complete
    let input = document.getElementById('googlePlaces').getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(input, { types: ['geocode'] });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      let place = autocomplete.getPlace();
      console.log(place);
      this.item.address = place;
      this.formattedAddress = place.formatted_address;
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.viewCtrl.dismiss(this.item);
  }


}
