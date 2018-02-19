import { DeliveryStatus } from './delivery-status';

export class Delivery {
    userId: string;
    created: number;

    public deliveryId: string;
    public status: DeliveryStatus;
    public name: string;
    public address: any;
    public notes: string;
    public active: boolean;
}