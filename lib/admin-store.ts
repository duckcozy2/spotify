import {mkdir,readFile,rename,writeFile} from 'node:fs/promises'
import path from 'node:path'
import {randomUUID} from 'node:crypto'
export const adminPlans=[{id:'month',name:'Premium 1 tháng',price:49000},{id:'year',name:'Premium 1 năm',price:299000},{id:'lifetime',name:'Premium vĩnh viễn',price:499000}] as const
export const statuses=['Chờ xử lý','Đang xử lý','Hoàn tất','Đã hủy'] as const
export type Status=typeof statuses[number]
export type Order={id:string;username:string;phone:string;planId:string;planName:string;amount:number;status:Status;paid:boolean;paidAt?:string;couponCode?:string;originalAmount?:number;note:string;createdAt:string}
const directory=path.resolve(process.env.ADMIN_DATA_DIR||path.join(process.cwd(),'.data'))
const file=path.join(directory,'orders.json')
let queue:Promise<unknown>=Promise.resolve()
export async function readOrders():Promise<Order[]>{try{const data=JSON.parse(await readFile(file,'utf8'));if(!Array.isArray(data))throw new Error('Invalid order store');return data}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return [];throw error}}
export async function updateOrders(change:(orders:Order[])=>Order[]){const operation=queue.then(async()=>{const orders=change(await readOrders());await mkdir(directory,{recursive:true});const temporary=path.join(directory,'orders-'+randomUUID()+'.tmp');await writeFile(temporary,JSON.stringify(orders,null,2),'utf8');await rename(temporary,file)});queue=operation.catch(()=>{});await operation}
