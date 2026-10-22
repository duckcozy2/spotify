import {readPrivate,updatePrivate} from './private-store'
export {premiumPlans as adminPlans} from './plans'
export const statuses=['Chờ xử lý','Đang xử lý','Hoàn tất','Đã hủy'] as const
export type Status=typeof statuses[number]
export type Order={id:string;username:string;phone:string;planId:string;planName:string;amount:number;status:Status;paid:boolean;paidAt?:string;paymentToken?:string;transferContent?:string;expiresAt?:string;paymentTransactionId?:string;couponCode?:string;originalAmount?:number;note:string;createdAt:string}
export async function readOrders():Promise<Order[]>{return readPrivate<Order[]>('orders',[])}
export async function updateOrders(change:(orders:Order[])=>Order[]){await updatePrivate<Order[]>('orders',[],change)}
