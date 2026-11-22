const $=s=>document.querySelector(s);
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function icon(name){const nodes=ICONS[name]||[];return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${nodes.map(([tag,attrs])=>`<${tag} ${Object.entries(attrs).filter(([k])=>k!=='key').map(([k,v])=>`${k}="${v}"`).join(' ')}/>`).join('')}</svg>`;}
const getModel=id=>MODELS.find(m=>m.id===id)||MODELS[0];
const getFinish=id=>FINISHES.find(f=>f.id===id)||FINISHES[0];
let modelId='iphone17',group='todo',query='',mode='signin',session=null,bag=[],pending=null,timer;
const accounts=new PowerCaseAccounts(window.POWERCASE_ACCOUNT_CONFIG);
let workspace;
let accountInitializing=true,accountInitialization=Promise.resolve();
async function within(promise,message,milliseconds=12000){
 let deadline;
 try{return await Promise.race([promise,new Promise((resolve,reject)=>{deadline=setTimeout(()=>reject(new Error(message)),milliseconds);})]);}
 finally{clearTimeout(deadline);}
}
let pendingFavorite=null,favoritesStatus='signed-out',favoritesLoad=Promise.resolve(),accountRevision=0;
const favoriteWrites=new Set();
const modelOptions=id=>[['Teléfonos',false],['Tabletas',true]].map(([label,tablet])=>`<optgroup label="${label}">${MODELS.filter(m=>Boolean(m.tablet)===tablet).map(m=>`<option value="${m.id}" ${m.id===id?'selected':''}>${m.name}</option>`).join('')}</optgroup>`).join('');
const productUrl=(f,m)=>`#/producto/${f.id}/${m.id}`;
const swatchStyle=f=>`--c:${f.color};--d:${f.second||f.color}`;
function photo(m,f,thumb=false){return `<img src="${asset(m,f,thumb?'thumb':'large')}" ${thumb?`srcset="${asset(m,f,'thumb')} 600w, ${asset(m,f)} 1400w" sizes="(max-width:600px) 45vw, (max-width:1000px) 30vw, 320px" loading="lazy"`:''} alt="Power Case ${f.name} para ${m.name}${m.views===2?', vista trasera y en ángulo':''}" ${m.tablet?'':`width="${m.views===2?1448:868}" height="${m.views===2?1086:1812}"`}>`;}
const casePrice=m=>m.tablet?'Precio por confirmar':'$499.00 MXN';
const modelFinishes=m=>m.tablet?FINISHES.filter(f=>f.group!=='atelier'):FINISHES;
const modelGroups=m=>Object.entries(GROUPS).filter(([id])=>!m.tablet||id!=='atelier');
function readFavorites(rows){
 const result=new Map();
 for(const item of rows||[]){
  const model=MODELS.find(model=>model.id===item?.model_id);
  if(model&&modelFinishes(model).some(finish=>finish.id===item.finish_id))result.set(`${model.id}/${item.finish_id}`,{model:model.id,finish:item.finish_id});
 }
 return result;
}
let favorites=new Map();
const favoriteKey=(f,m)=>`${m.id}/${f.id}`;
const favoriteHeart=()=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
function favoriteButton(f,m,detail=false){
 const saved=favorites.has(favoriteKey(f,m));
 const label=`${saved?'Quitar de':'Añadir a'} favoritos ${f.name} para ${m.name}`;
 return `<button type="button" class="favorite-toggle ${detail?'favorite-detail':'favorite-card'}" data-favorite-finish="${f.id}" data-favorite-model="${m.id}" aria-pressed="${saved}" aria-label="${safe(label)}" title="${saved?'Quitar de favoritos':'Añadir a favoritos'}">${favoriteHeart()}${detail?`<span>${saved?'Guardado en favoritos':'Guardar en favoritos'}</span>`:''}</button>`;
}
function favoritesContent(){
 if(!session)return `<div class="favorites-empty">${favoriteHeart()}<h2>Guarda tus favoritos en tu cuenta.</h2><p>Inicia sesión para guardar y recuperar tus fundas favoritas.</p><button type="button" class="button dark" data-favorites-login>Iniciar sesión</button></div>`;
 if(favoritesStatus==='loading')return '<p class="empty" role="status">Cargando tus favoritos…</p>';
 if(favoritesStatus==='error')return '<div class="favorites-empty"><p role="status">No pudimos cargar tus favoritos. Inténtalo de nuevo.</p><button type="button" class="button dark" data-favorites-retry>Reintentar</button></div>';
 if(!favorites.size)return `<div class="favorites-empty">${favoriteHeart()}<h2>Aún no tienes favoritos.</h2><p>Toca el corazón de una funda para guardarla aquí.</p><a class="button dark" href="#/coleccion">Explorar fundas</a></div>`;
 return `<div class="catalog-summary"><p>${favorites.size===1?'1 funda guardada':`${favorites.size} fundas guardadas`}</p><a class="text-link" href="#/coleccion">Seguir explorando</a></div><div class="product-grid">${[...favorites.values()].reverse().map(item=>card(getFinish(item.finish),getModel(item.model))).join('')}</div>`;
}
function favoritesPage(){
 return `<section class="page-heading"><h1>Mis favoritos.</h1><p>Tu selección, vinculada a tu cuenta Power Case.</p></section><section class="catalog favorites-catalog" id="favorites-content">${favoritesContent()}</section>`;
}
function syncFavorites(){
 const link=$('#favorites-link');
 link.innerHTML=`${favoriteHeart()}<span id="favorites-count" ${favorites.size?'':'hidden'}>${favorites.size}</span>`;
 link.setAttribute('aria-label',`Ver favoritos${favorites.size?`, ${favorites.size} ${favorites.size===1?'funda guardada':'fundas guardadas'}`:''}`);
 if(parseRoute()[0]==='favoritos')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
 document.querySelectorAll('[data-favorite-finish]').forEach(button=>{
  const f=getFinish(button.dataset.favoriteFinish),m=getModel(button.dataset.favoriteModel);
  const saved=favorites.has(favoriteKey(f,m));
  button.setAttribute('aria-pressed',saved);
  button.disabled=Boolean(session&&(favoritesStatus==='loading'||favoriteWrites.has(favoriteKey(f,m))));
  button.setAttribute('aria-label',`${saved?'Quitar de':'Añadir a'} favoritos ${f.name} para ${m.name}`);
  button.title=saved?'Quitar de favoritos':'Añadir a favoritos';
  const text=button.querySelector('span');
  if(text)text.textContent=saved?'Guardado en favoritos':'Guardar en favoritos';
 });
}
function refreshFavorites(){
 const content=$('#favorites-content');
 if(content)content.innerHTML=favoritesContent();
 syncFavorites();
}
async function loadAccountFavorites(){
 if(!session)return;
 const userId=session.id,revision=accountRevision;
 favoritesStatus='loading';refreshFavorites();
 try{
  const rows=await within(accounts.favorites(userId),'Favorites load timed out');
  if(session?.id!==userId||revision!==accountRevision)return;
  favorites=readFavorites(rows);favoritesStatus='ready';
 }catch{
  if(session?.id!==userId||revision!==accountRevision)return;
  favoritesStatus='error';
 }
 refreshFavorites();
}
function activateAccount(user){
 if(user&&session?.id===user.id)return favoritesLoad;
 const workspaceLoad=workspace?.open(user?.id||null).catch(()=>workspaceNotice('offline'));
 accountRevision++;
 session=user?{id:user.id,email:user.email,name:user.user_metadata?.full_name||'de nuevo'}:null;
 favorites=new Map();favoriteWrites.clear();
 favoritesStatus=session?'loading':'signed-out';
 if(!session){
  bag=[];selectedStickers.clear();$('#count').textContent='0';
  if($('#profile').open)$('#profile').close();
 }
 refreshFavorites();
 favoritesLoad=Promise.all([session?loadAccountFavorites():Promise.resolve(),workspaceLoad]);
 return favoritesLoad;
}
async function writeFavorite(f,m,save){
 if(!session)return;
 const userId=session.id,revision=accountRevision,key=favoriteKey(f,m);
 if(favoriteWrites.has(key))return;
 favoriteWrites.add(key);syncFavorites();
 const oldButtons=[...document.querySelectorAll('#favorites-content [data-favorite-finish]')];
 const index=oldButtons.findIndex(button=>button.dataset.favoriteFinish===f.id&&button.dataset.favoriteModel===m.id);
 try{
  if(save)await accounts.saveFavorite(userId,m.id,f.id);else await accounts.removeFavorite(userId,m.id,f.id);
  if(session?.id!==userId||revision!==accountRevision)return;
  if(save)favorites.set(key,{model:m.id,finish:f.id});else favorites.delete(key);
  refreshFavorites();
  if(index>=0){
   const next=document.querySelectorAll('#favorites-content [data-favorite-finish]');
   (next[Math.min(index,next.length-1)]||$('#favorites-content a'))?.focus({preventScroll:true});
  }
  toast(save?'Funda guardada en tu cuenta.':'Funda eliminada de favoritos.');
 }catch{
  if(session?.id===userId&&revision===accountRevision)toast('No se pudo guardar el cambio. Inténtalo de nuevo.');
 }finally{
  if(revision===accountRevision){favoriteWrites.delete(key);syncFavorites();}
 }
}
document.addEventListener('click',async event=>{
 if(event.target.closest('[data-favorites-login]')){account();return;}
 if(event.target.closest('[data-favorites-retry]')){favoritesLoad=loadAccountFavorites();return;}
 const button=event.target.closest('[data-favorite-finish]');
 if(!button)return;
 const f=getFinish(button.dataset.favoriteFinish),m=getModel(button.dataset.favoriteModel);
 if(!session&&accountInitializing)await accountInitialization;
 if(!session){pendingFavorite={finish:f.id,model:m.id};account();return;}
 if(favoritesStatus==='error')await loadAccountFavorites();
 if(favoritesStatus==='ready')writeFavorite(f,m,!favorites.has(favoriteKey(f,m)));
 else if(favoritesStatus==='error')toast('No pudimos conectar con tus favoritos. Comprueba tu conexión y vuelve a intentarlo.');
});
const CASE_VIEWS = [['01-trasera','Trasera'],['02-agarre-separado','Agarre separado'],['03-interior','Interior'],['04-perfil','Perfil']];
const STUDIO_FINISHES = {
 iphone16promax: ['ondas','nacar','bosque','mosaico'],
 iphone17promax: ['nacar','laguna'],
};
function productGallery(f,m){
 if(m.tablet)return `<div class="product-gallery tablet-gallery"><button type="button" class="zoom-image" data-gallery-zoom aria-label="Ampliar funda puesta en la tableta">${photo(m,f)}</button></div>`;
 const photographed=STUDIO_PHOTOS[m.id]?.includes(f.id);
 const studio=photographed||['grafito','alba','aura'].includes(f.id)||STUDIO_FINISHES[m.id]?.includes(f.id);
 const mounted={label:'Puesta en el teléfono',markup:photo(m,f)};
 if(!studio&&m.views===1){
  return `<div class="product-gallery single"><button type="button" class="zoom-image" data-gallery-zoom aria-label="Ampliar vista: ${mounted.label}">${mounted.markup}</button></div>`;
 }
 const views=studio?CASE_VIEWS:[CASE_VIEWS[0],['02-angulo','En ángulo']];
 const directory=photographed?'vistas-estudio':studio?'vistas':'vistas-originales';
 const images=views.map(([file,label],index)=>({label,markup:`<img src="assets/${directory}/${m.id}/${f.id}/${file}.webp" alt="${f.name} para ${m.name}: ${label}" width="600" height="600" ${studio||index>0?'loading="lazy"':''}>`}));
 if(studio)images.unshift(mounted);
 const slides=images.map(({label,markup})=>`<button type="button" class="zoom-image" data-gallery-zoom data-view-label="${label}" aria-label="Ampliar vista: ${label}">${markup}</button>`).join('');
 return `<div class="product-gallery case-gallery" aria-label="Vistas de ${f.name}"><div class="case-gallery-track" tabindex="0" aria-label="Galería de producto">${slides}</div><div class="case-gallery-controls"><button type="button" data-gallery-prev aria-label="Vista anterior" title="Vista anterior">${icon('ChevronLeft')}</button><p aria-live="polite"><span data-gallery-label>${images[0].label}</span> <span data-gallery-count>1 / ${images.length}</span></p><button type="button" data-gallery-next aria-label="Vista siguiente" title="Vista siguiente">${icon('ChevronLeft')}</button></div></div>`;
}
function setupProductGallery(){
 const gallery=$('.case-gallery');if(!gallery)return;
 const track=gallery.querySelector('.case-gallery-track'),prev=gallery.querySelector('[data-gallery-prev]'),next=gallery.querySelector('[data-gallery-next]');
 let index=0;
 const views=Array.from(track.querySelectorAll('[data-view-label]'),slide=>slide.dataset.viewLabel);
 const sync=()=>{index=Math.min(views.length-1,Math.max(0,Math.round(track.scrollLeft/track.clientWidth)));gallery.querySelector('[data-gallery-label]').textContent=views[index];gallery.querySelector('[data-gallery-count]').textContent=`${index+1} / ${views.length}`;prev.disabled=index===0;next.disabled=index===views.length-1;};
 const move=delta=>track.scrollTo({left:(index+delta)*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 prev.onclick=()=>move(-1);next.onclick=()=>move(1);
 track.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();move(event.key==='ArrowLeft'?-1:1);});
 track.addEventListener('scroll',sync,{passive:true});sync();
}
function card(f,m){return `<article class="product-card"><a class="product-card-link" href="${productUrl(f,m)}"><div class="card-media ${m.views===1?'single':''}">${photo(m,f,true)}</div><div class="card-copy"><small>${GROUPS[f.group]}</small><h3>${f.name}</h3><p>${m.name}</p><p class="case-price">${casePrice(m)}</p><span class="card-link">Descubrir</span></div></a>${favoriteButton(f,m)}</article>`;}
function home(){const m=MODELS[0];return `<section class="hero cinematic-hero"><div class="hero-copy"><span class="eyebrow">POWER CASE</span><h1>POWER CASE</h1><p class="hero-tagline">Tu energía tiene otra luz.</p><p class="hero-description">Protección, energía y diseño. En una sola funda.</p><a class="button hero-button" href="#/coleccion">Encuentra la tuya</a></div><div class="hero-scene"><picture><source media="(max-width:650px)" srcset="assets/powercase-empty-dark-mobile.webp"><img class="hero-image" src="assets/powercase-empty-dark-hero.webp" alt="Fundas Power Case vacías en varios acabados, con agarres a juego y botones iluminados sobre fondo negro" fetchpriority="high" width="1672" height="941"></picture></div></section><section class="signature-strip"><p>Una pieza. <strong>Personalidad propia.</strong></p><div><a href="#/coleccion/iphone17/lisos">Essential</a><a href="#/coleccion/iphone17/reflejos">Reflejos / Aura</a><a href="#/coleccion/iphone17/atelier">Atelier</a></div></section><section class="collection-section"><div class="section-heading"><span class="eyebrow">TRES COLECCIONES. UNA IDENTIDAD.</span><h2>Elige lo que va contigo.</h2></div>${[['reflejos','Luz en cada movimiento.','Acabados luminosos que encuentran un nuevo matiz contigo.','aura'],['lisos','La fuerza de lo simple.','Color sólido. Presencia propia. Nada de más.','azul-tinta'],['atelier','Diseño con carácter.','Ondas, geometría y ritmo. Detalles que hacen la diferencia.','ondas']].map(([g,title,copy,id])=>`<article class="collection-feature ${g}"><div class="feature-copy"><span class="eyebrow">${GROUPS[g]}</span><h3>${title}</h3><p>${copy}</p><a class="text-link" href="#/coleccion/${m.id}/${g}">Explorar colección</a></div><a class="feature-image" href="${productUrl(getFinish(id),m)}" aria-label="Ver ${getFinish(id).name}">${photo(m,getFinish(id))}</a></article>`).join('')}</section><section class="details-band"><span class="eyebrow">CADA PIEZA TIENE SU FUNCIÓN.</span><h2>Diseñada para acompañarte.</h2><div class="detail-columns"><article>${icon('BatteryCharging')}<h3>Energía integrada.</h3><p>La batería forma parte del cuerpo de la funda. Su botón de encendido es independiente.</p></article><article>${icon('ShieldCheck')}<h3>Una forma cuidada.</h3><p>Una silueta continua con recortes adaptados a cada diseño de teléfono.</p></article><article>${icon('CircleHelp')}<h3>Un agarre a tu estilo.</h3><p>El accesorio circular facilita la sujeción y lleva el acabado de tu funda. No es la batería.</p></article></div></section>`;}
function collection(){const m=getModel(modelId);const list=modelFinishes(m).filter(f=>(group==='todo'||f.group===group)&&f.name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')));return `<section class="page-heading"><span class="eyebrow">LA COLECCIÓN POWER CASE</span><h1>Encuentra tu combinación.</h1><p>Tu dispositivo. Tu estilo. Tu combinación.</p></section><section class="catalog"><div class="catalog-controls"><div class="model-field"><label for="catalog-model">Tu dispositivo</label><select id="catalog-model">${modelOptions(modelId)}</select></div><label class="search-field">${icon('Search')}<input id="catalog-search" type="search" placeholder="Buscar un acabado" aria-label="Buscar un acabado" value="${safe(query)}"></label></div><div class="catalog-tabs" role="group" aria-label="Colección">${[['todo','Todas'],...modelGroups(m)].map(([id,name])=>`<button data-group="${id}" aria-pressed="${group===id}">${name}</button>`).join('')}</div><div class="catalog-summary"><p>${m.name}</p><span id="result-count">Acabados disponibles</span></div><div class="product-grid" id="product-grid">${list.map(f=>card(f,m)).join('')||'<p class="empty">No encontramos ese acabado.</p>'}</div><p class="catalog-note">Explora los acabados y elige la combinación que va contigo.</p></section>`;}
function product(f,m){return `<div class="product-subnav"><a href="#/coleccion/${m.id}">${icon('ChevronLeft')} Colección</a><span>${GROUPS[f.group]}</span></div><section class="product-detail">${productGallery(f,m)}<div class="product-config"><span class="eyebrow">${GROUPS[f.group]}</span><h1>${f.name}</h1><p class="case-price">${casePrice(m)}</p><p class="product-intro">${f.copy||(f.group==='lisos'?'Un acabado sobrio, una presencia inconfundible. Tu color, sin distracciones.':f.group==='atelier'?'Una composición con ritmo propio. El diseño continúa en el agarre para completar la pieza.':'Color, brillo y matices que se transforman con la luz. Una expresión diferente en cada detalle.')}</p><div class="config-field"><label for="product-model">Modelo de dispositivo</label><select id="product-model">${modelOptions(m.id)}</select></div><fieldset><legend>Acabado <strong>${f.name}</strong></legend><div class="finish-groups">${modelGroups(m).map(([id,label])=>`<div><span>${label}</span><div class="swatches">${modelFinishes(m).filter(x=>x.group===id).map(x=>`<a class="swatch ${x.id===f.id?'selected':''} ${x.group==='atelier'?'pattern':''}" href="${productUrl(x,m)}" style="${swatchStyle(x)}" title="${x.name}" aria-label="${x.name}" ${x.id===f.id?'aria-current="true"':''}></a>`).join('')}</div></div>`).join('')}</div></fieldset><div class="availability"><span class="status-dot"></span> Próximamente</div>${favoriteButton(f,m,true)}<button class="button dark full" id="purchase" data-finish="${f.id}" data-model="${m.id}">Añadir a mi selección</button><p class="note">Explora sin cuenta. Inicia sesión para guardar tu selección.</p><details><summary>Diseño y energía</summary><p>La batería va integrada en la funda y se activa mediante el botón inferior.${m.tablet?'':' El agarre circular es un accesorio de sujeción, no una batería.'} Capacidades y especificaciones técnicas por confirmar.</p></details>${m.tablet?'':'<details><summary>Agarre incluido</summary><p>Cada diseño incluye un agarre circular con acabado a juego. Su presentación puede variar entre diseños.</p></details>'}<details><summary>Disponibilidad y Power Care</summary><p>Los envíos y las condiciones de garantía se confirmarán antes de habilitar ventas. No se procesan pedidos ni cobros.</p></details></div></section><section class="related"><div class="section-heading"><h2>Otro acabado. La misma esencia.</h2><a class="text-link" href="#/coleccion/${m.id}">Explorar más acabados</a></div><div class="related-grid">${modelFinishes(m).filter(x=>x.id!==f.id&&x.group===f.group).slice(0,3).map(x=>card(x,m)).join('')}</div></section>`;}
function care(){return `<section class="page-heading care-heading"><span class="eyebrow">POWER CARE</span><h1>Los detalles, claros.</h1><p>Cuidar tu experiencia también es parte del diseño.</p></section><section class="care-layout"><div class="care-photo">${photo(MODELS[0],FINISHES[0])}</div><div class="faq">${[
['¿Cómo encuentro mi modelo?','En Colección puedes seleccionar tu teléfono y descubrir los acabados disponibles para ese modelo. Elige tu combinación y conoce todos sus detalles.'],
['¿El círculo es la batería?','No. Es un agarre desplegable incluido, con acabado a juego. La batería va dentro del cuerpo de la funda y tiene un botón de activación independiente.'],
['¿Necesito una cuenta?','Puedes explorar todas las colecciones sin cuenta. El acceso se solicita cuando quieres guardar una funda en tu selección.'],
['¿Qué garantía tendrá?','Las condiciones de garantía, devoluciones y envío se publicarán antes del inicio de ventas.']].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>`;}
function parseRoute(){const parts=location.hash.replace(/^#\/?/,'').split('/');return parts;}
let sceneObserver=null,sceneFrame=0;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function setupExperience(home){
 document.body.classList.toggle('home-view',home);
 document.querySelector('meta[name="theme-color"]').content=home?'#050505':'#ffffff';
 if(sceneObserver)sceneObserver.disconnect();
 if(reducedMotion.matches)return;
 sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const el=entry.target;
  el.animate([{opacity:.3,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,easing:'cubic-bezier(.16,1,.3,1)'});
  sceneObserver.unobserve(el);
 }),{threshold:.12});
 document.querySelectorAll('.feature-copy,.feature-image,.detail-columns article,.section-heading').forEach(el=>sceneObserver.observe(el));
}
window.addEventListener('scroll',()=>{
 if(sceneFrame||reducedMotion.matches)return;
 const scene=$('.hero-scene');if(!scene)return;
 sceneFrame=requestAnimationFrame(()=>{scene.style.setProperty('--scene-shift',`${-Math.min(scrollY*.055,30)}px`);sceneFrame=0;});
},{passive:true});
reducedMotion.addEventListener('change',()=>{document.getAnimations().forEach(a=>a.cancel());if(sceneObserver)sceneObserver.disconnect();});
function render(scroll=true){const route=parseRoute();let page='inicio',content;const oldY=scrollY;if(route[0]==='coleccion'){page='coleccion';modelId=getModel(route[1]||modelId).id;group=modelGroups(getModel(modelId)).some(([id])=>id===route[2])?route[2]:'todo';content=collection();}else if(route[0]==='producto'){page='coleccion';const alias={atelier:'ondas',reflejos:'aura'};const m=getModel(route[2]||modelId);const f=modelFinishes(m).find(finish=>finish.id===(alias[route[1]]||route[1]))||FINISHES[0];modelId=m.id;content=product(f,m);document.title=`${f.name} | POWER CASE`;}else if(route[0]==='accesorios'){page='accesorios';content=accessoriesPage(route[1]);}else if(route[0]==='personalizacion'){page='personalizacion';content=personalization();}else if(route[0]==='favoritos'){page='favoritos';content=favoritesPage();}else if(route[0]==='care'){page='care';content=care();}else content=home();$('#app').innerHTML=`<div class="view">${content}</div>`;document.querySelectorAll('[data-page]').forEach(a=>{a.classList.toggle('active',a.dataset.page===page);if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});closeMenu();if(route[0]!=='producto')document.title=`${page==='coleccion'?'Colección':page==='accesorios'?'Accesorios':page==='personalizacion'?'Personalización':page==='favoritos'?'Favoritos':page==='care'?'Power Care':'Energía con personalidad'} | POWER CASE`;window.scrollTo(0,scroll?0:oldY);setupExperience(page==='inicio');setupProductGallery();syncFavorites();if(page==='personalizacion')setupStickerEditor();if(workspace)workspaceNotice($('#workspace-status').dataset.state||'guest');}
function closeMenu(){$('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
function authMode(m){
 mode=m;const signup=m==='signup';
 $('#name-field').hidden=!signup;$('#name').required=signup;
 $('#auth-title').textContent=signup?'Tu estilo empieza aquí.':'Qué bueno verte.';
 $('#submit').textContent=signup?'Crear cuenta':'Entrar';
 $('#submit').disabled=!accounts.configured;
 $('#password').autocomplete=signup?'new-password':'current-password';
 $('#signin').setAttribute('aria-pressed',!signup);$('#signup').setAttribute('aria-pressed',signup);
 $('#auth-status').textContent=accounts.configured?'':'Las cuentas están pendientes de activación. Pronto podrás guardar tus favoritos en tu cuenta.';
}
async function account(){if(!session&&accountInitializing)await accountInitialization;if(session){$('#profile-title').textContent=`Hola, ${session.name}.`;$('#profile-email').textContent=session.email;$('#profile').showModal();}else{authMode('signin');$('#auth').showModal();}}
function add(item){if(item.accessory&&!getAccessory(item.accessory))return;bag.push(item);$('#count').textContent=bag.length;workspace?.changed();toast(item.accessory?'Accesorio añadido a la bolsa.':'Tu Power Case se añadió a la selección.');}
const STICKER_SHEETS = [
 ['kit-de-personalizacion','Kit de Personalización'],
 ['arcade-mode','Arcade Mode'],
 ['energy-kit','Energy Kit'],
 ['night-shift','Night Shift'],
 ['atelier','Atelier'],
 ['reflejos','Reflejos'],
 ['circuito-impulso-luces','Circuito, Impulso y Luces','circuito-impulso-luces.png'],
 ['mundos-power-case','Mundos Power Case','mundos-power-case.png'],
 ['retro-power-case','Retro Power Case','retro-power-case.png'],
];
const selectedStickers=new Set();
const customStickers=[];
let nextStickerId=1;
const stickerContours={
 chevron:['Doble bisel','5% 0,70% 0,100% 50%,70% 100%,5% 100%,27% 50%',61,88,0],
 starburst:['Estrella dentada','50% 0%,57% 12%,75% 7%,76% 22%,93% 25%,88% 40%,100% 50%,88% 58%,93% 75%,76% 77%,75% 93%,58% 88%,50% 100%,42% 88%,25% 93%,24% 77%,7% 75%,12% 58%,0% 50%,12% 40%,7% 25%,24% 22%,25% 7%,42% 12%',68,74,0],
};
const stickerShapes={chevron:stickerContours.chevron[0],pill:"Cápsula retro",oval:"Óvalo clásico",heart:"Corazón",starburst:stickerContours.starburst[0],photo:'Foto completa'};
const classicStickerEdges={pill:[69,81,0],oval:[61,83,-15],heart:[64,68,-37],photo:[62,91,0]};
const stickerHeartPath='M50 92C35 79 5 58 5 39C5 12 33 5 50 21C67 5 95 12 95 39C95 58 65 79 50 92Z';
const stickerPatterns={plain:'Liso',stripes:'Franjas',dots:'Lunares',checker:'Ajedrez',grid:'Cuadrícula',waves:'Ondas',aurora:'Degradado Aurora',rays:'Rayos radiales',confetti:'Confeti',rings:'Anillos',plaid:'Cuadros cruzados'};
const stickerSymbols={
 none:['Sin símbolo',''],bolt:['Rayo','ϟ'],star:['Estrella','★'],heart:['Corazón','♥︎'],spark:['Destello','✦'],moon:['Luna','☾'],
 diamond:['Rombo','◆'],ring:['Anillo','◉'],grid:['Cuadrícula','▦'],stripes:['Franjas','▨'],chevrons:['Doble flecha','»'],triangle:['Triángulo','▲'],
 target:['Diana','◎'],wave:['Onda','∿'],infinity:['Infinito','∞'],cross:['Cruz geométrica','✚'],music:['Nota musical','♫'],asterisk:['Asterisco','✳︎'],
};
const stickerLetters={bold:'Gruesa',mono:'Monoespaciada',serif:'Serif',italic:'Inclinada'};
const stickerRanges={
 size:['Tamaño del sticker',25,100,65],proportion:['Proporción de la forma',65,170,100],
 caseAngle:['Giro sobre la funda',-180,180,0,'°'],
 symbolSize:['Tamaño del símbolo',8,45,19],symbolWidth:['Proporción del símbolo',65,150,100],symbolAngle:['Giro del símbolo',-180,180,0,'°'],
 photoSize:['Zoom de la foto',30,220,110],photoAngle:['Giro de la foto',-180,180,0,'°'],
 borderWidth:['Grosor del borde',1,12,3],
 textSize:['Tamaño del texto',5,18,10],brandSize:['Tamaño de la firma',3,8,5],brandAngle:['Giro de la firma',-180,180,0,'°'],
};
const stickerDefault={text:'',shape:'chevron',pattern:'plain',symbol:'none',symbols:[],activeSymbol:null,symbolColor:'#ffffff',letters:'bold',background:'#345042',accent:'#658872',ink:'#ffffff',photo:'',photoOriginal:'',photoAspect:1,photoCutout:false,borderEnabled:false,borderColor:'#ffffff',...Object.fromEntries(Object.entries(stickerRanges).map(([key,[,,,value]])=>[key,value])),positions:{},casePosition:[50,60]};
let stickerWorking={...stickerDefault,sceneId:'scene-1'};
let sceneStickers=[stickerWorking];
let nextSceneId=2,nextSymbolId=1;
const stickerUndo=[],stickerRedo=[];
let lastStickerEdit={key:'',time:0};
let stickerPhotoBusy=false;
let stickerPhotoRequest=0;
function stickerSnapshot(){
 return structuredClone({working:stickerWorking,scene:sceneStickers,saved:customStickers,selected:[...selectedStickers]});
}
function rememberSticker(before,key=''){
 if(JSON.stringify(before)===JSON.stringify(stickerSnapshot()))return;
 const now=Date.now();
 if(!key||key!==lastStickerEdit.key||now-lastStickerEdit.time>700){
  stickerUndo.push(before);
  if(stickerUndo.length>40)stickerUndo.shift();
 }
 stickerRedo.length=0;
 lastStickerEdit={key,time:now};
 updateStickerHistory();
 workspace?.changed();
}
function updateStickerHistory(){
 const undo=$('[data-sticker-undo]'),redo=$('[data-sticker-redo]');
 if(undo)undo.disabled=!stickerUndo.length;
 if(redo)redo.disabled=!stickerRedo.length;
}
function restoreStickerHistory(redo=false){
 const from=redo?stickerRedo:stickerUndo,to=redo?stickerUndo:stickerRedo;
 if(!from.length)return;
 to.push(stickerSnapshot());
 const state=from.pop();
 stickerPhotoRequest++;
 stickerPhotoBusy=false;
 stickerWorking=state.working;
 sceneStickers=state.scene;
 customStickers.splice(0,customStickers.length,...state.saved);
 selectedStickers.clear();
 state.selected.forEach(id=>selectedStickers.add(id));
 lastStickerEdit={key:'',time:0};
 setupStickerEditor();
 $('#saved-sticker-list').innerHTML=customStickerList();
 workspace?.changed();
}
function syncSceneSticker(){
 const index=sceneStickers.findIndex(item=>item.sceneId===stickerWorking.sceneId);
 if(index<0)sceneStickers.push(stickerWorking);
 else sceneStickers[index]=stickerWorking;
}
function normalizeStoredSticker(raw,index=0){
 raw=raw&&typeof raw==='object'?raw:{};
 const number=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
 const point=value=>Array.isArray(value)&&value.length===2?value.map(v=>Math.min(100,Math.max(0,number(v,50)))):[50,50];
 const color=(value,fallback)=>/^#[0-9a-f]{6}$/i.test(value)?value:fallback;
 const photo=value=>typeof value==='string'&&/^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value)?value:'';
 const identifier=(value,fallback)=>typeof value==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(value)?value:fallback;
 const result={...structuredClone(stickerDefault),sceneId:identifier(raw.sceneId,`scene-${index+1}`),text:String(raw.text||'').slice(0,32),photo:photo(raw.photo),photoOriginal:photo(raw.photoOriginal),photoAspect:Math.max(.001,number(raw.photoAspect,1)),photoCutout:raw.photoCutout===true,borderEnabled:raw.borderEnabled===true,casePosition:point(raw.casePosition),positions:{}};
 for(const [key,options] of Object.entries({shape:stickerShapes,pattern:stickerPatterns,symbol:stickerSymbols,letters:stickerLetters}))if(Object.hasOwn(options,raw[key]))result[key]=raw[key];
 for(const key of ['background','accent','ink','symbolColor','borderColor'])result[key]=color(raw[key],stickerDefault[key]);
 for(const [key,[,min,max,fallback]] of Object.entries(stickerRanges))result[key]=Math.max(min,Math.min(max,number(raw[key],fallback)));
 for(const key of ['brand','message','photo','symbol'])if(raw.positions?.[key])result.positions[key]=point(raw.positions[key]);
 result.brandFit=Math.max(.01,Math.min(1,number(raw.brandFit,1)));
 result.symbols=(Array.isArray(raw.symbols)?raw.symbols:[]).filter(item=>item&&Object.hasOwn(stickerSymbols,item.type)&&item.type!=='none').map((item,i)=>({id:identifier(item.id,`symbol-${i+1}`),type:item.type,point:point(item.point),size:Math.max(8,Math.min(45,number(item.size,19))),width:Math.max(65,Math.min(150,number(item.width,100))),angle:Math.max(-180,Math.min(180,number(item.angle,0))),color:color(item.color,result.ink)}));
 result.activeSymbol=result.symbols.some(item=>item.id===raw.activeSymbol)?raw.activeSymbol:null;
 if(!result.symbols.length&&result.symbol!=='none'){
  result.symbols=stickerSymbolItems(result);result.activeSymbol=result.symbols[0].id;
 }
 if(result.symbols.length&&!result.activeSymbol){
  const item=result.symbols[0];Object.assign(result,{activeSymbol:item.id,symbol:item.type,symbolSize:item.size,symbolWidth:item.width,symbolAngle:item.angle,symbolColor:item.color});
 }
 if(result.shape==='photo'&&!result.photo)result.shape='oval';
 if(Array.isArray(raw.photoMask)&&raw.photoMask.length===4096)result.photoMask=raw.photoMask.map(value=>Math.max(0,Math.min(255,number(value,0))));
 if(raw.id)result.id=identifier(raw.id,`custom-${index+1}`);
 return result;
}
function normalizedEditor(raw){
 const scene=(Array.isArray(raw?.scene)?raw.scene:[]).map(normalizeStoredSticker);
 const working=normalizeStoredSticker(raw?.working);
 if(!scene.some(item=>item.sceneId===working.sceneId))scene.push(working);
 const saved=(Array.isArray(raw?.saved)?raw.saved:[]).map((item,index)=>({...normalizeStoredSticker(item,index),id:/^custom-\d+$/.test(item?.id)?item.id:`custom-${index+1}`}));
 const allowed=new Set([...STICKER_SHEETS.map(([id])=>id),'repertorio-original',...saved.map(item=>item.id)]);
 return {working,scene,saved,selected:(Array.isArray(raw?.selected)?raw.selected:[]).filter(id=>allowed.has(id))};
}
function captureWorkspace(){
 syncSceneSticker();
 return {format:1,editor:stickerSnapshot(),undo:structuredClone(stickerUndo),redo:structuredClone(stickerRedo),bag:structuredClone(bag),counters:{nextStickerId,nextSceneId,nextSymbolId},modelId,group};
}
function restoreWorkspace(data){
 if(data&&data.format!==1)throw new Error('Unsupported workspace version');
 const editor=normalizedEditor(data?.editor);
 stickerPhotoRequest++;stickerPhotoBusy=false;stickerDrag=null;
 stickerWorking=editor.working;sceneStickers=editor.scene;
 customStickers.splice(0,customStickers.length,...editor.saved);
 selectedStickers.clear();editor.selected.forEach(id=>selectedStickers.add(id));
 stickerUndo.splice(0,stickerUndo.length,...(Array.isArray(data?.undo)?data.undo:[]).slice(-40).map(normalizedEditor));
 stickerRedo.splice(0,stickerRedo.length,...(Array.isArray(data?.redo)?data.redo:[]).slice(-40).map(normalizedEditor));
 bag=(Array.isArray(data?.bag)?data.bag:[]).filter(item=>{
  if(item?.accessory)return Boolean(getAccessory(item.accessory));
  const model=MODELS.find(model=>model.id===item?.model);
  return model&&modelFinishes(model).some(finish=>finish.id===item.finish);
 }).map(item=>item.accessory?{accessory:item.accessory}:{model:item.model,finish:item.finish});
 const all=[...sceneStickers,...customStickers,stickerWorking,...stickerUndo.flatMap(state=>[...state.scene,...state.saved,state.working]),...stickerRedo.flatMap(state=>[...state.scene,...state.saved,state.working])];
 const serial=(prefix,values,fallback)=>Math.max(Number.isSafeInteger(fallback)&&fallback>0?fallback:1,1,...values.map(value=>new RegExp(`^${prefix}-(\\d+)$`).exec(value)?.[1]).filter(Boolean).map(value=>Number(value)+1));
 nextSceneId=serial('scene',all.map(item=>item.sceneId),data?.counters?.nextSceneId);
 nextStickerId=serial('custom',all.map(item=>item.id),data?.counters?.nextStickerId);
 nextSymbolId=serial('symbol',all.flatMap(item=>item.symbols.map(symbol=>symbol.id)),data?.counters?.nextSymbolId);
 if(MODELS.some(model=>model.id===data?.modelId))modelId=data.modelId;
 if(data?.group==='todo'||Object.hasOwn(GROUPS,data?.group))group=data.group;
 $('#count').textContent=bag.length;
 if($('#sticker-form')){setupStickerEditor();$('#saved-sticker-list').innerHTML=customStickerList();}
 if($('#bag-dialog').open)$('#bag-content').innerHTML=bagContent();
 lastStickerEdit={key:'',time:0};
}
function workspaceNotice(status){
 const messages={loading:'Recuperando tus diseños…',syncing:'Sincronizando tus diseños…',pending:'Cambios pendientes de guardar…',saving:'Guardando en tu cuenta…',saved:'Todo guardado en tu cuenta.',guest:'',offline:'No se pudo sincronizar con tu cuenta. Puedes seguir editando; reintenta la sincronización para guardar en tu cuenta.',conflict:'Hay otra versión guardada en tu cuenta. Elige cuál conservar.', 'local-error':'No se pudo guardar la copia local. Mantén abierta la página hasta que termine el guardado en tu cuenta.'};
 const root=$('#workspace-status');
 root.hidden=status==='saved'||status==='guest';root.dataset.state=status;
 root.querySelector('[data-workspace-message]').textContent=messages[status];
 root.querySelector('[data-workspace-retry]').hidden=status!=='offline';
 for(const button of root.querySelectorAll('[data-workspace-resolve]'))button.hidden=status!=='conflict';
 for(const section of document.querySelectorAll('.sticker-editor,.saved-stickers'))section.inert=status==='loading';
 $('#bag').disabled=false;
 const purchase=$('#purchase');if(purchase)purchase.disabled=status==='loading';
 for(const button of document.querySelectorAll('[data-add-accessory]'))button.disabled=status==='loading';
}
function selectSceneSticker(id){
 syncSceneSticker();
 const item=sceneStickers.find(item=>item.sceneId===id);
 if(!item)return;
 stickerPhotoRequest++;
 stickerPhotoBusy=false;
 stickerWorking=structuredClone(item);
 lastStickerEdit={key:'',time:0};
 setupStickerEditor();
 workspace?.changed();
}
function stickerSymbolItems(sticker){
 if(sticker.symbols?.length)return sticker.symbols;
 if(sticker.symbol==='none'||!sticker.symbol)return [];
 return [{id:'legacy',type:sticker.symbol,point:sticker.positions.symbol||[50,45],size:sticker.symbolSize,width:sticker.symbolWidth,angle:sticker.symbolAngle,color:sticker.ink}];
}
const stickerOptions=choices=>Object.entries(choices).map(([id,label])=>`<option value="${id}">${Array.isArray(label)?label[0]:label}</option>`).join('');
const stickerTotal=()=>selectedStickers.size===1?'1 opción seleccionada':`${selectedStickers.size} opciones seleccionadas`;
function stickerBorder(shape,proportion,color,width){
 const contour=stickerContours[shape];
 let edge='<ellipse cx="50" cy="50" rx="50" ry="50"/>';
 if(contour)edge=`<polygon points="${contour[1].replaceAll('%','')}"/>`;
 if(shape==='heart')edge=`<path d="${stickerHeartPath}"/>`;
 if(shape==='pill')edge=`<rect width="100" height="100" rx="${2500/proportion}" ry="50"/>`;
 return `<svg class="sticker-border" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="${color}" style="--sticker-border-width:${width*2}cqw">${edge}</svg>`;
}
function stickerPreview({text,shape,pattern,symbol,symbols,letters,background,accent,ink,photo,photoAspect=1,photoSize,photoAngle,borderEnabled,borderColor,borderWidth,size,proportion,symbolSize,symbolWidth,symbolAngle,textSize,brandSize,brandAngle,brandFit=1,positions},interactive=false){
 const contour=stickerContours[shape];
 const [x,y,angle=0]=contour?contour.slice(2):classicStickerEdges[shape];
 const outline=contour?`;--sticker-outline:polygon(${contour[1]})`:'';
 const layerNames={brand:'firma Power Case',message:'texto personalizado',symbol:'símbolo',photo:'foto'};
 const layer=(key,markup,point,rotation,fontSize,style='')=>`<span class="sticker-layer sticker-${key.startsWith('symbol-')?'symbol':key}" style="--layer-x:${point[0]}%;--layer-y:${point[1]}%;--layer-angle:${rotation}deg;--layer-size:${fontSize}cqw;${style}" ${interactive?`data-sticker-layer="${key}" tabindex="0" role="group" aria-label="Mover ${key.startsWith('symbol-')?'símbolo':layerNames[key]}"`:''}>${markup}</span>`;
 const marks=stickerSymbolItems({symbol,symbols,positions,symbolSize,symbolWidth,symbolAngle,ink});
 const fullPhoto=shape==='photo';
 let photoMarkup=photo?`<img src="${safe(photo)}" alt="Foto del sticker" draggable="false">`:'';
 if(fullPhoto&&photo&&borderEnabled){
  const filterId=`photo-edge-${++stickerFilterId}`;
  photoMarkup=`<svg class="sticker-photo-cutout" viewBox="0 0 1000 ${1000/photoAspect}" overflow="visible" role="img" aria-label="Foto con borde"><defs><filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="${borderWidth*10}" result="edge"/><feFlood flood-color="${borderColor}"/><feComposite in2="edge" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><image href="${safe(photo)}" width="1000" height="${1000/photoAspect}" filter="url(#${filterId})"/></svg>`;
 }
 return `<div class="custom-sticker-stage"><div class="custom-sticker ${shape} ${borderEnabled?'has-sticker-border':''} pattern-${pattern} letters-${letters}" style="--sticker-bg:${background};--sticker-accent:${accent};--sticker-ink:${ink};--sticker-size:${size}%;--sticker-proportion:${fullPhoto?1:proportion/100};--base-aspect:${fullPhoto?photoAspect:shape==='pill'?2:shape==='oval'?1.4:1};--symbol-proportion:${symbolWidth/100};--photo-size:${fullPhoto?100:photoSize}%${outline}">
 ${photo?layer('photo',photoMarkup,fullPhoto?[50,50]:positions.photo||[50,50],fullPhoto?0:photoAngle,photoSize):''}
 ${borderEnabled&&!fullPhoto?stickerBorder(shape,proportion,borderColor,borderWidth):''}
 ${marks.map(mark=>layer(`symbol-${mark.id}`,stickerSymbols[mark.type][1],mark.point,mark.angle,mark.size,`--symbol-proportion:${mark.width/100};color:${mark.color||ink}`)).join('')}
 ${text?layer('message',safe(text),positions.message||[50,marks.length?55:43],0,textSize):''}${layer('brand','POWER CASE',positions.brand||[x,y],angle+brandAngle,brandSize*brandFit)}
 </div></div>`;
}
let stickerFilterId=0;
function caseStickerMarkup(sticker,index){
 const [x,y]=sticker.casePosition;
 return `<div class="sticker-case-overlay ${sticker.sceneId===stickerWorking.sceneId?'is-active':''}" data-case-sticker="${sticker.sceneId}" tabindex="0" role="group" aria-label="Seleccionar y mover sticker ${index+1} sobre la funda" style="--case-x:${x}%;--case-y:${y}%;--case-angle:${sticker.caseAngle||0}deg">${stickerPreview(sticker)}</div>`;
}
function stickerOnCase(){
 syncSceneSticker();
 return `<div class="sticker-case"><img src="assets/stickers/funda-grafito-sin-agarre.png" alt="Parte trasera de la funda Power Case Grafito sin agarre"><div class="sticker-case-area">${sceneStickers.map(caseStickerMarkup).join('')}</div></div>`;
}
const stickerName=sticker=>sticker.text||`POWER CASE · ${stickerShapes[sticker.shape]} · ${stickerPatterns[sticker.pattern]}`;
function customStickerList(){
 return customStickers.map(sticker=>`<article class="custom-sticker-card">${stickerPreview(sticker)}<button type="button" class="text-link" data-add-saved-case-sticker="${sticker.id}">Añadir a la funda</button><button type="button" class="text-link" data-delete-sticker="${sticker.id}" aria-label="Eliminar sticker ${safe(stickerName(sticker))}">Eliminar</button></article>`).join('');
}
function personalization(){
 return `<section class="page-heading"><h1>Personalización</h1></section>
 <section class="sticker-editor" id="editor-stickers">
 <form id="sticker-form">
  <div class="sticker-toolbar" role="group" aria-label="Historial del diseño"><button type="button" data-sticker-undo disabled>↶ Deshacer</button><button type="button" data-sticker-redo disabled>↷ Rehacer</button></div>
  <label class="sticker-photo-upload"><input type="file" id="sticker-photo" accept="image/jpeg,image/png,image/webp" aria-describedby="sticker-photo-status"><span class="sticker-photo-upload-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg></span><span><strong>Seleccionar foto</strong><span class="sticker-photo-upload-hint">Añade tu imagen al sticker</span></span><span class="sticker-photo-upload-plus" aria-hidden="true">+</span></label>
  <p class="note" id="sticker-photo-status" role="status">JPG, PNG o WebP, hasta 50 MB. La imagen se optimiza automáticamente.</p>
  <button type="button" class="text-link" data-remove-sticker-photo hidden>Quitar foto</button>
  <div class="sticker-toolbar" data-photo-tools hidden><button type="button" data-photo-original>Usar foto completa</button><button type="button" data-photo-background>Quitar fondo</button><button type="button" data-photo-restore hidden>Restaurar fondo</button></div>
  <p class="note" data-photo-background-note hidden>La primera vez se descarga la herramienta de recorte. La foto se procesa en tu dispositivo.</p>
  <label>Texto opcional <input name="text" type="text" maxlength="32" placeholder="Escribe tu frase"></label>
  <div class="sticker-selects">
   <label>Forma <select name="shape">${stickerOptions(stickerShapes)}</select></label>
   <label>Patrón <select name="pattern">${stickerOptions(stickerPatterns)}</select></label>
   <label>Símbolo <select name="symbol">${stickerOptions(stickerSymbols)}</select></label>
   <label>Letra <select name="letters">${stickerOptions(stickerLetters)}</select></label>
  </div>
  <div class="sticker-toolbar"><button type="button" data-add-sticker-symbol>Añadir otro símbolo</button><button type="button" data-remove-sticker-symbol disabled>Eliminar símbolo seleccionado</button></div>
  <div class="sticker-symbol-list" id="sticker-symbol-list" role="group" aria-label="Símbolos del sticker"></div>
  <label>Color del símbolo seleccionado <input name="symbolColor" type="color" value="#ffffff"></label>
  <div class="sticker-colors"><label>Fondo <input name="background" type="color" value="${stickerDefault.background}"></label><label>Patrón <input name="accent" type="color" value="${stickerDefault.accent}"></label><label>Texto <input name="ink" type="color" value="${stickerDefault.ink}"></label></div>
  <div class="sticker-border-controls"><label><input name="borderEnabled" type="checkbox"> Añadir borde</label><label>Color del borde <input name="borderColor" type="color" value="${stickerDefault.borderColor}"></label></div>
  <div class="sticker-ranges">
   ${Object.entries(stickerRanges).map(([key,[label,min,max,value]])=>`<label>${label} <output data-sticker-value="${key}"></output><input type="range" name="${key}" min="${min}" max="${max}" value="${value}"></label>`).join('')}
  </div>
  <button type="button" class="text-link" data-reset-sticker-position>Restablecer posiciones</button>
  <button type="submit" class="button dark full">Guardar sticker</button>
 </form>
 <div class="sticker-previews"><h2>Vista previa</h2><p>Selecciona un símbolo para editarlo. Arrastra los elementos o usa las flechas del teclado.</p><div id="sticker-preview">${stickerPreview(stickerWorking,true)}</div>
 <figure><div id="sticker-on-case">${stickerOnCase()}</div><figcaption>Selecciona un sticker y arrástralo sobre la funda. Escala aproximada.</figcaption></figure>
 <div class="sticker-toolbar"><button type="button" data-new-case-sticker>Nuevo sticker</button><button type="button" data-duplicate-case-sticker>Duplicar sticker</button><button type="button" data-remove-case-sticker>Eliminar de la funda</button></div>
 <div class="sticker-scene-list" id="sticker-scene-list" role="group" aria-label="Stickers sobre la funda"></div><p class="note" id="sticker-editor-status" role="status"></p></div>
 </section>
 <section class="saved-stickers"><h2>Mis diseños</h2><p>${session?'Los diseños se guardan automáticamente en tu cuenta. Puedes elegirlos en la bolsa.':'Tus diseños quedan en este navegador. Inicia sesión para guardarlos en tu cuenta.'}</p><div id="saved-sticker-list">${customStickerList()}</div><button type="button" class="text-link" id="open-custom-bag">Ver bolsa</button></section>`;
}
function stickerDraft(form){
 const fields=new FormData(form);
 const valueFor=name=>fields.get(name)??form.elements?.namedItem(name)?.value;
 const color=name=>/^#[0-9a-f]{6}$/i.test(valueFor(name))?valueFor(name):stickerDefault[name];
 const choice=(name,options)=>Object.hasOwn(options,valueFor(name))?valueFor(name):stickerDefault[name];
 const ranges=Object.fromEntries(Object.entries(stickerRanges).map(([key,[,min,max,fallback]])=>{
  const value=Number(valueFor(key)??fallback);
  return [key,Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback];
 }));
 const symbol=choice('symbol',stickerSymbols);
 let symbols=stickerSymbolItems(stickerWorking).map(item=>({...item}));
 let activeSymbol=stickerWorking.activeSymbol;
 if(symbol==='none'){
  symbols=symbols.filter(item=>item.id!==activeSymbol);
  activeSymbol=null;
 }else{
  if(!activeSymbol){activeSymbol=`symbol-${nextSymbolId++}`;symbols.push({id:activeSymbol,point:[50,45]});}
  symbols=symbols.map(item=>item.id===activeSymbol?{...item,type:symbol,size:ranges.symbolSize,width:ranges.symbolWidth,angle:ranges.symbolAngle,color:color('symbolColor')||stickerWorking.ink}:item);
 }
 return {...stickerWorking,text:String(fields.get('text')||'').trim().slice(0,32),shape:choice('shape',stickerShapes),pattern:choice('pattern',stickerPatterns),symbol,symbols,activeSymbol,symbolColor:color('symbolColor'),letters:choice('letters',stickerLetters),background:color('background'),accent:color('accent'),ink:color('ink'),borderEnabled:fields.has('borderEnabled'),borderColor:color('borderColor'),...ranges};
}
function updateStickerPreview(){
 const preview=$('#sticker-preview');
 preview.innerHTML=stickerPreview({...stickerWorking,brandFit:1},true);
 const brand=preview.querySelector('.sticker-brand');
 placeStickerBrand(brand,...stickerCoordinates(brand),true);
 updateCaseSticker();
 for(const [name,[,,,,unit='%']] of Object.entries(stickerRanges))$(`[data-sticker-value="${name}"]`).textContent=`${stickerWorking[name]}${unit}`;
 const form=$('#sticker-form');
 for(const name of ['symbolSize','symbolWidth','symbolAngle','symbolColor'])form.elements.namedItem(name).disabled=!stickerWorking.activeSymbol;
 for(const name of ['photoSize','photoAngle'])form.elements.namedItem(name).disabled=!stickerWorking.photo||stickerWorking.shape==='photo';
 form.elements.namedItem('proportion').disabled=stickerWorking.shape==='photo';
 form.elements.namedItem('pattern').disabled=stickerWorking.shape==='photo';
 form.querySelector('option[value="photo"]').disabled=!stickerWorking.photo;
 for(const name of ['borderColor','borderWidth'])form.elements.namedItem(name).disabled=!stickerWorking.borderEnabled;
 $('[data-remove-sticker-photo]').hidden=!stickerWorking.photo;
 $('[data-photo-tools]').hidden=!stickerWorking.photo;
 $('[data-photo-background-note]').hidden=!stickerWorking.photo;
 $('[data-photo-restore]').hidden=!stickerWorking.photoCutout;
 $('[data-photo-background]').disabled=stickerPhotoBusy||stickerWorking.photoCutout;
 form.querySelector('button[type="submit"]').disabled=stickerPhotoBusy;
 $('#sticker-symbol-list').innerHTML=stickerSymbolItems(stickerWorking).map((item,index)=>`<button type="button" data-select-sticker-symbol="${item.id}" aria-pressed="${item.id===stickerWorking.activeSymbol}">${stickerSymbols[item.type][0]} ${index+1}</button>`).join('');
 $('[data-remove-sticker-symbol]').disabled=!stickerWorking.activeSymbol;
 $('#sticker-scene-list').innerHTML=sceneStickers.map((item,index)=>`<button type="button" data-select-case-sticker="${item.sceneId}" aria-pressed="${item.sceneId===stickerWorking.sceneId}">Sticker ${index+1}</button>`).join('');
 $('[data-remove-case-sticker]').disabled=sceneStickers.length<=1;
 updateStickerHistory();
}
function placeStickerBrand(layer,x,y,resize=false){
 const sticker=layer.parentElement;
 const width=sticker.clientWidth,height=sticker.clientHeight;
 if(!width||!height)return;
 const clip=getComputedStyle(sticker).clipPath;
 const canvas=document.createElement('canvas').getContext('2d');
 const isHeart=sticker.classList.contains('heart');
 let path;
 if(clip.startsWith('polygon(')){
  const points=clip.slice(8,-1).split(',').map(pair=>pair.trim().split(/\s+/).map(parseFloat));
  path=new Path2D();
  points.forEach(([px,py],i)=>i?path.lineTo(px,py):path.moveTo(px,py));
  path.closePath();
 }else if(isHeart){
  path=new Path2D(stickerHeartPath);
 }
 const inside=(px,py)=>{
  if(sticker.classList.contains('photo')){
   if(px<1||px>99||py<1||py>99)return false;
   if(stickerWorking.photoCutout&&stickerWorking.photoMask){
    return stickerWorking.photoMask[Math.floor(py*.64)*64+Math.floor(px*.64)]>220;
   }
   return true;
  }
  if(path)return canvas.isPointInPath(path,px,py);
  const radius=sticker.classList.contains('pill')?Math.min(width,height)/2:0;
  if(radius){
   const local=px*width/100;
   return Math.hypot(local-Math.max(radius,Math.min(width-radius,local)),(py-50)*height/100)<=radius;
  }
  return ((px-50)/49)**2+((py-50)/49)**2<=1;
 };
 const radians=parseFloat(layer.style.getPropertyValue('--layer-angle'))*Math.PI/180;
 const cos=Math.cos(radians),sin=Math.sin(radians);
 const offsets=[-1,0,1].flatMap(dx=>[-1,0,1].map(dy=>{
  const px=dx*(layer.offsetWidth/2+2),py=dy*(layer.offsetHeight/2+2);
  return [100*(px*cos-py*sin)/width,100*(px*sin+py*cos)/height];
 }));
 let point=[x,y],factor=1;
 const fits=(px,py)=>offsets.every(([dx,dy])=>inside(px+factor*dx,py+factor*dy));
 while(!fits(...point)){
  let best=Infinity;
  for(let py=2;py<100;py+=2)for(let px=2;px<100;px+=2){
   const distance=(px-x)**2+(py-y)**2;
   if(distance<best&&fits(px,py)){point=[px,py];best=distance;}
  }
  if(best!==Infinity)break;
  if(!resize||factor<=.2){point=[50,50];break;}
  factor*=.8;
 }
 if(resize){
  stickerWorking={...stickerWorking,brandFit:factor};
  layer.style.setProperty('--layer-size',`${stickerWorking.brandSize*factor}cqw`);
 }
 stickerWorking={...stickerWorking,positions:{...stickerWorking.positions,brand:point}};
 layer.style.setProperty('--layer-x',`${point[0]}%`);
 layer.style.setProperty('--layer-y',`${point[1]}%`);
}
function updateCaseSticker(){
 syncSceneSticker();
 const area=$('#sticker-on-case .sticker-case-area');
 area.innerHTML=sceneStickers.map(caseStickerMarkup).join('');
 const overlay=area.querySelector(`[data-case-sticker="${stickerWorking.sceneId}"]`);
 moveStickerLayer(overlay,...stickerWorking.casePosition);
}
function selectStickerSymbol(id){
 const item=stickerSymbolItems(stickerWorking).find(item=>item.id===id);
 if(!item)return;
 stickerWorking={...stickerWorking,activeSymbol:id,symbol:item.type,symbolSize:item.size,symbolWidth:item.width,symbolAngle:item.angle,symbolColor:item.color||stickerWorking.ink};
 lastStickerEdit={key:'',time:0};
 setupStickerEditor();
}
function setupStickerEditor(){
 const form=$('#sticker-form');
 for(const [name,value] of Object.entries(stickerWorking)){
  const field=form.elements.namedItem(name);
  if(field?.type==='checkbox')field.checked=value;
  else if(field)field.value=value;
 }
 updateStickerPreview();
 $('#sticker-photo-status').textContent=stickerWorking.photo?'Foto cargada. Puedes usarla completa o quitarle el fondo.':'JPG, PNG o WebP, hasta 50 MB. La imagen se optimiza automáticamente.';
}
async function stickerPhotoData(source){
 const image=new Image();
 image.src=source;
 try{await image.decode();}catch{throw new Error('No se pudo abrir esa foto. Prueba con otro archivo.');}
 const canvas=document.createElement('canvas');
 const scale=Math.min(1,1000/Math.max(image.naturalWidth,image.naturalHeight));
 canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
 canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
 canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
 const mask=document.createElement('canvas');
 mask.width=mask.height=64;
 const context=mask.getContext('2d');
 context.drawImage(canvas,0,0,64,64);
 const pixels=context.getImageData(0,0,64,64).data;
 const photoMask=Array.from({length:64*64},(_,index)=>pixels[index*4+3]);
 return {photo:canvas.toDataURL('image/webp',.9),photoAspect:image.naturalWidth/image.naturalHeight,photoMask};
}
async function readStickerPhoto(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>50*1024*1024)throw new Error('Elige un JPG, PNG o WebP de hasta 50 MB.');
 const url=URL.createObjectURL(file);
 try{
  return await stickerPhotoData(url);
 }finally{URL.revokeObjectURL(url);}
}
$('#app').addEventListener('change',async event=>{
 const input=event.target;
 if(input.id!=='sticker-photo')return;
 const [file]=input.files;
 if(!file)return;
 const request=++stickerPhotoRequest;
 const status=$('#sticker-photo-status');
 input.value='';
 stickerPhotoBusy=true;
 input.form.querySelector('button[type="submit"]').disabled=true;
 status.textContent='Preparando foto…';
 try{
  const data=await readStickerPhoto(file);
  if(request!==stickerPhotoRequest||!input.isConnected)return;
  const before=stickerSnapshot();
  stickerWorking={...stickerWorking,...data,photoOriginal:data.photo,photoCutout:false,shape:'photo',proportion:100,photoSize:100,photoAngle:0,positions:{...stickerWorking.positions,photo:[50,50],brand:undefined}};
  setupStickerEditor();
  rememberSticker(before);
  status.textContent='Foto completa, con su proporción original. Puedes quitarle el fondo.';
 }catch(error){
  if(request===stickerPhotoRequest&&input.isConnected)status.textContent=error.message;
 }finally{
  if(request===stickerPhotoRequest){stickerPhotoBusy=false;if(input.isConnected)updateStickerPreview();}
 }
});
let stickerBackgroundModule;
async function removeStickerBackground(){
 if(!stickerWorking.photo||stickerPhotoBusy)return;
 const request=++stickerPhotoRequest;
 const sceneId=stickerWorking.sceneId,source=stickerWorking.photoOriginal||stickerWorking.photo;
 const status=$('#sticker-photo-status');
 stickerPhotoBusy=true;
 updateStickerPreview();
 status.textContent='Preparando recorte. La primera descarga puede tardar unos minutos…';
 try{
  stickerBackgroundModule??=import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm').catch(error=>{stickerBackgroundModule=null;throw error;});
  const {removeBackground}=await stickerBackgroundModule;
  if(request!==stickerPhotoRequest)return;
  const blob=await removeBackground(source,{model:'isnet_quint8',proxyToWorker:false,output:{format:'image/png'},progress:(key,current,total)=>{
   if(request===stickerPhotoRequest&&status.isConnected&&total>0)status.textContent=`Descargando herramienta de recorte… ${Math.round(current/total*100)}%`;
  }});
  const url=URL.createObjectURL(blob);
  let data;
  try{data=await stickerPhotoData(url);}finally{URL.revokeObjectURL(url);}
  if(request!==stickerPhotoRequest||stickerWorking.sceneId!==sceneId||!status.isConnected)return;
  const before=stickerSnapshot();
  stickerWorking={...stickerWorking,...data,photoCutout:true,shape:'photo',positions:{...stickerWorking.positions,brand:undefined}};
  setupStickerEditor();
  rememberSticker(before);
  status.textContent='Fondo eliminado. Puedes restaurarlo o deshacer el cambio.';
 }catch(error){
  if(request===stickerPhotoRequest&&status.isConnected)status.textContent='No se pudo quitar el fondo. Comprueba tu conexión y vuelve a intentarlo.';
 }finally{
  if(request===stickerPhotoRequest){stickerPhotoBusy=false;if(status.isConnected)updateStickerPreview();}
 }
}
async function restoreStickerPhoto(){
 if(!stickerWorking.photoOriginal)return;
 const request=++stickerPhotoRequest;
 stickerPhotoBusy=true;
 updateStickerPreview();
 try{
  const data=await stickerPhotoData(stickerWorking.photoOriginal);
  if(request!==stickerPhotoRequest||!$('#sticker-form'))return;
  const before=stickerSnapshot();
  stickerWorking={...stickerWorking,...data,photoCutout:false};
  updateStickerPreview();rememberSticker(before);
  $('#sticker-photo-status').textContent='Fondo original restaurado.';
 }catch(error){
  if(request===stickerPhotoRequest&&$('#sticker-photo-status'))$('#sticker-photo-status').textContent=error.message;
 }finally{
  if(request===stickerPhotoRequest){stickerPhotoBusy=false;if($('#sticker-form'))updateStickerPreview();}
 }
}
function moveStickerLayer(layer,x,y){
 if(layer.hasAttribute('data-case-sticker')){
  const area=layer.parentElement.getBoundingClientRect();
  const sticker=layer.querySelector('.custom-sticker').getBoundingClientRect();
  if(!area.width||!area.height)return;
  const padX=Math.min(50,50*sticker.width/area.width);
  const padY=Math.min(50,50*sticker.height/area.height);
  const point=[Math.max(padX,Math.min(100-padX,x)),Math.max(padY,Math.min(100-padY,y))];
  stickerWorking={...stickerWorking,casePosition:point};
  syncSceneSticker();
  layer.style.setProperty('--case-x',`${point[0]}%`);
  layer.style.setProperty('--case-y',`${point[1]}%`);
  return;
 }
 const key=layer.dataset.stickerLayer;
 if(key==='brand'){placeStickerBrand(layer,x,y);updateCaseSticker();return;}
 const clamp=value=>Math.min(97,Math.max(3,value));
 const point=[clamp(x),clamp(y)];
 if(key.startsWith('symbol-')){
  const id=key.slice(7);
  stickerWorking={...stickerWorking,symbols:stickerSymbolItems(stickerWorking).map(item=>item.id===id?{...item,point}:item)};
 }else stickerWorking={...stickerWorking,positions:{...stickerWorking.positions,[key]:point}};
 layer.style.setProperty('--layer-x',`${point[0]}%`);
 layer.style.setProperty('--layer-y',`${point[1]}%`);
 updateCaseSticker();
}
const stickerMoveTarget='[data-sticker-layer], [data-case-sticker]';
function stickerCoordinates(layer){
 const prefix=layer.hasAttribute('data-case-sticker')?'--case-':'--layer-';
 return ['x','y'].map(axis=>parseFloat(layer.style.getPropertyValue(prefix+axis)));
}
$('#app').addEventListener('input',event=>{
 const form=event.target.closest('#sticker-form');
 if(!form||event.target.id==='sticker-photo')return;
 const before=stickerSnapshot();
 stickerWorking=stickerDraft(form);
 updateStickerPreview();
 rememberSticker(before,`field-${event.target.name}`);
});
let stickerDrag;
$('#app').addEventListener('pointerdown',event=>{
 let layer=event.target.closest(stickerMoveTarget);
 if(!layer||event.button!==0)return;
 if(layer.hasAttribute('data-case-sticker')&&layer.dataset.caseSticker!==stickerWorking.sceneId){
  selectSceneSticker(layer.dataset.caseSticker);
  layer=$(`[data-case-sticker="${stickerWorking.sceneId}"]`);
 }
 const symbolKey=layer.dataset.stickerLayer;
 if(symbolKey?.startsWith('symbol-')&&symbolKey.slice(7)!==stickerWorking.activeSymbol){
  selectStickerSymbol(symbolKey.slice(7));
  layer=$(`[data-sticker-layer="${symbolKey}"]`);
 }
 const bounds=layer.parentElement.getBoundingClientRect();
 const [startX,startY]=stickerCoordinates(layer);
 stickerDrag={layer,id:event.pointerId,bounds,x:event.clientX,y:event.clientY,startX,startY,before:stickerSnapshot()};
 layer.setPointerCapture(event.pointerId);
 layer.focus({preventScroll:true});
});
$('#app').addEventListener('pointermove',event=>{
 if(stickerDrag?.id!==event.pointerId)return;
 const {layer,bounds,x,y,startX,startY}=stickerDrag;
 moveStickerLayer(layer,startX+100*(event.clientX-x)/bounds.width,startY+100*(event.clientY-y)/bounds.height);
});
for(const eventName of ['pointerup','pointercancel','lostpointercapture']){
 $('#app').addEventListener(eventName,event=>{
  if(stickerDrag?.id!==event.pointerId)return;
  const before=stickerDrag.before;
  stickerDrag=null;
  rememberSticker(before);
 });
}
$('#app').addEventListener('keydown',event=>{
 if((event.ctrlKey||event.metaKey)&&['z','y'].includes(event.key.toLowerCase())&&$('#sticker-form')){
  event.preventDefault();
  restoreStickerHistory(event.key.toLowerCase()==='y'||event.shiftKey);
  return;
 }
 const layer=event.target.closest(stickerMoveTarget);
 const offsets={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
 if(!layer||!Object.hasOwn(offsets,event.key))return;
 event.preventDefault();
 const [x,y]=offsets[event.key],step=event.shiftKey?5:1;
 const [startX,startY]=stickerCoordinates(layer);
 if(layer.hasAttribute('data-case-sticker')&&layer.dataset.caseSticker!==stickerWorking.sceneId){selectSceneSticker(layer.dataset.caseSticker);return;}
 const before=stickerSnapshot();
 moveStickerLayer(layer,startX+x*step,startY+y*step);
 rememberSticker(before,`move-${layer.dataset.stickerLayer||layer.dataset.caseSticker}`);
});
$('#app').addEventListener('submit',event=>{
 if(event.target.id!=='sticker-form')return;
 event.preventDefault();
 if(stickerPhotoBusy)return;
 const before=stickerSnapshot();
 const sticker=stickerDraft(event.target);
 customStickers.push({...sticker,brandFit:stickerWorking.brandFit,id:`custom-${nextStickerId++}`});
 $('#saved-sticker-list').innerHTML=customStickerList();
 rememberSticker(before);
 toast('Sticker guardado. Puedes elegirlo en la bolsa.');
 event.target.elements.text.select();
});
$('#app').addEventListener('click',event=>{
 if(event.target.closest('[data-sticker-undo]')){restoreStickerHistory();return;}
 if(event.target.closest('[data-sticker-redo]')){restoreStickerHistory(true);return;}
 const sceneButton=event.target.closest('[data-select-case-sticker]');
 if(sceneButton){selectSceneSticker(sceneButton.dataset.selectCaseSticker);return;}
 const symbolButton=event.target.closest('[data-select-sticker-symbol]');
 if(symbolButton){selectStickerSymbol(symbolButton.dataset.selectStickerSymbol);return;}
 const savedButton=event.target.closest('[data-add-saved-case-sticker]');
 if(savedButton){
  const item=customStickers.find(item=>item.id===savedButton.dataset.addSavedCaseSticker);
  if(!item)return;
  const before=stickerSnapshot();
  syncSceneSticker();
  stickerPhotoRequest++;stickerPhotoBusy=false;
  stickerWorking={...structuredClone(item),sceneId:`scene-${nextSceneId++}`,casePosition:[50,50]};
  sceneStickers.push(stickerWorking);
  setupStickerEditor();rememberSticker(before);return;
 }
 if(event.target.closest('[data-photo-background]')){removeStickerBackground();return;}
 if(event.target.closest('[data-photo-restore]')){restoreStickerPhoto();return;}
 if(event.target.closest('[data-photo-original]')){
  const before=stickerSnapshot();
  stickerWorking={...stickerWorking,shape:'photo',proportion:100,positions:{...stickerWorking.positions,brand:undefined}};
  setupStickerEditor();rememberSticker(before);return;
 }
 if(event.target.closest('[data-add-sticker-symbol]')){
  const before=stickerSnapshot();
  const id=`symbol-${nextSymbolId++}`,items=stickerSymbolItems(stickerWorking);
  const item={id,type:stickerWorking.symbol==='none'?'bolt':stickerWorking.symbol,point:[35+(items.length%3)*15,35+(Math.floor(items.length/3)%3)*15],size:stickerWorking.symbolSize,width:stickerWorking.symbolWidth,angle:0,color:stickerWorking.symbolColor};
  stickerWorking={...stickerWorking,symbols:[...items,item]};
  selectStickerSymbol(id);rememberSticker(before);return;
 }
 if(event.target.closest('[data-remove-sticker-symbol]')){
  const before=stickerSnapshot();
  const items=stickerSymbolItems(stickerWorking).filter(item=>item.id!==stickerWorking.activeSymbol);
  stickerWorking={...stickerWorking,symbols:items,symbol:'none',activeSymbol:null};
  if(items.length)selectStickerSymbol(items[items.length-1].id);else setupStickerEditor();
  rememberSticker(before);return;
 }
 if(event.target.closest('[data-new-case-sticker], [data-duplicate-case-sticker]')){
  const before=stickerSnapshot();
  syncSceneSticker();
  stickerPhotoRequest++;stickerPhotoBusy=false;
  const duplicate=!!event.target.closest('[data-duplicate-case-sticker]');
  const offset=sceneStickers.length%4;
  stickerWorking={...structuredClone(duplicate?stickerWorking:stickerDefault),sceneId:`scene-${nextSceneId++}`,casePosition:[35+offset*10,35+offset*12]};
  sceneStickers.push(stickerWorking);
  setupStickerEditor();rememberSticker(before);return;
 }
 if(event.target.closest('[data-remove-case-sticker]')){
  if(sceneStickers.length<=1)return;
  const before=stickerSnapshot();
  sceneStickers=sceneStickers.filter(item=>item.sceneId!==stickerWorking.sceneId);
  stickerWorking=structuredClone(sceneStickers[sceneStickers.length-1]);
  stickerPhotoRequest++;stickerPhotoBusy=false;
  setupStickerEditor();rememberSticker(before);return;
 }
 if(event.target.closest('[data-remove-sticker-photo]')){
  const before=stickerSnapshot();
  stickerPhotoRequest++;
  stickerPhotoBusy=false;
  stickerWorking={...stickerWorking,photo:'',photoOriginal:'',photoMask:null,photoCutout:false,shape:stickerWorking.shape==='photo'?'oval':stickerWorking.shape};
  $('#sticker-form').elements.shape.value=stickerWorking.shape;
  updateStickerPreview();
  const input=$('#sticker-photo');
  input.form.querySelector('button[type="submit"]').disabled=false;
  $('#sticker-photo-status').textContent='JPG, PNG o WebP, hasta 50 MB. La imagen se optimiza automáticamente.';
  input.focus();
  rememberSticker(before);
 }
 if(event.target.closest('[data-reset-sticker-position]')){
  const before=stickerSnapshot();
  stickerWorking={...stickerWorking,positions:{},symbols:stickerSymbolItems(stickerWorking).map((item,index)=>({...item,point:[35+index%3*15,35+Math.floor(index/3)%3*15]}))};
  updateStickerPreview();
  rememberSticker(before);
 }
 const button=event.target.closest('[data-delete-sticker]');
 if(button){
  const index=customStickers.findIndex(sticker=>sticker.id===button.dataset.deleteSticker);
  if(index<0)return;
  const before=stickerSnapshot();
  selectedStickers.delete(customStickers[index].id);
  customStickers.splice(index,1);
  $('#saved-sticker-list').innerHTML=customStickerList();
  $('#sticker-form input[name="text"]').focus();
  rememberSticker(before);
 }
 if(event.target.closest('#open-custom-bag'))$('#bag').click();
});
function bagStickers(){
 return `<details class="bag-stickers"><summary>Agregar stickers <span data-sticker-total aria-live="polite">${stickerTotal()}</span></summary>
 <fieldset class="bag-sticker-options"><legend>Elige las láminas que quieres añadir</legend>
 ${STICKER_SHEETS.map(([id,name,file])=>`<div class="bag-sticker-option">
 <button type="button" class="zoom-image" data-gallery-zoom aria-label="Ampliar ${name}"><img src="assets/stickers/${file||`${id}.webp`}" alt="Lámina ${name}"></button>
 <label><input type="checkbox" data-sticker="${id}" ${selectedStickers.has(id)?'checked':''}> ${name}</label>
 </div>`).join('')}
 </fieldset>
 <fieldset class="bag-sticker-repertoire"><legend>Repertorio original</legend>
 <div class="repertoire-card">
 <button type="button" data-gallery-zoom aria-label="Ampliar el repertorio completo"><img src="assets/stickers/repertorio/referencia.png" alt="Lámina completa del repertorio original de Power Case" loading="lazy"></button>
 <label><input type="checkbox" data-sticker="repertorio-original" ${selectedStickers.has('repertorio-original')?'checked':''}> Añadir repertorio completo</label>
 </div></fieldset>
 ${customStickers.length?`<fieldset class="bag-sticker-options"><legend>Mis diseños</legend>${customStickers.map(sticker=>`<label class="bag-sticker-option">${stickerPreview(sticker)}<span><input type="checkbox" data-sticker="${sticker.id}" ${selectedStickers.has(sticker.id)?'checked':''}> ${safe(stickerName(sticker))}</span></label>`).join('')}</fieldset>`:''}
 <a class="text-link" href="#/personalizacion" data-customize-link>Diseñar mis propios stickers</a>
 </details>`;
}
$('#bag-content').addEventListener('click',event=>{
 if(event.target.closest('[data-customize-link]'))$('#bag-dialog').close();
});
$('#bag-content').addEventListener('change',event=>{
 const input=event.target.closest('input[data-sticker]');
 if(!input)return;
 if(input.checked)selectedStickers.add(input.dataset.sticker);
 else selectedStickers.delete(input.dataset.sticker);
 $('[data-sticker-total]').textContent=stickerTotal();workspace?.changed();
});
function bagContent(){
 if(!bag.length)return '<p class="empty">Tu bolsa espera algo especial.</p><a class="button dark full" href="#/coleccion" id="bag-explore">Explorar colección</a><a class="text-link" href="#/accesorios" data-bag-accessories>Explorar accesorios</a><a class="text-link" href="#/personalizacion" data-customize-link>Diseñar mis propios stickers</a>';
 const rows=bag.map((item,i)=>{
  if(item.accessory){const a=getAccessory(item.accessory);if(!a)return '';return `<article class="bag-item"><img src="${a.image}" alt="${safe(a.name)}"><div><h3>${safe(a.name)}</h3><p>${ACCESSORY_CATEGORIES[a.category].singular}</p><p>${accessoryPrice(a)}</p><button data-remove="${i}" aria-label="Eliminar ${ACCESSORY_CATEGORIES[a.category].singular} ${safe(a.name)}">Eliminar</button></div></article>`;}
  const f=getFinish(item.finish),m=getModel(item.model);return `<article class="bag-item">${photo(m,f,true)}<div><h3>${f.name}</h3><p>${m.name}</p><p>${GROUPS[f.group]}</p><p>${casePrice(m)}</p><button data-remove="${i}" aria-label="Eliminar ${f.name} para ${m.name}">Eliminar</button></div></article>`;
 }).join('');
 return rows+bagStickers()+'<a class="text-link" href="#/accesorios" data-bag-accessories>Seguir eligiendo accesorios</a><p class="note">Tu selección se guarda en tu cuenta. Las compras estarán disponibles próximamente.</p><button class="button dark full" disabled>Compras disponibles próximamente</button>';
}
document.addEventListener('click',async event=>{const close=event.target.closest('[data-close]');if(close){$('#'+close.dataset.close).close();if(close.dataset.close==='auth')pending=null;}const filter=event.target.closest('[data-group]');if(filter){group=filter.dataset.group;query='';location.hash=`/coleccion/${modelId}${group==='todo'?'':'/'+group}`;}const buy=event.target.closest('#purchase,[data-add-accessory]');if(buy){if(!session&&accountInitializing)await accountInitialization;const item=buy.dataset.accessory?{accessory:buy.dataset.accessory}:{finish:buy.dataset.finish,model:buy.dataset.model};if(session)add(item);else{pending=item;account();}}const remove=event.target.closest('[data-remove]');if(remove){bag.splice(Number(remove.dataset.remove),1);if(!bag.length)selectedStickers.clear();$('#count').textContent=bag.length;$('#bag-content').innerHTML=bagContent();workspace?.changed();}if(event.target.closest('#bag-explore,[data-bag-accessories]'))$('#bag-dialog').close();const zoom=event.target.closest('[data-gallery-zoom]');if(zoom){const img=zoom.querySelector('img');$('#image-dialog-content').innerHTML=`<img src="${img.src}" alt="${safe(img.alt)}">`;$('#image-dialog').showModal();}});
document.addEventListener('change',event=>{if(event.target.id==='catalog-model'){query='';location.hash=`/coleccion/${event.target.value}${group==='todo'?'':'/'+group}`;}if(event.target.id==='product-model'){const r=parseRoute();location.hash=`/producto/${r[1]}/${event.target.value}`;}});
document.addEventListener('input',event=>{if(event.target.id!=='catalog-search')return;query=event.target.value;const m=getModel(modelId),list=modelFinishes(m).filter(f=>(group==='todo'||f.group===group)&&f.name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')));$('#product-grid').innerHTML=list.map(f=>card(f,m)).join('')||'<p class="empty">No encontramos ese acabado.</p>';$('#result-count').textContent=`Acabados disponibles`;});
$('#auth-form').addEventListener('submit',async event=>{
 event.preventDefault();
 const button=$('#submit');if(button.disabled)return;
 button.disabled=true;$('#auth-status').textContent='Conectando…';
 const signingUp=mode==='signup';
 try{
  const email=$('#email').value.trim(),password=$('#password').value;
  const result=await within(signingUp?accounts.signUp($('#name').value.trim(),email,password):accounts.signIn(email,password),'Account request timed out');
  $('#password').value='';
  if(!result.session){$('#auth-status').textContent='Revisa tu correo para confirmar tu cuenta. Después podrás iniciar sesión.';return;}
  const accountLoad=activateAccount(result.user);
  const selectedFavorite=pendingFavorite,selectedProduct=pending;
  pendingFavorite=null;pending=null;$('#auth').close();
  await accountLoad;
  if(selectedProduct)add(selectedProduct);
  if(selectedFavorite){
   if(favoritesStatus==='ready')await writeFavorite(getFinish(selectedFavorite.finish),getModel(selectedFavorite.model),true);
   else toast('Sesión iniciada. No pudimos recuperar tus favoritos. Puedes reintentar desde Mis favoritos.');
  }else if(!selectedProduct)toast('Sesión iniciada.');
 }catch(error){
  const messages={invalid_credentials:'El correo o la contraseña no son correctos. Si aún no tienes cuenta, abre Crear cuenta.',email_not_confirmed:'Confirma tu correo antes de iniciar sesión.',user_already_exists:'Ya existe una cuenta con ese correo.',weak_password:'Usa una contraseña más segura.',email_address_invalid:'Revisa la dirección de correo y usa un correo válido al que tengas acceso.',email_address_not_authorized:'El envío de confirmaciones sigue en modo de prueba y esta dirección todavía no está habilitada.',over_email_send_rate_limit:'Se alcanzó el límite de correos de confirmación de Supabase. No se pudo completar el registro. Hace falta configurar el servicio de correo de Power Case.',over_request_rate_limit:'Se hicieron demasiados intentos. Espera unos minutos antes de volver a intentarlo.',signup_disabled:'La creación de cuentas está desactivada temporalmente.'};
  $('#auth-status').textContent=messages[error.code]||'No pudimos conectar con tu cuenta. Comprueba tu conexión y vuelve a intentarlo.';
 }finally{button.disabled=!accounts.configured;}
});
$('#auth').addEventListener('cancel',()=>{pending=null;pendingFavorite=null;});$('#auth').addEventListener('close',()=>{$('#password').value='';pending=null;pendingFavorite=null;});$('#signin').onclick=()=>authMode('signin');$('#signup').onclick=()=>authMode('signup');$('#account').onclick=account;$('#footer-account').onclick=account;$('#bag').onclick=()=>{$('#bag-content').innerHTML=bagContent();$('#bag-dialog').showModal();};$('#logout').onclick=async()=>{
 const button=$('#logout');button.disabled=true;
 try{await accounts.signOut();await activateAccount(null);$('#profile').close();toast('Sesión cerrada.');}
 catch{toast('No pudimos cerrar la sesión. Comprueba tu conexión e inténtalo de nuevo.');}
 finally{button.disabled=false;}
};$('#menu').onclick=()=>{const open=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',open);};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
for(const [id,name] of [['account','UserRound'],['bag','ShoppingBag'],['menu','Menu']]){const b=$('#'+id);b.innerHTML=icon(name)+(id==='bag'?'<span id="count">0</span>':'');}
document.querySelectorAll('.close').forEach(b=>b.innerHTML=icon('X'));
document.body.insertAdjacentHTML('beforeend',`<dialog id="image-dialog" aria-label="Imagen ampliada"><button class="close" data-close="image-dialog" aria-label="Cerrar imagen">${icon('X')}</button><div id="image-dialog-content"></div></dialog>`);
window.addEventListener('hashchange',()=>{const prev=document.querySelector('.product-detail');render(!prev||parseRoute()[0]!=='producto');});render();

workspace=new PowerCaseWorkspace({accounts,capture:captureWorkspace,restore:restoreWorkspace,notify:workspaceNotice});
workspace.open(null).catch(()=>workspaceNotice('local-error'));
const accountDocumentReady=document.readyState==='loading'?new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true})):Promise.resolve();
accountInitialization=within(accountDocumentReady.then(()=>accounts.initialize(activateAccount)),'Session initialization timed out').catch(()=>{
 if(!session)activateAccount(null);
 if($('#auth-status'))$('#auth-status').textContent='No pudimos recuperar tu sesión. Comprueba tu conexión e inicia sesión de nuevo.';
}).finally(()=>{accountInitializing=false;});
document.addEventListener('click',event=>{
 if(event.target.closest('[data-workspace-retry]'))workspace.retry();
 const resolve=event.target.closest('[data-workspace-resolve]');
 if(resolve)workspace.resolve(resolve.dataset.workspaceResolve);
});
