const MODELS = [
 {id:'iphone17',name:'iPhone 17',brand:'Apple',prefix:'iphone17-base-blanco-',suffix:'-dos-vistas',views:2},
 {id:'iphone17promax',name:'iPhone 17 Pro Max',brand:'Apple',prefix:'iphone17-',suffix:'-individual',views:1},
 {id:'iphone16promax',name:'iPhone 16 Pro Max',brand:'Apple',prefix:'iphone16-',suffix:'-individual',views:1},
 {id:'iphone15',name:'iPhone 15',brand:'Apple',prefix:'iphone15-base-rosa-',suffix:'-dos-vistas',views:2},
 {id:'s26',name:'Galaxy S26',brand:'Samsung',prefix:'samsung-s26-base-',suffix:'-dos-vistas',views:2},
 {id:'s26ultra',name:'Galaxy S26 Ultra',brand:'Samsung',prefix:'samsung-s26-ultra-',suffix:'-dos-vistas',views:2},
 {id:'pixel11',name:'Pixel 11 Pro XL',brand:'Google',prefix:'pixel11-pro-xl-',suffix:'-dos-vistas',views:2},
 {id:'ipad-pro-11-m5',name:'iPad Pro de 11 pulgadas (M5)',brand:'Apple',tablet:true,views:2},
 {id:'galaxy-tab-s12-ultra',name:'Galaxy Tab S12 Ultra',brand:'Samsung',tablet:true,views:2},
 {id:'xiaomi-pad-8',name:'Xiaomi Pad 8',brand:'Xiaomi',tablet:true,views:1}
];
const FINISHES = [
 {id:'aura',name:'Aura',group:'reflejos',color:'#c9d99e',second:'#f3b0a4',copy:'Verde luminoso, destellos nacarados y un toque de coral. Un acabado que cambia con la luz.'},
 {id:'nacar',name:'Nácar',group:'reflejos',color:'#bba4e1',second:'#eee8cf'},
 {id:'laguna',name:'Laguna',group:'reflejos',color:'#087bdb',second:'#45d6c6'},
 {id:'alba',name:'Alba',group:'reflejos',color:'#f0cd78',second:'#e99ba8'},
 {id:'coral',name:'Coral',group:'reflejos',color:'#ffc1a0',second:'#ee7669'},
 {id:'boreal',name:'Boreal',group:'reflejos',color:'#a05dce',second:'#d94786'},
 {id:'grafito',name:'Grafito',group:'lisos',color:'#3c3e3d'},
 {id:'azul-tinta',name:'Azul Tinta',group:'lisos',color:'#263b59'},
 {id:'bosque',name:'Bosque',group:'lisos',color:'#3b5741'},
 {id:'rosa-perla',name:'Rosa Perla',group:'lisos',color:'#e9b9b9'},
 {id:'lila',name:'Lila',group:'lisos',color:'#b49bcd'},
 {id:'coral-liso',name:'Coral Satin',group:'lisos',color:'#ed8876'},
 {id:'ondas',name:'Ondas',group:'atelier',color:'#93cce9',second:'#704638'},
 {id:'lunares',name:'Lunares',group:'atelier',color:'#79513b',second:'#f0d587'},
 {id:'espiga',name:'Espiga',group:'atelier',color:'#d8b474',second:'#73513c'},
 {id:'ritmo',name:'Ritmo',group:'atelier',color:'#795043',second:'#e6b4bc'},
 {id:'estelar',name:'Estelar',group:'atelier',color:'#e9b4ba',second:'#c67950'},
 {id:'mosaico',name:'Mosaico',group:'atelier',color:'#9dcbde',second:'#795744'}
];
const GROUPS={reflejos:'Reflejos / Aura',lisos:'Essential',atelier:'Atelier / Patrones'};
const FLORAL_FINISHES=[
 {id:'margarita',name:'Margarita',group:'atelier',color:'#edc56b',second:'#fff2d6',galleryBase:'flora',copy:'Margaritas en crema sobre amarillo suave, con centros terracota y tallos verde salvia. Un estampado luminoso que continúa en el agarre.'},
 {id:'amapola',name:'Amapola',group:'atelier',color:'#f1e6d2',second:'#c9472b',galleryBase:'flora',copy:'Amapolas rojas de pétalos amplios y trazos delicados sobre una base marfil. El agarre retoma el dibujo floral.'},
 {id:'jardin-nocturno',name:'Jardín nocturno',group:'atelier',color:'#28364c',second:'#b799c9',galleryBase:'flora',copy:'Flores silvestres en lila, azul y albaricoque sobre un fondo azul noche, entre tallos verde oliva. Un jardín de detalles pequeños con agarre coordinado.'},
 {id:'dalia',name:'Dalia',group:'atelier',color:'#d48c8b',second:'#a24357',galleryBase:'flora',copy:'Dalias de pétalos geométricos en ciruela, terracota y rosa sobre una base rosa empolvado. Flores de gran formato que también decoran el agarre.'}
];
FINISHES.push(...FLORAL_FINISHES);
const NEW_PATTERN_FINISHES=[
 {id:'orbita',name:'Órbita',group:'atelier',color:'#252e40',second:'#c47742',galleryBase:'nuevos-patrones',copy:'Órbitas de trazo marfil y pequeños planetas color cobre recorren una base azul noche. Un dibujo celeste de líneas finas, con agarre a juego.'},
 {id:'vitral',name:'Vitral',group:'atelier',color:'#315f5d',second:'#cc9950',galleryBase:'nuevos-patrones',copy:'Arcos y planos geométricos en verde petróleo, ámbar, rosa y crema, unidos por líneas oscuras. Un estampado inspirado en vitrales que continúa en el agarre.'},
 {id:'tinta',name:'Tinta',group:'atelier',color:'#eee5d4',second:'#53504f',galleryBase:'nuevos-patrones',copy:'Vetado de tinta grafito y gris humo sobre marfil. Trazos orgánicos de efecto marmoleado, con un agarre que retoma el mismo dibujo.'},
 {id:'big-bang',name:'Big Bang',group:'atelier',color:'#f3e6cf',second:'#cd6a2e',galleryBase:'nuevos-patrones',copy:'Estrellas, destellos y formas en expansión sobre una base crema. Azul, naranja y amarillo dan ritmo a un estampado gráfico que también envuelve el agarre.'}
];
FINISHES.push(...NEW_PATTERN_FINISHES);
const ATELIER_REPLACEMENTS={
 lunares:{name:'Fragmento',color:'#eee4d2',second:'#2d5846',galleryFolder:'fragmento',copy:'Fragmentos irregulares en verde bosque, terracota, lila y grafito sobre una base marfil. Un estampado arquitectónico con agarre a juego.'},
 ondas:{name:'Entrelazado',color:'#bc4d32',second:'#45679c',galleryFolder:'entrelazado',copy:'Cintas en crema y azul se entrecruzan sobre un fondo terracota. Una trama gráfica que continúa por los bordes y el agarre.'},
 espiga:{name:'Cartografía',color:'#202f48',second:'#81b3cd',galleryFolder:'cartografia',copy:'Líneas topográficas azul hielo y acentos cobre recorren una base azul profundo. Detalles finos que también envuelven el agarre.'},
 ritmo:{name:'Herbario',color:'#583342',second:'#dfc2a0',galleryFolder:'herbario',copy:'Hojas de ginkgo y helechos en crema y rosa sobre un fondo ciruela. Un dibujo botánico de líneas delicadas, con agarre coordinado.'}
};
for(const finish of FINISHES)if(ATELIER_REPLACEMENTS[finish.id])Object.assign(finish,ATELIER_REPLACEMENTS[finish.id]);
const REALISTIC_IPHONE_MODELS=['iphone15','iphone16promax','iphone17promax'];
const REALISTIC_ANDROID_MODELS=['pixel11','s26ultra','s26'];
function asset(model,finish,size='large'){
 if(!model.tablet&&finish.galleryBase)return `assets/${finish.galleryBase}/${model.id}/${finish.id}/01-con-telefono.webp`;
 if(!model.tablet&&ATELIER_REPLACEMENTS[finish.id])return `assets/atelier-propuestas/${model.id}/${ATELIER_REPLACEMENTS[finish.id].galleryFolder}/01-con-telefono.webp`;
 if(REALISTIC_ANDROID_MODELS.includes(model.id))return `assets/android-realista/${model.id}/${finish.id}/01-con-telefono.webp`;
 if(REALISTIC_IPHONE_MODELS.includes(model.id))return `assets/iphone-realista/${model.id}/${finish.id}/01-con-telefono.webp`;
 if(model.id==='iphone17'&&finish.group==='reflejos')return `assets/reflejos-realista/iphone17/${finish.id}/01-con-telefono.webp`;
 if(model.id==='iphone17'&&finish.group==='lisos')return `assets/essential-realista/iphone17/${finish.id}/01-con-telefono.webp`;
 if(model.id==='iphone17'&&finish.group==='atelier')return `assets/atelier-realista/iphone17/${finish.id}/00-con-telefono.webp`;
 const suffix=size==='thumb'?'-thumb':'';
 if(model.tablet)return `assets/tabletas/${model.id}-${finish.id}${suffix}.jpg`;
 return `assets/catalog/${model.prefix}${finish.id}${model.suffix}${suffix}.webp`;
}
const STUDIO_PHOTOS = {
 iphone15: ["azul-tinta","boreal","bosque","coral","coral-liso","espiga","estelar","laguna","lila","lunares","mosaico","nacar","ondas","ritmo","rosa-perla"],
 iphone16promax: ["azul-tinta","boreal","coral","coral-liso","espiga","estelar","laguna","lila","lunares","ritmo","rosa-perla"],
 iphone17: ["azul-tinta","boreal","bosque","coral","coral-liso","espiga","estelar","laguna","lila","lunares","mosaico","nacar","ondas","ritmo","rosa-perla"],
 iphone17promax: ["azul-tinta","boreal","bosque","coral","coral-liso","espiga","estelar","lila","lunares","mosaico","ondas","ritmo","rosa-perla"],
 pixel11: ["azul-tinta","boreal","bosque","coral","coral-liso","espiga","estelar","laguna","lila","lunares","mosaico","nacar","ondas","ritmo","rosa-perla"],
 s26: ["azul-tinta","boreal","bosque","coral","coral-liso","espiga","estelar","laguna","lila","lunares","mosaico","nacar","ondas","ritmo","rosa-perla"],
 s26ultra: ["azul-tinta","boreal","bosque","coral","coral-liso","espiga","estelar","laguna","lila","lunares","mosaico","nacar","ondas","ritmo","rosa-perla"]
};
