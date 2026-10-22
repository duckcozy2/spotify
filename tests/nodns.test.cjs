const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const ts=require('typescript')
function load(file,mocks={}){
  const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
  const module={exports:{}}
  new Function('require','module','exports',source)(name=>name in mocks?mocks[name]:require(name),module,module.exports)
  return module.exports
}
const provider=load('lib/nodns.ts')
function fixture(){
  let orders=[{id:'o1',username:'customer',planId:'12month',paid:true,status:'Đang xử lý',amount:299000}]
  let records=[],calls=0,reply={state:'confirmed',code:'confirmed'}
  const service=load('lib/premium-operations.ts',{
    './private-store':{readPrivate:async()=>structuredClone(records),updatePrivate:async(_key,_defaults,change)=>{records=change(structuredClone(records))}},
    './admin-store':{readOrders:async()=>structuredClone(orders),updateOrders:async change=>{orders=change(structuredClone(orders))}},
    './integration-config':{integrationConfig:async()=>({nodnsKey:'mock-key'})},
    './nodns':{requestPremium:async()=>{calls++;return typeof reply==='function'?reply():reply}},
    './plans':{premiumPlans:['1month','3month','6month','12month'].map(id=>({id}))}
  })
  return {service,get orders(){return orders},set orders(value){orders=value},get records(){return records},get calls(){return calls},set reply(value){reply=value}}
}
test('grant sends the exact documented package and server key; cancel sends only UID',async()=>{
  const calls=[]
  const transport=async(url,options)=>{calls.push({url,...options});return Response.json({success:true,data:{uid:'customer'}})}
  assert.equal((await provider.requestPremium('grant','customer','private-key','12month',transport)).state,'confirmed')
  assert.equal((await provider.requestCancellation('customer','private-key',transport)).state,'confirmed')
  assert.equal(calls[0].url,'https://ctv.nodns.vn/api/v1/spotify')
  assert.deepEqual(JSON.parse(calls[0].body),{uid:'customer',packageId:'12month'})
  assert.equal(calls[0].headers['x-api-key'],'private-key')
  assert.equal(calls[1].url,'https://ctv.nodns.vn/api/v1/spotify/cancel')
  assert.deepEqual(JSON.parse(calls[1].body),{uid:'customer'})
})
test('a 2xx response alone, conflicting identity or timeout cannot complete a grant',async()=>{
  assert.equal(provider.providerResult({},'customer','grant').state,'unknown')
  assert.equal(provider.providerResult({success:true,data:{uid:'other'}},'customer','grant').state,'unknown')
  assert.equal(provider.providerResult({success:true,data:{packageId:'1month'}},'customer','grant','12month').state,'unknown')
  assert.equal(provider.cancelResult({success:true,data:{active:true}},'customer').state,'unknown')
  assert.equal(provider.providerResult({success:false},'customer','grant').state,'rejected')
  assert.equal((await provider.requestPremium('grant','customer','key','12month',async()=>{throw new Error('timeout')})).state,'unknown')
})
test('invalid package and UID never reach the provider',async()=>{
  let calls=0;const fetcher=async()=>{calls++;return Response.json({success:true})}
  await provider.requestPremium('grant','customer','key','1year',fetcher)
  await provider.requestCancellation('bad@email','key',fetcher)
  assert.equal(calls,0)
})
test('unpaid orders never grant; successful repeated calls cannot grant twice',async()=>{
  const f=fixture();f.orders=[{...f.orders[0],paid:false}]
  await assert.rejects(f.service.runPremiumOperation('grant','o1'),/unpaid_order/)
  assert.equal(f.calls,0)
  f.orders=[{...f.orders[0],paid:true}]
  await f.service.runPremiumOperation('grant','o1')
  await f.service.runPremiumOperation('grant','o1')
  assert.equal(f.calls,1);assert.equal(f.orders[0].status,'Hoàn tất')
})
test('a pending call atomically blocks concurrent grants',async()=>{
  const f=fixture();let complete
  f.reply=()=>new Promise(resolve=>{complete=resolve})
  const first=f.service.runPremiumOperation('grant','o1')
  while(!complete)await new Promise(resolve=>setImmediate(resolve))
  await assert.rejects(f.service.runPremiumOperation('grant','o1'),/operation_locked/)
  complete({state:'confirmed',code:'confirmed'});await first
  assert.equal(f.calls,1)
})
test('uncertain provider results require explicit review before retry',async()=>{
  const f=fixture();f.reply={state:'unknown',code:'connection_uncertain'}
  await f.service.runPremiumOperation('grant','o1')
  assert.equal(f.orders[0].status,'Đang xử lý')
  await assert.rejects(f.service.runPremiumOperation('grant','o1'),/operation_locked/)
  await f.service.reviewPremiumOperation(f.records[0].id,'rejected','Checked provider: not executed')
  f.reply={state:'confirmed',code:'confirmed'}
  await f.service.runPremiumOperation('grant','o1')
  assert.equal(f.calls,2)
})
test('cancel requires a completed paid order and exact UID confirmation',async()=>{
  const f=fixture()
  await assert.rejects(f.service.runPremiumOperation('cancel','o1','customer'),/invalid_order/)
  f.orders=[{...f.orders[0],status:'Hoàn tất'}]
  await assert.rejects(f.service.runPremiumOperation('cancel','o1','other'),/invalid_order/)
  await f.service.runPremiumOperation('cancel','o1','customer')
  assert.equal(f.calls,1);assert.equal(f.orders[0].status,'Đã hủy');assert.equal(f.orders[0].paid,true)
})

test('SePay reconciles payment before activation and never grants on a duplicate or wrong amount',async()=>{
  let orders=[{id:'o1',username:'customer',planId:'12month',amount:299000,paid:false,status:'Chờ xử lý',transferContent:'SP0123456789ABCDEF',expiresAt:new Date(Date.now()+60000).toISOString()}],calls=0,operations=[]
  const payment=load('lib/payment.ts')
  const route=load('app/api/sepay/webhook/route.ts',{
    '@/lib/admin-store':{updateOrders:async change=>{orders=change(orders)}},
    '@/lib/payment':payment,
    '@/lib/integration-config':{integrationConfig:async()=>({sepayKey:'webhook-secret'})},
    '@/lib/payment-events':{recordPaymentEvent:async()=>{}},
    '@/lib/premium-operations':{readPremiumOperations:async()=>operations,runPremiumOperation:async(kind,id)=>{assert.equal(orders[0].paid,true);assert.equal(id,'o1');calls++;operations.push({kind,orderId:id});return {state:'confirmed'}}}
  })
  const payload={id:123,transferType:'in',gateway:'MBBank',accountNumber:'5565662518',content:'SP0123456789ABCDEF',transferAmount:299000}
  const request=(body,key='webhook-secret')=>new Request('https://example.test/api/sepay/webhook',{method:'POST',headers:{Authorization:'Apikey '+key,'Content-Type':'application/json'},body:JSON.stringify(body)})
  assert.equal((await route.POST(request(payload,'wrong'))).status,401)
  await route.POST(request({...payload,transferAmount:1}));assert.equal(calls,0)
  await route.POST(request(payload));assert.equal(calls,1)
  await route.POST(request(payload));assert.equal(calls,1)
})
