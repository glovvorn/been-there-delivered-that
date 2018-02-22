import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DeliveryService } from '../../services/delivery-service';
import { Auth, Logger } from 'aws-amplify';
import { DeliveryStatus } from '../../models/index';
const logger = new Logger('Deliveries');

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  newDeliveryCount: number = 0;
  userId: string;
  editAddress: boolean;
  googleLocation: any;
  address: string;
  formattedAddress: string;

  constructor(public navCtrl: NavController, private deliveryService: DeliveryService) { }

  getDeliveryCount() {
    this.deliveryService.getDeliveries(this.userId).subscribe((data) => {
      console.log(data);
      this.newDeliveryCount = data.filter(x => x.status === DeliveryStatus.New).length;
    });
  }

  ionViewWillEnter() {
    let input = document.getElementById('googlePlacesHome').getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(input, { types: ['geocode'] });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      let place = autocomplete.getPlace();
      this.googleLocation = place;
      this.formattedAddress = place.formatted_address;
    });
  }

  ionViewDidEnter() {
    //TODO(greg): user service
    Auth.currentCredentials()
      .then(credentials => {
        this.userId = credentials.identityId;
        this.getDeliveryCount();
      })
      .catch(err => logger.debug('get current credentials err', err));

      //TODO(greg): after user service is implemented uncomment this
      //this.getDeliveryCount();
  }

  editAddressToggle() {
    this.editAddress = true;
  }

  saveAddress() {
    this.address = this.formattedAddress;

    //TODO(greg): update user record

    this.editAddress = false;
  }

  cancelSaveAddress() {
    this.editAddress = false;
  }
}
