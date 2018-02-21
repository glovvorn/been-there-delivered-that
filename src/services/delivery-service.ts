import { Injectable } from '@angular/core';
import { Delivery, DeliveryStatus } from '../models/index';
import { DynamoDB } from '../providers/aws.dynamodb';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
const aws_exports = require('../aws-exports').default;
import { Logger } from 'aws-amplify';
const logger = new Logger('DeliveryService');

@Injectable()
export class DeliveryService {
    public deliveries: Array<Delivery>;

    private deliveryTable: string = aws_exports.aws_resource_name_prefix + '-Deliveries';

    constructor(private db: DynamoDB) {
        this.deliveries = [];
    }

    getDeliveries(userId: string): Observable<Delivery[]> {
        let callback = new AsyncSubject<Delivery[]>();

        const params = {
            'TableName': this.deliveryTable,
            'IndexName': 'DateSorted',
            'KeyConditionExpression': "#userId = :userId",
            'ExpressionAttributeNames': { '#userId': 'userId' },
            'ExpressionAttributeValues': { ':userId': userId },
            'ScanIndexForward': false
        };

        console.log(params);

        this.db.getDocumentClient()
            .then(client => client.query(params).promise())
            .then(data => {
                this.deliveries = data;
                callback.next(data.Items);
                callback.complete();
            })
            .catch(err => {
                logger.debug('error in get deliveries', err);
            })
            .then(() => {
                logger.debug('done with get deliveries');
            });

        return callback.asObservable();
    }

    addDelivery(delivery: Delivery, userId: string): Observable<Delivery> {
        let callback = new AsyncSubject<Delivery>();

        delivery.userId = userId;
        delivery.created = (new Date().getTime() / 1000);
        delivery.active = true;
        const params = {
            'TableName': this.deliveryTable,
            'Item': delivery,
            'ConditionExpression': 'attribute_not_exists(deliveryId)'
        };
        this.db.getDocumentClient()
            .then(client => client.put(params).promise())
            .then(data => {
                callback.next(data);
                callback.complete();
            })
            .catch(err => {
                logger.debug('add delivery error', err);
                callback.error(err);
                callback.complete();
            });

        return callback.asObservable();
    }

    updateDelivery(delivery: Delivery): Observable<Delivery> {
        let callback = new AsyncSubject<Delivery>();

        const params = {
            'TableName': this.deliveryTable,
            'Item': delivery,
            'ConditionExpression': 'attribute_exists(deliveryId)'
        };
        this.db.getDocumentClient()
            .then(client => client.put(params).promise())
            .then(data => {
                callback.next(data);
                callback.complete();
            })
            .catch((err) => {
                logger.debug('update delivery error', err);
                callback.error(err);
                callback.complete();
            });

        return callback.asObservable();
    }

    deleteDelivery(delivery: Delivery): Observable<Delivery> {
        delivery.status = DeliveryStatus.Deleted;
        delivery.active = false;
        return this.updateDelivery(delivery);   
    }
}