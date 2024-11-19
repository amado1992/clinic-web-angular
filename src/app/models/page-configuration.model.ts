import { Order } from './order.enum';

export interface PageConfiguration {
    order: Order;
    property: string;
    page: number;
    size: number;
}
