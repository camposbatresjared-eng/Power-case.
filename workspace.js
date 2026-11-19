class PowerCaseWorkspace {
 constructor({accounts,capture,restore,notify}){
  Object.assign(this,{accounts,capture,restore,notify});
  this.scope=undefined;
  this.userId=null;
  this.version=0;
  this.epoch=0;
  this.sequence=0;
  this.ready=false;
  this.dirty=false;
  this.saving=false;
  this.conflict=null;
  this.cacheTail=Promise.resolve();
  window.addEventListener('online',()=>this.retry());
  window.addEventListener('pagehide',()=>this.stash());
  window.addEventListener('beforeunload',event=>{
   if(this.userId&&this.dirty){event.preventDefault();event.returnValue='';}
  });
 }
 database(){
  this.databasePromise??=new Promise((resolve,reject)=>{
   const request=indexedDB.open('powercase-workspaces',1);
   request.onupgradeneeded=()=>request.result.createObjectStore('workspaces');
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  }).catch(error=>{this.databasePromise=null;throw error;});
  return this.databasePromise;
 }
 async cached(scope){
  try{
   await this.cacheTail;
   const db=await this.database();
   return await new Promise((resolve,reject)=>{
    const request=db.transaction('workspaces').objectStore('workspaces').get(scope);
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
   });
  }catch{return null;}
 }
 stash(scope=this.scope,record){
  if(scope===undefined)return this.cacheTail;
  record??={data:this.capture(),version:this.version,pending:this.dirty};
  this.cacheTail=this.cacheTail.catch(()=>{}).then(async()=>{
   const db=await this.database();
   await new Promise((resolve,reject)=>{
    const transaction=db.transaction('workspaces','readwrite');
    transaction.objectStore('workspaces').put(record,scope);
    transaction.oncomplete=resolve;
    transaction.onerror=()=>reject(transaction.error);
    transaction.onabort=()=>reject(transaction.error||new Error('Local save interrupted'));
   });
  }).catch(()=>{this.notify('local-error');});
  return this.cacheTail;
 }
 changed(){
  this.dirty=true;this.sequence++;
  if(!this.ready)this.localCandidate={data:this.capture(),version:this.version,pending:true};
  this.stash();
  clearTimeout(this.timer);
  if(this.ready&&!this.conflict&&this.userId){
   this.notify('pending');
   this.timer=setTimeout(()=>this.flush(),650);
  }else if(!this.userId)this.notify('guest');
 }
 async open(userId){
  const scope=userId||'guest';
  if(this.scope===scope)return;
  const epoch=++this.epoch;
  const previousScope=this.scope;
  await this.stash();
  const guest=previousScope==='guest'&&this.dirty?await this.cached('guest'):null;
  if(epoch!==this.epoch)return;
  clearTimeout(this.timer);
  this.scope=scope;this.userId=userId||null;this.version=0;
  this.ready=false;this.dirty=false;this.saving=false;this.conflict=null;
  this.restore(null);this.notify('loading');
  const local=await this.cached(scope);
  if(epoch!==this.epoch)return;
  if(!userId){
   if(local?.data)this.restore(local.data);
   this.dirty=Boolean(local?.pending);this.ready=true;this.notify('guest');return;
  }
  this.localCandidate=local?.pending?local:guest?.pending?guest:local;
  this.guestImport=this.localCandidate===guest?guest:null;
  await this.loadRemote(epoch);
 }
 async loadRemote(epoch=this.epoch){
  let loadTimer;
  try{
   const remote=await Promise.race([
    this.accounts.loadWorkspace(this.userId),
    new Promise((resolve,reject)=>{loadTimer=setTimeout(()=>reject(new Error('Workspace load timed out')),12000);})
   ]);
   clearTimeout(loadTimer);
   if(epoch!==this.epoch)return;
   const local=this.localCandidate;
   this.version=remote.version;
   if(local?.pending&&remote.data&&local.version!==remote.version){
    this.restore(local.data);this.dirty=true;this.ready=true;
    this.conflict=remote;this.notify('conflict');return;
   }
   const useLocal=local?.pending;
   this.restore(useLocal?local.data:remote.data);
   this.dirty=Boolean(useLocal);this.ready=true;this.localCandidate=null;
   await this.stash();
   if(epoch!==this.epoch)return;
   if(this.dirty)await this.flush();else this.notify('saved');
  }catch{
   if(epoch!==this.epoch)return;
   if(this.localCandidate?.data){this.restore(this.localCandidate.data);this.version=this.localCandidate.version;}
   this.dirty=Boolean(this.localCandidate?.pending);
   this.ready=false;this.notify('offline');
  }finally{
   clearTimeout(loadTimer);
  }
 }
 async flush(){
  if(!this.userId||!this.ready||!this.dirty||this.saving||this.conflict)return;
  const epoch=this.epoch,userId=this.userId;
  this.saving=true;this.notify('saving');
  try{
   while(this.dirty&&epoch===this.epoch){
    const sequence=this.sequence;
    const version=await this.accounts.saveWorkspace(userId,this.version,this.capture());
    if(epoch!==this.epoch)return;
    if(version===null){
     this.conflict=await this.accounts.loadWorkspace(userId);
     if(epoch!==this.epoch)return;
     this.notify('conflict');return;
    }
    this.version=version;this.dirty=sequence!==this.sequence;
    await this.stash();
    if(this.guestImport){await this.stash('guest',{...this.guestImport,pending:false});this.guestImport=null;}
   }
   if(epoch===this.epoch)this.notify('saved');
  }catch{
   if(epoch===this.epoch){this.dirty=true;await this.stash();this.notify('offline');}
  }finally{if(epoch===this.epoch)this.saving=false;}
 }
 async retry(){
  if(!this.userId)return;
  if(!this.ready){this.notify('loading');await this.loadRemote();}
  else await this.flush();
 }
 async resolve(choice){
  if(!this.conflict)return;
  this.version=this.conflict.version;
  if(choice==='remote'){this.restore(this.conflict.data);this.dirty=false;}
  else this.dirty=true;
  this.conflict=null;this.localCandidate=null;
  await this.stash();
  if(choice==='remote'&&this.guestImport){await this.stash('guest',{...this.guestImport,pending:false});this.guestImport=null;}
  if(this.dirty)await this.flush();else this.notify('saved');
 }
}
