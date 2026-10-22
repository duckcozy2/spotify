const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const Module=require('node:module')
const ts=require('typescript')
const compiled=ts.transpileModule(fs.readFileSync('lib/payment.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
const mod=new Module(require('node:path').resolve('lib/payment.ts'),module)
mod.filename=require('node:path').resolve('lib/payment.ts')
mod._compile(compiled,mod.filename)
const {bank,validWebhookKey,reconcilePayment,publicPayment}=mod.exports
const now=new Date('2026-10-22T06:00:00Z')
const order={id:'order',planId:'3month',planName:'Premium 3 months',username:'user',phone:'0912345678',amount:147000,paid:false,status:'Chờ xử lý',createdAt:now.toISOString(),expiresAt:'2026-10-22T06:30:00Z',transferContent:'SP0123456789ABCDEF',paymentToken:'private-token',note:''}
const payload={id:123,gateway:'MBBank',transferType:'in',accountNumber:bank.account,transferAmount:147000,content:'Transfer SP0123456789ABCDEF'}
test('webhook requires the correct API key',()=>{
  assert.equal(validWebhookKey('Apikey secret','secret'),true)
  for(const header of [null,'','Bearer secret','Apikey wrong'])assert.equal(validWebhookKey(header,'secret'),false)
  assert.equal(validWebhookKey('Apikey ',''),false)
})
test('matching payment records payment without completing Premium activation',()=>{
  const result=reconcilePayment([order],payload,now)[0]
  assert.equal(result.paid,true);assert.equal(result.status,'Đang xử lý');assert.equal(result.paymentTransactionId,'123')
  assert.equal(order.paid,false)
})
test('wrong account, bank, direction, amount, missing code and malformed transaction cannot mark paid',()=>{
  for(const patch of [{accountNumber:'other'},{gateway:'VCB'},{transferType:'out'},{transferAmount:146999},{transferAmount:147001},{transferAmount:'147000'},{id:0},{id:null},{content:'LG01234567'},{content:payload.content+' SPAAAAAAAAAAAAAAAA'}]){
    assert.equal(reconcilePayment([order],{...payload,...patch},now)[0].paid,false,JSON.stringify(patch))
  }
})
test('expired and cancelled orders are never automatically paid',()=>{
  assert.equal(reconcilePayment([{...order,expiresAt:now.toISOString()}],payload,now)[0].paid,false)
  assert.equal(reconcilePayment([{...order,status:'Đã hủy'}],payload,now)[0].paid,false)
})
test('webhook retries and concurrent duplicate IDs cannot pay a second order',()=>{
  const paid=reconcilePayment([order],payload,now)
  assert.deepEqual(reconcilePayment(paid,payload,now),paid)
  const other={...order,id:'other',transferContent:'SPAAAAAAAAAAAAAAAA'}
  assert.equal(reconcilePayment([...paid,other],{...payload,content:other.transferContent},now)[1].paid,false)
})
test('public payment includes server amount in QR and excludes private customer information',()=>{
  const view=publicPayment(order),url=new URL(view.qrUrl)
  assert.equal(url.searchParams.get('acc'),'5565662518');assert.equal(url.searchParams.get('bank'),'970422')
  assert.equal(url.searchParams.get('amount'),'147000');assert.equal(url.searchParams.get('des'),order.transferContent)
  for(const key of ['paymentToken','username','phone','note'])assert.equal(key in view,false)
})
