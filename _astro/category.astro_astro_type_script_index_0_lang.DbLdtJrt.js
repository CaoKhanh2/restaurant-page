import{u as l}from"./url.CJnWphTl.js";const m=new URLSearchParams(location.search),n=m.get("category"),i=document.getElementById("category-title"),o=document.getElementById("dish-list-container"),d=a=>l("/menu/dish-detail","?"+new URLSearchParams({name:a.name_fr,image:a.image_path,description:a.description_fr,price:a.price}).toString());n?(async()=>{const t=((await(await fetch(`/api/menu.php?category=${encodeURIComponent(n)}`)).json()).dishes??[]).filter(e=>e.image_path&&!e.image_path.includes("placeholder"));t.length?(i.textContent=t[0].title_fr||n,document.title=`${i.textContent} - Restaurant Les 4 Saisons`):i.textContent=n;let s=t.map(e=>`
        <a class="dish-card" href="${d(e)}">
          <img src="${e.image_path}" alt="${e.name_fr}" class="dish-card-img" loading="lazy">
          <div class="dish-card-info">
            <div>
              <h4>${e.name_fr}</h4>
              <span class="translation">${e.name_en||""}</span>
            </div>
            <span class="price">${parseFloat(e.price).toFixed(0)}.-</span>
          </div>
        </a>`).join("");const r=3,c=t.length%r;if(t.length&&c!==0)for(let e=0;e<r-c;e++)s+='<div class="dish-card phantom"></div>';o.innerHTML=t.length?`<div class="imaged-dishes-grid">${s}</div>`:"<p style='text-align:center;'>Aucun plat à afficher dans cette catégorie pour le moment.</p>"})():(i.textContent="Catégorie introuvable",o.innerHTML="<p style='text-align:center;'>Catégorie introuvable.</p>");
