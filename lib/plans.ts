// Shared package codes for the storefront and Premium provider.
export const premiumPlans=[
 {id:'1month',name:'Premium 1 tháng',price:49000,period:'/tháng',desc:'Dành cho người muốn trải nghiệm'},
 {id:'3month',name:'Premium 3 tháng',price:119000,period:'/3 tháng',desc:'Trải nghiệm Premium trong 3 tháng'},
 {id:'6month',name:'Premium 6 tháng',price:199000,period:'/6 tháng',desc:'Trải nghiệm Premium trong 6 tháng',popular:true,badge:'Phổ biến'},
 {id:'12month',name:'Premium 1 năm',price:299000,period:'/năm',desc:'Lựa chọn tiết kiệm cho cả năm',badge:'Tiết kiệm nhất'},
] as const
export type PremiumPlanId=typeof premiumPlans[number]['id']
