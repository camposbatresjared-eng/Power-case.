const MODELS = [
 {id:'iphone17',name:'iPhone 17',brand:'Apple',prefix:'iphone17-base-blanco-',suffix:'-dos-vistas',views:2},
 {id:'iphone17promax',name:'iPhone 17 Pro Max',brand:'Apple',prefix:'iphone17-',suffix:'-individual',views:1},
 {id:'iphone16promax',name:'iPhone 16 Pro Max',brand:'Apple',prefix:'iphone16-',suffix:'-individual',views:1},
 {id:'iphone15',name:'iPhone 15',brand:'Apple',prefix:'iphone15-base-rosa-',suffix:'-dos-vistas',views:2},
 {id:'s26',name:'Galaxy S26',brand:'Samsung',prefix:'samsung-s26-base-',suffix:'-dos-vistas',views:2},
 {id:'s26ultra',name:'Galaxy S26 Ultra',brand:'Samsung',prefix:'samsung-s26-ultra-',suffix:'-dos-vistas',views:2},
 {id:'pixel11',name:'Pixel 11 Pro XL',brand:'Google',prefix:'pixel11-pro-xl-',suffix:'-dos-vistas',views:2}
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
function asset(model,finish,size='large'){return `assets/catalog/${model.prefix}${finish.id}${model.suffix}${size==='thumb'?'-thumb':''}.webp`;}
