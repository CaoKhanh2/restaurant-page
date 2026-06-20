import{u as w}from"./url.CJnWphTl.js";const i=document.getElementById("menu-tabs-inner"),l=document.getElementById("carte-sections"),_={potages:"potages",entrees:"entrees",dimsum:"dimsum",poulet:"poulet",boeuf:"boeuf"},E=e=>!e||e.includes("placeholder"),x=e=>e.includes("🌶"),m=e=>e.replace(/🌶️/g,"").replace(/🌶/g,"").trim(),u=e=>{const t=e.indexOf("/");return t===-1?{fr:e.trim(),en:""}:{fr:e.slice(0,t).trim(),en:e.slice(t+1).trim()}},I=e=>w("/menu/dish-detail","?"+new URLSearchParams({name:e.name_fr,image:e.image_path||"",description:e.description_fr||"",price:e.price}).toString()),S=e=>{i&&i.scrollTo({left:Math.max(0,e.offsetLeft-(i.clientWidth-e.clientWidth)/2),behavior:"smooth"})},L=e=>{i.querySelectorAll(".menu-tab").forEach(t=>{const a=t.dataset.target===e;t.classList.toggle("active",a),a&&S(t)})};function f(){i.querySelectorAll(".menu-tab").forEach(e=>{e.addEventListener("click",()=>{const t=document.getElementById(e.dataset.target);if(t)if(window.__lenis)window.__lenis.scrollTo(t,{offset:-118,duration:1.1});else{const a=t.getBoundingClientRect().top+window.pageYOffset-118;window.scrollTo({top:a,behavior:"smooth"})}})})}function g(e){if(!("IntersectionObserver"in window)||!e.length)return;const t=new IntersectionObserver(a=>{a.forEach(s=>{s.isIntersecting&&L(s.target.id)})},{rootMargin:"-130px 0px -65% 0px",threshold:0});e.forEach(a=>t.observe(a))}async function T(){try{const a=(await(await fetch("/api/menu.php")).json()).categories??[];a.forEach(s=>{const{fr:r}=u(s.title_fr),c=document.createElement("button");c.className="menu-tab",c.type="button",c.dataset.target=`cat-${s.key}`,c.textContent=r,i.appendChild(c)}),l.innerHTML=a.map(s=>{const{fr:r,en:c}=u(s.title_fr),o=_[s.key],d=s.key==="vegetariens",h=(s.dishes||[]).map(n=>{const p=x(n.name_fr),v=p||d?`
            <div class="carte-card-tags">
              ${p?'<span class="carte-tag spicy"><span class="ico">🌶️</span>Épicé</span>':""}
              ${d?'<span class="carte-tag veg"><span class="ico">🌱</span>Végé</span>':""}
            </div>`:"",y=E(n.image_path)?'<div class="carte-card-fallback"><i class="fa-solid fa-bowl-food"></i><span>Les 4 Saisons</span></div>':`<img src="${n.image_path}" alt="${m(n.name_fr)}" loading="lazy">`,$=n.is_featured?'<span class="carte-badge">Signature</span>':"";return`
            <a class="carte-card${n.is_featured?" is-featured":""}" href="${I(n)}">
              <div class="carte-card-media">${y}${$}</div>
              <div class="carte-card-body">
                ${v}
                <h3 class="carte-card-name">${m(n.name_fr)}</h3>
                ${n.name_en?`<span class="carte-card-tr">${n.name_en}</span>`:""}
                <span class="carte-card-price">${parseFloat(n.price).toFixed(0)}.-</span>
              </div>
            </a>`}).join(""),b=o?`
          <picture class="carte-cat-icon">
            <source srcset="/icon/icon-${o}-new.webp" type="image/webp">
            <img src="/icon/icon-${o}-new.jpg" alt="" width="56" height="56" loading="lazy">
          </picture>`:"";return`
          <section id="cat-${s.key}" class="carte-section" data-reveal>
            <div class="carte-section-head">
              ${b}
              <div class="carte-section-titles">
                <h2>${r}</h2>
                ${c?`<span class="carte-section-sub">${c}</span>`:""}
              </div>
            </div>
            <div class="carte-grid">${h||'<p style="text-align:center">Aucun plat disponible.</p>'}</div>
          </section>`}).join(""),f(),g(Array.from(l.querySelectorAll("section")))}catch{l.innerHTML='<p style="text-align:center;padding:40px">Impossible de charger le menu.</p>'}}f();g([document.getElementById("cat-menus")].filter(Boolean));T();
