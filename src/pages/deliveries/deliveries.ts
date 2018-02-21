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

  public items: Delivery[] = [];
  public newItems: Delivery[] = [];
  public deliveredItems: Delivery[] = [];
  public refresher: any;

  private userId: string;

  outstandingEditButtonName: string = 'edit';
  editOutstandingList: boolean = false;
  completedEditButtonName: string = 'edit';
  editCompletedList: boolean = false;

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
    this.deliveryService.getDeliveries(this.userId).subscribe((data) => {
      if (data) {
        this.items = data;
        this.assignArrays();
      }

      this.refresher && this.refresher.complete();
    }),
      ((err) => {
        logger.debug('error in refresh deliveries', err);
      }
      ),
      (() => {
        this.refresher && this.refresher.complete();
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

  completeDelivery(delivery, index) {
    delivery.status = DeliveryStatus.Delivered;

    this.deliveryService.updateDelivery(delivery).subscribe(data => {
      this.refreshDeliveries();
    })
  }

  deleteDelivery(delivery, index) {
    this.deliveryService.deleteDelivery(delivery).subscribe(data => {
      this.refreshDeliveries();
    });
  }

  reorderOutstandingItems(indexes) {
    let element = this.newItems[indexes.from];
    this.newItems.splice(indexes.from, 1);
    this.newItems.splice(indexes.to, 0, element);
  }
  
  reorderCompletedItems(indexes) {
    let element = this.deliveredItems[indexes.from];
    this.deliveredItems.splice(indexes.from, 1);
    this.deliveredItems.splice(indexes.to, 0, element);
  }

  editList(list: string) {
    if (list === 'outstanding') {
      this.editOutstandingList = !this.editOutstandingList;
      this.outstandingEditButtonName = (this.outstandingEditButtonName === 'edit') ? 'done' : 'edit';
    } else {
      this.editCompletedList = !this.editCompletedList;
      this.completedEditButtonName = (this.completedEditButtonName === 'edit') ? 'done' : 'edit';
    }
  }
}
