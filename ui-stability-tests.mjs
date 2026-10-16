import assert from 'node:assert/strict';
import {installI18n,setLanguage,setLocalizedText,translateText,isAtlasShortcut} from './i18n.js?v=1.5.1';
// A small DOM with observable text mutations. This checks the translation
// lifecycle (including before-paint delivery), rather than a screenshot mock.
const microtasks=[],observers=[],events=new Map();let writes=0,walks=0;
function notify(record){for(const observer of observers)if(observer.active&&observer.root.contains(record.target)&&(!record.attributeName||observer.options.attributeFilter.includes(record.attributeName))){observer.records.push(record);if(!observer.queued){observer.queued=true;microtasks.push(()=>{observer.queued=false;const records=observer.takeRecords();if(observer.active&&records.length)observer.callback(records);});}}}
class TextNode{
 constructor(value,parent){this.nodeType=3;this.value=value;this.parentElement=parent;}
 get nodeValue(){return this.value;}set nodeValue(value){this.value=value;writes++;notify({type:'characterData',target:this});}
 get textContent(){return this.value;}get isConnected(){return this.parentElement?.isConnected??false;}
 contains(node){return node===this;}
}
const matches=(el,selector)=>selector==='option'?el.tagName==='OPTION':selector==='script'||selector==='style'||selector==='input'||selector==='textarea'?el.tagName===selector.toUpperCase():selector.startsWith('[')?(()=>{const m=selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return m&&el.hasAttribute(m[1])&&(m[2]===undefined||el.getAttribute(m[1])===m[2]);})():false;
class Element{
 constructor(tag='div',id=''){this.nodeType=1;this.tagName=tag.toUpperCase();this.id=id;this.children=[];this.attributes=new Map();this.dataset={};this.parentElement=null;}
 get isConnected(){return this===document.body||!!this.parentElement?.isConnected;}
 get firstChild(){return this.children[0]??null;}
 get textContent(){return this.children.map(n=>n.textContent).join('');}
 set textContent(value){for(const c of this.children)c.parentElement=null;const node=new TextNode(String(value),this);this.children=[node];writes++;notify({type:'childList',target:this,addedNodes:[node]});}
 get value(){return this.attributes.get('value')??this.textContent;}set value(value){this.attributes.set('value',value);}
 get isContentEditable(){return this.getAttribute('contenteditable')==='true'||this.getAttribute('contenteditable')==='';}
 hasAttribute(key){return this.attributes.has(key);}getAttribute(key){return this.attributes.get(key)??null;}
 setAttribute(key,value){this.attributes.set(key,String(value));notify({type:'attributes',target:this,attributeName:key});}
 append(child){child.parentElement=this;this.children.push(child);notify({type:'childList',target:this,addedNodes:[child]});}
 contains(node){return node===this||this.children.some(c=>c.contains(node));}
 closest(selector){for(let el=this;el;el=el.parentElement)if(selector.split(',').some(s=>matches(el,s)))return el;return null;}
 querySelectorAll(selector){const result=[];const visit=el=>{for(const child of el.children)if(child.nodeType===1){if(selector.split(',').some(s=>matches(child,s)))result.push(child);visit(child);}};visit(this);return result;}
}
class FakeObserver{
 constructor(callback){this.callback=callback;this.records=[];observers.push(this);}
 observe(root,options){this.root=root;this.options=options;this.active=true;}
 disconnect(){this.active=false;this.records=[];}takeRecords(){const records=this.records;this.records=[];return records;}
}
const elements=new Map(),document={documentElement:{dataset:{}},body:null,
 createTreeWalker(root){walks++;const nodes=[];const visit=node=>{for(const c of node.children??[])if(c.nodeType===3)nodes.push(c);else visit(c);};visit(root);let i=0;return {nextNode:()=>nodes[i++]??null};},
 getElementById:id=>elements.get(id),
 addEventListener(type,callback){if(!events.has(type))events.set(type,new Set());events.get(type).add(callback);},
 removeEventListener(type,callback){events.get(type)?.delete(callback);},
 dispatchEvent(event){for(const fn of events.get(event.type)??[])fn(event);}
};
document.body=new Element('body');
function element(tag,id,text=''){const el=new Element(tag,id);el.textContent=text;if(id)elements.set(id,el);return el;}
const label=element('b','mode-label','SAFE HAVEN'),button=element('button','map-button','Island Atlas'),typeOption=element('option','','water'),typeSelect=element('select','type-filter'),langSelect=element('select','language-select');
typeSelect.append(typeOption);for(const el of [label,button,typeSelect,langSelect])document.body.append(el);
const oldGlobals=Object.fromEntries(['document','NodeFilter','MutationObserver','queueMicrotask','localStorage','CustomEvent'].map(k=>[k,globalThis[k]]));
Object.assign(globalThis,{document,NodeFilter:{SHOW_TEXT:4},MutationObserver:FakeObserver,queueMicrotask:fn=>microtasks.push(fn),localStorage:{getItem:()=>null,setItem(){}},CustomEvent:class{constructor(type){this.type=type;}}});
function flush(){let count=0;while(microtasks.length){assert(++count<100,'translation observer feedback loop');microtasks.shift()();}}
let installation;try{
 installation=installI18n();assert.equal(installI18n(),installation,'installer must be idempotent');
 assert.equal(label.textContent,'安全主城');assert.equal(button.textContent,'世界地圖');
 assert.equal(typeOption.textContent,'水');assert.equal(typeOption.value,'water','localized type labels preserve filter values');
 setLocalizedText(label,'WILDS · LV. 8–12');assert(!label.textContent.includes('WILDS'),'live HUD must be Chinese synchronously, before observer delivery');
 flush();const unchangedWrites=writes;for(let i=0;i<100;i++)setLocalizedText(label,'WILDS · LV. 8–12');assert.equal(writes,unchangedWrites,'stable HUD must not replace unchanged text');
 setLanguage('en',false);assert.equal(label.textContent,'WILDS · LV. 8–12');assert.equal(button.textContent,'Island Atlas');assert.equal(typeOption.value,'water');
 setLanguage('zh-Hant',false);assert.equal(button.textContent,'世界地圖');
 const newButton=element('button','','Back to atlas');document.body.append(newButton);const before=walks;flush();assert.equal(newButton.textContent,'返回世界地圖');assert.equal(walks-before,1,'only added subtree should be traversed');
 newButton.firstChild.nodeValue='Weapon Codex';flush();assert.equal(newButton.textContent,'武器圖鑑');setLanguage('en',false);assert.equal(newButton.textContent,'Weapon Codex','dynamic English source survives a language toggle');
 const input=element('input','',''),editable=element('div','','');editable.setAttribute('contenteditable','true');
 assert(isAtlasShortcut({key:'m',target:langSelect}));assert(isAtlasShortcut({key:'M',target:button}));
 assert(!isAtlasShortcut({key:'m',target:input}));assert(!isAtlasShortcut({key:'m',target:editable}));
 for(const flag of ['repeat','isComposing','ctrlKey','metaKey','altKey'])assert(!isAtlasShortcut({key:'m',target:button,[flag]:true}));
 assert.equal(translateText('Island Atlas'),'Island Atlas');installation.dispose();
 console.log('PASS synchronous localized HUD, no repeated writes, incremental translation, stable option values, reversible language changes and atlas shortcuts');
}finally{installation?.dispose();for(const [key,value] of Object.entries(oldGlobals))if(value===undefined)delete globalThis[key];else globalThis[key]=value;setLanguage('en',false);}
