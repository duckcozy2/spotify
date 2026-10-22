const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const ts=require('typescript')
const previous=require.extensions['.ts']
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename)
const {seoArticles}=require('../lib/seo-articles.ts')
const {articles,articleLinks,articlePath}=require('../lib/articles.ts')
if(previous)require.extensions['.ts']=previous
else delete require.extensions['.ts']

test('all 30 requested articles have complete, distinct content and SEO fields',()=>{
  assert.equal(seoArticles.length,30)
  assert.equal(new Set(seoArticles.map(a=>a.slug)).size,30)
  assert.equal(new Set(seoArticles.map(a=>a.title)).size,30)
  for(const article of seoArticles){
    assert.ok(article.keyword,article.slug)
    assert.ok(article.description.length>=80,article.slug)
    assert.equal(article.sections.length,4,article.slug)
    assert.equal(new Set(article.sections.map(s=>s.id)).size,article.sections.length,article.slug)
    assert.ok(article.sections.flatMap(s=>[...s.paragraphs,...s.steps||[]]).join(' ').split(/\s+/).length>=250,article.slug)
    assert.ok(article.source.url.startsWith('https://'),article.slug)
  }
})
test('the ten launch priorities use exactly the requested root URLs and ordering',()=>{
  assert.deepEqual(seoArticles.filter(a=>a.priority).map(articlePath),[
    '/spotify-premium-gia-re','/spotify-premium-ios','/bang-gia-spotify-premium','/mua-spotify-premium-iphone','/mua-spotify-premium-gia-re','/cach-nang-cap-spotify-premium','/spotify-premium-ios-gia-re','/spotify-premium-1-nam','/spotify-premium-vs-free','/kiem-tra-han-spotify-premium'
  ])
})
test('article registry and sitemap links have unique slugs and canonical paths',()=>{
  assert.equal(new Set(articles.map(a=>a.slug)).size,articles.length)
  assert.equal(new Set(articleLinks.map(a=>a.href)).size,articleLinks.length)
  for(const article of seoArticles)assert.ok(articleLinks.some(a=>a.href===articlePath(article)),article.slug)
})
test('price articles use live pricing instead of fixed VND prices',()=>{
  for(const article of seoArticles.filter(a=>a.pricing)){
    assert.doesNotMatch(JSON.stringify(article),/\d{2,3}\.\d{3}\s*đ/)
  }
})
