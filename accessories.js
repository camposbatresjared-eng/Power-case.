const ACCESSORY_CATEGORIES={
 carteras:{name:'Carteras magnéticas',singular:'Cartera magnética',price:200},
 soportes:{name:'PopSocket',singular:'PopSocket',price:90},
 llaveros:{name:'Llaveros para funda',singular:'Llavero para funda',price:45}
};
const ACCESSORIES=[
 {
  "id": "cartera-01",
  "number": "01",
  "category": "carteras",
  "name": "Grafito",
  "price": 200,
  "image": "assets/accesorios/carteras/01-grafito.webp",
  "colors": [
   "#303234"
  ],
  "design": "Grafito combina un tono carbón con una textura fina y la firma discreta cerca del borde inferior."
 },
 {
  "id": "cartera-02",
  "number": "02",
  "category": "carteras",
  "name": "Bosque",
  "price": 200,
  "image": "assets/accesorios/carteras/02-bosque.webp",
  "colors": [
   "#153e2b"
  ],
  "design": "Bosque presenta un verde profundo con costuras a tono y un frente limpio."
 },
 {
  "id": "cartera-03",
  "number": "03",
  "category": "carteras",
  "name": "Aurora",
  "price": 200,
  "image": "assets/accesorios/carteras/03-aurora.webp",
  "colors": [
   "#b4ddc6",
   "#c8afe0",
   "#efbac9"
  ],
  "design": "Aurora mezcla verde suave, lila y rosa en un acabado de reflejos delicados."
 },
 {
  "id": "cartera-04",
  "number": "04",
  "category": "carteras",
  "name": "Azul tinta",
  "price": 200,
  "image": "assets/accesorios/carteras/04-azul-tinta.webp",
  "colors": [
   "#203d58"
  ],
  "design": "Azul tinta ofrece un azul profundo con una textura sutil y costuras del mismo tono."
 },
 {
  "id": "cartera-05",
  "number": "05",
  "category": "carteras",
  "name": "Arena",
  "price": 200,
  "image": "assets/accesorios/carteras/05-arena.webp",
  "colors": [
   "#d5bd9e"
  ],
  "design": "Arena combina un beige cálido con una textura fina y detalles discretos."
 },
 {
  "id": "cartera-06",
  "number": "06",
  "category": "carteras",
  "name": "Rosa perla",
  "price": 200,
  "image": "assets/accesorios/carteras/06-rosa-perla.webp",
  "colors": [
   "#cf9eaa"
  ],
  "design": "Rosa perla presenta un rosa suave con un brillo perlado moderado."
 },
 {
  "id": "cartera-07",
  "number": "07",
  "category": "carteras",
  "name": "Boreal",
  "price": 200,
  "image": "assets/accesorios/carteras/07-boreal.webp",
  "colors": [
   "#80c6bd",
   "#255772"
  ],
  "design": "Boreal recorre tonos aqua y azul petróleo con un suave cambio de color."
 },
 {
  "id": "cartera-08",
  "number": "08",
  "category": "carteras",
  "name": "Alba",
  "price": 200,
  "image": "assets/accesorios/carteras/08-alba.webp",
  "colors": [
   "#f2d681",
   "#eb9b99"
  ],
  "design": "Alba pasa del amarillo cálido al coral en un degradado suave."
 },
 {
  "id": "cartera-09",
  "number": "09",
  "category": "carteras",
  "name": "Nácar",
  "price": 200,
  "image": "assets/accesorios/carteras/09-nacar.webp",
  "colors": [
   "#efeadf",
   "#d4c8e8"
  ],
  "design": "Nácar tiene una base marfil con matices claros de lila y verde."
 },
 {
  "id": "cartera-10",
  "number": "10",
  "category": "carteras",
  "name": "Circuito",
  "price": 200,
  "image": "assets/accesorios/carteras/10-circuito.webp",
  "colors": [
   "#18392c",
   "#a0caa2"
  ],
  "design": "Circuito dibuja líneas y nodos verdes sobre una base oscura, inspirados en la energía de Power Case."
 },
 {
  "id": "cartera-11",
  "number": "11",
  "category": "carteras",
  "name": "Ondas",
  "price": 200,
  "image": "assets/accesorios/carteras/11-ondas.webp",
  "colors": [
   "#b79bce",
   "#a6d4ca",
   "#efe6d1"
  ],
  "design": "Ondas entrelaza franjas curvas de lila, aqua, verde suave y crema."
 },
 {
  "id": "cartera-12",
  "number": "12",
  "category": "carteras",
  "name": "Damero",
  "price": 200,
  "image": "assets/accesorios/carteras/12-damero.webp",
  "colors": [
   "#1b4733",
   "#eee4cc"
  ],
  "design": "Damero alterna verde bosque y crema en una cuadrícula de líneas onduladas."
 },
 {
  "id": "cartera-13",
  "number": "13",
  "category": "carteras",
  "name": "Relieve",
  "price": 200,
  "image": "assets/accesorios/carteras/13-relieve.webp",
  "colors": [
   "#23394a",
   "#9aa77c",
   "#c8ae8d"
  ],
  "design": "Relieve combina líneas de contorno en verde y arena sobre azul oscuro."
 },
 {
  "id": "cartera-14",
  "number": "14",
  "category": "carteras",
  "name": "Prisma",
  "price": 200,
  "image": "assets/accesorios/carteras/14-prisma.webp",
  "colors": [
   "#da937d",
   "#b8a0cf",
   "#214531"
  ],
  "design": "Prisma reúne planos geométricos en coral, lila, crema y verde bosque."
 },
 {
  "id": "cartera-15",
  "number": "15",
  "category": "carteras",
  "name": "Órbita",
  "price": 200,
  "image": "assets/accesorios/carteras/15-orbita.webp",
  "colors": [
   "#eee4ce",
   "#1f5737",
   "#b9cd58"
  ],
  "design": "Órbita traza arcos verdes y un acento lima sobre un fondo crema."
 },
 {
  "id": "cartera-16",
  "number": "16",
  "category": "carteras",
  "name": "Pulso",
  "price": 200,
  "image": "assets/accesorios/carteras/16-pulso.webp",
  "colors": [
   "#1f3e57",
   "#a3bd86",
   "#e1df76"
  ],
  "design": "Pulso distribuye barras verticales de distintas longitudes sobre un azul profundo."
 },
 {
  "id": "cartera-17",
  "number": "17",
  "category": "carteras",
  "name": "Mosaico",
  "price": 200,
  "image": "assets/accesorios/carteras/17-mosaico.webp",
  "colors": [
   "#efe2c6",
   "#ba9bca",
   "#d78877"
  ],
  "design": "Mosaico reparte fragmentos de verde, coral, lila y menta sobre crema."
 },
 {
  "id": "cartera-18",
  "number": "18",
  "category": "carteras",
  "name": "Frecuencia",
  "price": 200,
  "image": "assets/accesorios/carteras/18-frecuencia.webp",
  "colors": [
   "#b294c5",
   "#274b38",
   "#e5dac0"
  ],
  "design": "Frecuencia cruza bandas diagonales en verde, menta y crema sobre lila."
 },
 {
  "id": "soporte-01",
  "number": "01",
  "category": "soportes",
  "name": "Grafito",
  "price": 90,
  "image": "assets/accesorios/soportes/01-grafito.webp",
  "colors": [
   "#424447"
  ],
  "design": "Grafito tiene un frente gris carbón y un símbolo de encendido discreto."
 },
 {
  "id": "soporte-02",
  "number": "02",
  "category": "soportes",
  "name": "Aurora",
  "price": 90,
  "image": "assets/accesorios/soportes/02-aurora.webp",
  "colors": [
   "#c5df81",
   "#e8b9d6",
   "#c7b0e5"
  ],
  "design": "Aurora combina reflejos pastel de verde, coral y lila."
 },
 {
  "id": "soporte-03",
  "number": "03",
  "category": "soportes",
  "name": "Circuito",
  "price": 90,
  "image": "assets/accesorios/soportes/03-circuito.webp",
  "colors": [
   "#243d31",
   "#a6dbaa"
  ],
  "design": "Circuito combina trazos de circuitos en menta con el monograma PC sobre un fondo oscuro."
 },
 {
  "id": "soporte-04",
  "number": "04",
  "category": "soportes",
  "name": "Impulso",
  "price": 90,
  "image": "assets/accesorios/soportes/04-impulso.webp",
  "colors": [
   "#e9dfc8",
   "#184b32",
   "#bedc49"
  ],
  "design": "Impulso combina bandas diagonales de verde bosque y lima sobre crema."
 },
 {
  "id": "soporte-05",
  "number": "05",
  "category": "soportes",
  "name": "Solar",
  "price": 90,
  "image": "assets/accesorios/soportes/05-solar.webp",
  "colors": [
   "#b85329",
   "#e69b80",
   "#f0debd"
  ],
  "design": "Solar despliega rayos geométricos en terracota, coral y crema desde un punto lateral."
 },
 {
  "id": "soporte-06",
  "number": "06",
  "category": "soportes",
  "name": "Rosa perla",
  "price": 90,
  "image": "assets/accesorios/soportes/06-rosa-perla.webp",
  "colors": [
   "#d5aaa8"
  ],
  "design": "Rosa perla presenta un tono rosa suave con un pequeño símbolo de encendido."
 },
 {
  "id": "soporte-07",
  "number": "07",
  "category": "soportes",
  "name": "Nácar",
  "price": 90,
  "image": "assets/accesorios/soportes/07-nacar.webp",
  "colors": [
   "#eae4d9",
   "#d5c6df"
  ],
  "design": "Nácar combina una base marfil con matices perlados de lila y menta."
 },
 {
  "id": "soporte-08",
  "number": "08",
  "category": "soportes",
  "name": "Ondas",
  "price": 90,
  "image": "assets/accesorios/soportes/08-ondas.webp",
  "colors": [
   "#b9a0ce",
   "#9dcaca",
   "#eee2ca"
  ],
  "design": "Ondas recorre el frente con franjas fluidas de lila, aqua, menta y crema."
 },
 {
  "id": "soporte-09",
  "number": "09",
  "category": "soportes",
  "name": "Prisma",
  "price": 90,
  "image": "assets/accesorios/soportes/09-prisma.webp",
  "colors": [
   "#28533b",
   "#c4a6d5",
   "#d59580"
  ],
  "design": "Prisma divide el frente en planos de verde, lila, coral y crema."
 },
 {
  "id": "soporte-10",
  "number": "10",
  "category": "soportes",
  "name": "Mármol",
  "price": 90,
  "image": "assets/accesorios/soportes/10-marmol.webp",
  "colors": [
   "#e5ddc7",
   "#5c625d"
  ],
  "design": "Mármol mezcla vetas irregulares en gris y verde suave sobre marfil."
 },
 {
  "id": "soporte-11",
  "number": "11",
  "category": "soportes",
  "name": "Mosaico",
  "price": 90,
  "image": "assets/accesorios/soportes/11-mosaico.webp",
  "colors": [
   "#e8dfc8",
   "#c7a7d4",
   "#dc9b86"
  ],
  "design": "Mosaico combina pequeñas figuras irregulares en coral, verde y lila sobre crema."
 },
 {
  "id": "soporte-12",
  "number": "12",
  "category": "soportes",
  "name": "Órbita",
  "price": 90,
  "image": "assets/accesorios/soportes/12-orbita.webp",
  "colors": [
   "#53243f",
   "#c0a4da",
   "#e9dfcc"
  ],
  "design": "Órbita dibuja líneas elípticas en crema y lila sobre ciruela, con un acento verde suave."
 },
 {
  "id": "llavero-01",
  "number": "01",
  "category": "llaveros",
  "name": "Cinta",
  "price": 45,
  "image": "assets/accesorios/llaveros/01-cinta.webp",
  "colors": [
   "#174bb4",
   "#f1e5ce"
  ],
  "design": "Cinta tiene una silueta de cinta plegada con un patrón de cuadros azul cobalto y crema."
 },
 {
  "id": "llavero-02",
  "number": "02",
  "category": "llaveros",
  "name": "Prisma",
  "price": 45,
  "image": "assets/accesorios/llaveros/02-prisma.webp",
  "colors": [
   "#b7dcd0",
   "#d3b0d9",
   "#efe1b0"
  ],
  "design": "Prisma combina una silueta alargada translúcida con reflejos aurora."
 },
 {
  "id": "llavero-03",
  "number": "03",
  "category": "llaveros",
  "name": "Carga",
  "price": 45,
  "image": "assets/accesorios/llaveros/03-carga.webp",
  "colors": [
   "#245233",
   "#c5dd35"
  ],
  "design": "Carga lleva un gráfico de batería con barras lima sobre verde bosque."
 },
 {
  "id": "llavero-04",
  "number": "04",
  "category": "llaveros",
  "name": "Órbita",
  "price": 45,
  "image": "assets/accesorios/llaveros/04-orbita.webp",
  "colors": [
   "#add7bc",
   "#e9dfc6",
   "#4b4e4f"
  ],
  "design": "Órbita une piezas en menta, crema y grafito con una pequeña placa Power Case."
 },
 {
  "id": "llavero-05",
  "number": "05",
  "category": "llaveros",
  "name": "Aurora pop",
  "price": 45,
  "image": "assets/accesorios/llaveros/05-aurora-pop.webp",
  "colors": [
   "#e88525",
   "#efd056",
   "#e99cac"
  ],
  "design": "Aurora pop combina una estrella de cuatro puntas suaves con ondas en ámbar, naranja, amarillo y rosa."
 },
 {
  "id": "llavero-06",
  "number": "06",
  "category": "llaveros",
  "name": "Ráfaga",
  "price": 45,
  "image": "assets/accesorios/llaveros/06-rafaga.webp",
  "colors": [
   "#292b2e",
   "#bbbcc0",
   "#eee5ce"
  ],
  "design": "Ráfaga une tres flechas en carbón, plata y marfil con detalles de rayas diagonales."
 },
 {
  "id": "llavero-07",
  "number": "07",
  "category": "llaveros",
  "name": "Rayo",
  "price": 45,
  "image": "assets/accesorios/llaveros/07-rayo.webp",
  "colors": [
   "#1d5735",
   "#dc9b8d"
  ],
  "design": "Rayo combina una silueta de relámpago verde con un borde coral."
 },
 {
  "id": "llavero-08",
  "number": "08",
  "category": "llaveros",
  "name": "Pixel",
  "price": 45,
  "image": "assets/accesorios/llaveros/08-pixel.webp",
  "colors": [
   "#eee6d1",
   "#bda4cf"
  ],
  "design": "Pixel tiene bordes escalonados, detalles lila y un símbolo de encendido sobre marfil."
 },
 {
  "id": "llavero-09",
  "number": "09",
  "category": "llaveros",
  "name": "Tótem",
  "price": 45,
  "image": "assets/accesorios/llaveros/09-totem.webp",
  "colors": [
   "#763b46",
   "#bc888d",
   "#eddfc5"
  ],
  "design": "Tótem enlaza un cuadrado de cuadros, un triángulo rayado y una placa crema en tonos cereza y rosa."
 },
 {
  "id": "llavero-10",
  "number": "10",
  "category": "llaveros",
  "name": "Pliegue",
  "price": 45,
  "image": "assets/accesorios/llaveros/10-pliegue.webp",
  "colors": [
   "#1c7479",
   "#9cd3cf",
   "#e7d7b5"
  ],
  "design": "Pliegue combina planos de aspecto plegado, rayas finas y tonos petróleo, aqua y arena."
 },
 {
  "id": "llavero-11",
  "number": "11",
  "category": "llaveros",
  "name": "Frecuencia",
  "price": 45,
  "image": "assets/accesorios/llaveros/11-frecuencia.webp",
  "colors": [
   "#37306c",
   "#a78ac4",
   "#c3e0e8"
  ],
  "design": "Frecuencia reúne curvas de índigo, violeta y azul hielo con líneas onduladas paralelas."
 },
 {
  "id": "llavero-12",
  "number": "12",
  "category": "llaveros",
  "name": "Espiral",
  "price": 45,
  "image": "assets/accesorios/llaveros/12-espiral.webp",
  "colors": [
   "#b7592e",
   "#ede0c4"
  ],
  "design": "Espiral forma una cinta curva continua en terracota y marfil, con un espacio abierto en el centro."
 }
];
const getAccessory=id=>ACCESSORIES.find(item=>item.id===id);
const accessoryPrice=item=>`$${item.price.toFixed(2)} MXN`;
const accessoryUrl=item=>`#/accesorio/${item.id}`;
function accessoryFavoriteButton(item,detail=false){
 const saved=favorites.has(`accessory/${item.id}`),label=`${saved?'Quitar de':'Añadir a'} favoritos ${ACCESSORY_CATEGORIES[item.category].singular} ${item.name}`;
 return `<button type="button" class="favorite-toggle ${detail?'favorite-detail':'favorite-card'}" data-favorite-finish="${item.id}" data-favorite-model="accessory" aria-pressed="${saved}" aria-label="${safe(label)}" title="${saved?'Quitar de favoritos':'Añadir a favoritos'}">${favoriteHeart()}${detail?`<span>${saved?'Guardado en favoritos':'Guardar en favoritos'}</span>`:''}</button>`;
}
function accessoryCard(item){
 const category=ACCESSORY_CATEGORIES[item.category];
 return `<article class="accessory-card"><a class="accessory-image" href="${accessoryUrl(item)}" aria-label="Ver ${category.singular} ${safe(item.name)}"><img src="${item.image}" alt="${category.singular} Power Case ${safe(item.name)}" width="720" height="720" loading="lazy" decoding="async"></a>${accessoryFavoriteButton(item)}<div class="accessory-card-copy"><span class="accessory-category">${category.singular}</span><h3><a href="${accessoryUrl(item)}">${safe(item.name)}</a></h3><p class="accessory-price">${accessoryPrice(item)}</p><button class="button dark full" type="button" data-add-accessory data-accessory="${item.id}" aria-label="Añadir ${category.singular} ${safe(item.name)} a la bolsa">Añadir a la bolsa</button></div></article>`;
}
function accessoriesPage(category='carteras'){
 if(!Object.hasOwn(ACCESSORY_CATEGORIES,category))category='carteras';
 const products=ACCESSORIES.filter(item=>item.category===category);
 return `<section class="accessories-heading"><span class="eyebrow">ACCESORIOS POWER CASE</span><h1>Hazlo tuyo.</h1><p>Carteras magnéticas, PopSocket y llaveros. Encuentra los detalles que van contigo.</p></section><section class="accessories-catalog" aria-label="Catálogo de accesorios"><nav class="accessories-filters" aria-label="Categorías de accesorios">${Object.entries(ACCESSORY_CATEGORIES).map(([id,c])=>`<a href="#/accesorios/${id}" ${category===id?'aria-current="page"':''}>${c.name}</a>`).join('')}</nav><div class="accessories-summary"><h2>${ACCESSORY_CATEGORIES[category].name}</h2><p>Precios en MXN</p></div><div class="accessories-grid">${products.map(accessoryCard).join('')}</div></section>`;
}
function accessoryDetail(id){
 const item=getAccessory(id)||ACCESSORIES[0],category=ACCESSORY_CATEGORIES[item.category];
 return `<div class="accessory-breadcrumb"><a href="#/accesorios">Accesorios</a><span aria-hidden="true">/</span><a href="#/accesorios/${item.category}">${category.name}</a></div><section class="product-detail accessory-detail"><div class="accessory-detail-gallery"><button type="button" class="accessory-detail-photo" data-gallery-zoom aria-label="Ampliar ${category.singular} ${safe(item.name)}"><img src="${item.image}" width="720" height="720" alt="${category.singular} Power Case ${safe(item.name)}"></button><p>Toca la imagen para ampliarla.</p></div><div class="product-config"><span class="eyebrow">${category.name}</span><h1>${category.singular} ${safe(item.name)}</h1><p class="accessory-detail-price">${accessoryPrice(item)}</p><div class="accessory-description"><h2>El diseño</h2><p class="product-intro">${safe(item.design)}</p></div><fieldset class="accessory-variants"><legend>Color y diseño <strong>${safe(item.name)}</strong></legend><div class="accessory-swatches">${ACCESSORIES.filter(a=>a.category===item.category).map(a=>`<a class="accessory-swatch" href="${accessoryUrl(a)}" aria-label="Ver diseño ${safe(a.name)}" title="${safe(a.name)}" ${a.id===item.id?'aria-current="true"':''} style="--swatch-background:${a.colors.length===1?a.colors[0]:`linear-gradient(135deg,${a.colors.join(',')})`}"><span aria-hidden="true"></span></a>`).join('')}</div></fieldset>${accessoryFavoriteButton(item,true)}<button class="button dark full" type="button" data-add-accessory data-accessory="${item.id}">Añadir a la bolsa</button></div></section>`;
}
