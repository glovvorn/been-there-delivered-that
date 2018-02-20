import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { DeliveryService } from '../../services/delivery-service';
import { Auth, Logger } from 'aws-amplify';
import { Delivery, DeliveryStatus } from '../../models/index';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs/Observable';
const logger = new Logger('Map');

declare var google;

@Component({
  selector: 'map-page',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  userId: string;
  markers: any[] = [];

  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    private deliveryService: DeliveryService) {

    Auth.currentCredentials()
      .then(credentials => {
        this.userId = credentials.identityId;
      })
      .catch(err => logger.debug('get current credentials err', err));
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  ionViewDidEnter() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers.length = 0;

    this.getDeliveries();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }, (err) => {
      console.log(err);

      let mapOptions = {
        center: new google.maps.LatLng(41.850033, -87.6500523),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    });
  }

  getDeliveries() {
    console.log('getDeliveries');

    this.deliveryService.getDeliveries(this.userId).subscribe((data) => {
      console.log(data);
      let deliveries = data.filter(x => x.status === DeliveryStatus.New);

      console.log(deliveries);

      for (let d of deliveries) {
        console.log(d.name);
        if (d.address && d.address.formatted_address) {
          this.getLocationForDelivery(d.address.formatted_address).subscribe((position) => {
            this.addMarker(position, this.generateContentForDelivery(d));
          });
        }
      }
    });
  }


  addMarker(position: any, content: string) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });

    this.addInfoWindow(marker, content);

    this.markers.push(marker);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  getLocationForDelivery(address: any): Observable<any> {
    let callback = new AsyncSubject<any>();
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === 'OK') {
        callback.next(results[0].geometry.location);
        callback.complete();
      } else {
        callback.error(status);
        callback.complete();
      }
    });
    return callback.asObservable();
  }

  generateContentForDelivery(delivery: Delivery): string {
    let html = '<h3>' + delivery.name + '</h3>';
    if (delivery.address && delivery.address.formatted_address) {
      html += '<p><b>' + delivery.address.formatted_address + '</b></p>';
    }
    if (delivery.notes) {
      html += '<p>' + delivery.notes + '</p>';
    }

    return html;
  }
}