class PowerCaseAccounts {
 constructor(config){
  this.config=config||{};
  this.clientPromise=null;
 }
 get configured(){return Boolean(this.config.url&&this.config.publishableKey);}
 async fetch(input,options={}){
  const controller=new AbortController();
  const abort=()=>controller.abort();
  if(options.signal?.aborted)abort();else options.signal?.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(abort,12000);
  try{return await fetch(input,{...options,signal:controller.signal});}
  finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort);}
 }
 async client(){
  if(!this.configured)throw new Error('Las cuentas aún están pendientes de activación.');
  this.clientPromise??=import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm').then(({createClient})=>createClient(this.config.url,this.config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},global:{fetch:(input,options)=>this.fetch(input,options)}})).catch(error=>{this.clientPromise=null;throw error;});
  return this.clientPromise;
 }
 async initialize(onUser){
  if(!this.configured){onUser(null);return;}
  const client=await this.client();
  let revision=0;
  client.auth.onAuthStateChange((event,session)=>{
   if(event==='INITIAL_SESSION'&&!session?.user)return;
   revision++;
   setTimeout(()=>onUser(session?.user||null),0);
  });
  const {data,error}=await client.auth.getUser();
  if(error&&error.name!=='AuthSessionMissingError')throw error;
  if(revision===0)await onUser(data?.user||null);
 }
 async signIn(email,password){
  const client=await this.client();
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error)throw error;
  return data;
 }
 async signUp(name,email,password){
  const client=await this.client();
  const options={data:{full_name:name}};
  const publicSites=['https://power-case.pages.dev/','https://powercase1.netlify.app/','https://camposbatresjared-eng.github.io/Power-case./'];
  const current=location.origin+location.pathname;
  options.emailRedirectTo=publicSites.includes(current)?current:'https://power-case.pages.dev/';
  const {data,error}=await client.auth.signUp({email,password,options});
  if(error)throw error;
  return data;
 }
 async signOut(){
  const client=await this.client();
  const {error}=await client.auth.signOut();
  if(error)throw error;
 }
 async favorites(userId){
  const client=await this.client();
  const {data,error}=await client.from('powercase_favorites').select('model_id,finish_id').eq('user_id',userId).order('created_at',{ascending:true});
  if(error)throw error;
  return data;
 }
 async saveFavorite(userId,model,finish){
  const client=await this.client();
  const {error}=await client.from('powercase_favorites').upsert({user_id:userId,model_id:model,finish_id:finish},{onConflict:'user_id,model_id,finish_id',ignoreDuplicates:true});
  if(error)throw error;
 }
 async removeFavorite(userId,model,finish){
  const client=await this.client();
  const {error}=await client.from('powercase_favorites').delete().eq('user_id',userId).eq('model_id',model).eq('finish_id',finish);
  if(error)throw error;
 }
 async loadWorkspace(userId){
  const client=await this.client();
  const {data,error}=await client.from('powercase_workspaces').select('data,version').eq('user_id',userId).maybeSingle();
  if(error)throw error;
  if(!data)return {data:null,version:0};
  return {data:await this.workspacePhotos(userId,data.data,false),version:data.version};
 }
 async saveWorkspace(userId,version,state){
  const data=await this.workspacePhotos(userId,state,true);
  const client=await this.client();
  const result=await client.rpc('powercase_save_workspace',{p_user_id:userId,p_expected_version:version,p_data:data});
  if(result.error)throw result.error;
  return result.data;
 }
 async workspacePhotos(userId,state,upload){
  const client=await this.client();
  const sources=new Map();
  const walk=async value=>{
   if(typeof value==='string'){
    const photo=upload?/^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value):/^powercase-photo:[a-f0-9]{64}$/.test(value);
    if(!photo)return value;
    if(!sources.has(value))sources.set(value,(async()=>{
     if(upload){
      const blob=await fetch(value).then(response=>response.blob());
      const digest=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());
      const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
      const result=await client.storage.from('powercase-designs').upload(`${userId}/${hash}`,blob,{upsert:false,contentType:blob.type});
      if(result.error&&String(result.error.statusCode)!=='409')throw result.error;
      return `powercase-photo:${hash}`;
     }
     const result=await client.storage.from('powercase-designs').download(`${userId}/${value.slice('powercase-photo:'.length)}`);
     if(result.error)throw result.error;
     return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(result.data);});
    })());
    return await sources.get(value);
   }
   if(Array.isArray(value))return await Promise.all(value.map(walk));
   if(value&&typeof value==='object'){
    const entries=await Promise.all(Object.entries(value).map(async([key,item])=>[key,await walk(item)]));
    return Object.fromEntries(entries);
   }
   return value;
  };
  return await walk(state);
 }
}
