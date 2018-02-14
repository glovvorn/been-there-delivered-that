import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { DeliveriesCreatePage } from '../deliveries-create/deliveries-create';
const aws_exports = require('../../aws-exports').default;

import { DynamoDB } from '../../providers/providers';

const logger = new Logger('Deliveries');

@Component({
  selector: 'page-deliveries',
  templateUrl: 'deliveries.html'
})
export class DeliveriesPage {

  public items: any;
  public refresher: any;
  private taskTable: string = aws_exports.aws_resource_name_prefix + '-Deliveries';
  private userId: string;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public db: DynamoDB) {

    Auth.currentCredentials()
      .then(credentials => {
        this.userId = credentials.identityId;
        this.refreshDeliveries();
      })
      .catch(err => logger.debug('get current credentials err', err));
  }

  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshDeliveries()
  }

  refreshDeliveries() {
    const params = {
      'TableName': this.taskTable,
      'IndexName': 'DateSorted',
      'KeyConditionExpression': "#userId = :userId",
      'ExpressionAttributeNames': { '#userId': 'userId' },
      'ExpressionAttributeValues': { ':userId': this.userId },
      'ScanIndexForward': false
    };
    this.db.getDocumentClient()
      .then(client => client.query(params).promise())
      .then(data => { this.items = data.Items; })
      .catch(err => logger.debug('error in refresh deliveries', err))
      .then(() => { this.refresher && this.refresher.complete() });
  }

  generateId() {
    var len = 16;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLength = chars.length;
    var result = "";
    let randoms = window.crypto.getRandomValues(new Uint32Array(len));
    for(var i = 0; i < len; i++) {
      result += chars[randoms[i] % charLength];
    }
    return result.toLowerCase();
  }

  addDelivery() {
    let id = this.generateId();
    let addModal = this.modalCtrl.create(DeliveriesCreatePage, { 'id': id });
    addModal.onDidDismiss(item => {
      if (!item) { return; }
      item.userId = this.userId;
      item.created = (new Date().getTime() / 1000);
      const params = {
        'TableName': this.taskTable,
        'Item': item,
        'ConditionExpression': 'attribute_not_exists(id)'
      };
      this.db.getDocumentClient()
        .then(client => client.put(params).promise())
        .then(data => this.refreshDeliveries())
        .catch(err => logger.debug('add delivery error', err));
    })
    addModal.present();
  }

  deleteDelivery(delivery, index) {
    const params = {
      'TableName': this.taskTable,
      'Key': {
        'userId': this.userId,
        'deliveryId': delivery.deliveryId
      }
    };
    this.db.getDocumentClient()
      .then(client => client.delete(params).promise())
      .then(data => this.items.splice(index, 1))
      .catch((err) => logger.debug('delete delivery error', err));
  }

}
