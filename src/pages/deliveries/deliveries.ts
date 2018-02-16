import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { DeliveriesCreatePage } from '../deliveries-create/deliveries-create';
import { Delivery, DeliveryStatus } from '../../models/index';

import { DeliveryService } from '../../services/delivery-service';
import { IdService } from '../../services/id-service';

const logger = new Logger('Deliveries');

@Component({
  selector: 'page-deliveries',
  templateUrl: 'deliveries.html'
})
export class DeliveriesPage {

  public items: Delivery[];
  public newItems: Delivery[];
  public deliveredItems: Delivery[];
  public refresher: any;

  private userId: string;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private deliveryService: DeliveryService,
    private idService: IdService) {

    Auth.currentCredentials()
      .then(credentials => {
        this.userId = credentials.identityId;
        this.refreshDeliveries();
      })
      .catch(err => logger.debug('get current credentials err', err));
  }

  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshDeliveries();
  }

  refreshDeliveries() {
    this.deliveryService.refreshDeliveries(this.userId).subscribe((data) => {
      if (data) {
        this.items = data;
        this.assignArrays();
      }
    }),
      ((err) => {
        logger.debug('error in refresh deliveries', err)
      }
      ),
      (() => {
        this.refresher && this.refresher.complete()
      }
      );
  }

  assignArrays() {
    this.newItems = this.items.filter(x => x.status === DeliveryStatus.New);
    this.deliveredItems = this.items.filter(x => x.status === DeliveryStatus.Delivered);
  }

  addDelivery() {
    let id = this.idService.generateId();
    let addModal = this.modalCtrl.create(DeliveriesCreatePage, { 'id': id });
    addModal.onDidDismiss(item => {
      if (!item) { return; }
      this.deliveryService.addDelivery(item, this.userId).toPromise()
        .then(data => this.refreshDeliveries())
        .catch(err => logger.debug('add delivery error', err));
    })
    addModal.present();
  }

  deleteDelivery(delivery, index) {
    // const params = {
    //   'TableName': this.taskTable,
    //   'Key': {
    //     'userId': this.userId,
    //     'deliveryId': delivery.deliveryId
    //   }
    // };
    // this.db.getDocumentClient()
    //   .then(client => client.delete(params).promise())
    //   .then(data => this.items.splice(index, 1))
    //   .catch((err) => logger.debug('delete delivery error', err));
  }

}
