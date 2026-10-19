import type {Order} from './admin-store'
const localDay=(date:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(date)
export function revenueRows(orders:Order[],now=new Date()){
  const day=localDay(now),month=day.slice(0,7)
  const paid=orders.filter(o=>o.paid&&o.status!=='Đã hủy')
  const aggregate=(items:Order[])=>({count:items.length,amount:items.reduce((sum,o)=>sum+o.amount,0)})
  return [{label:'Hôm nay',...aggregate(paid.filter(o=>localDay(new Date(o.paidAt||o.createdAt))===day))},{label:`Tháng ${day.slice(5,7)}/${day.slice(0,4)}`,...aggregate(paid.filter(o=>localDay(new Date(o.paidAt||o.createdAt)).startsWith(month)))},{label:'Tổng cộng',...aggregate(paid)}]
}
