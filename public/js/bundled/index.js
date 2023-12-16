let e;const t=function(){let e=document.querySelector(".alert");e&&e.parentElement?.removeChild(e)},o=function(o,n){e&&clearTimeout(e),t();let a=`<div class="alert alert--${o}">${n}</div>`;document.querySelector("body")?.insertAdjacentHTML("afterbegin",a),e=setTimeout(()=>{t()},1500)},n=async function(e,...t){try{return o("success","Please wait..."),await e(...t)}catch(e){o("error",e.message)}},a=async function(e,t){let n=JSON.stringify({email:e||"",password:t||""}),a=await fetch(`${window.location.origin}/api/v1/users/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:n}),i=await a.json();if(i.error)throw i;o("success","Logged in successfully"),setTimeout(()=>{window.location.href=window.location.origin},1500)},i=async function(e){let t=await fetch(`${window.location.origin}/api/v1/users/updateMyInfo`,{method:"PATCH",body:e}),n=await t.json();if("success"!==n.status)throw n;o("success","Updated Data Successfully"),setTimeout(()=>{window.location.href=`${window.location.origin}/me`},1500)},s=async function(e){let t=JSON.stringify(e),n=await fetch(`${window.location.origin}/api/v1/users/updatePassword`,{headers:{"Content-Type":"application/json"},method:"PATCH",body:t}),a=await n.json();if("success"!==a.status)throw a;o("success","Updated Data Successfully")},r=async function(e){let t=await fetch(`${window.location.origin}/api/v1/bookings/checkout-session/${e}`,{method:"GET",headers:{"Content-Type":"application/json"}}),o=await t.json();window.location.href=o.session.url},c=document.querySelector(".error__title"),l=Number(c?.dataset?.status),d=document.querySelector(".form--login"),u=document?.getElementById("map")?.dataset.locations||"",p=u?JSON.parse(u):null,m=document?.getElementById("book-tour");if(m){let e=m.dataset.tourId;m.addEventListener("click",t=>{t.preventDefault(),n(r,e)})}if(d){let e=document.getElementById("password"),t=document.getElementById("email");d?.addEventListener("submit",o=>{o.preventDefault(),n(a,t.value,e.value)})}p&&function(e){let t=L.icon({iconUrl:"../img/pin.png",iconSize:[20,25],iconAnchor:[10,25],popupAnchor:[0,-25]}),o=L.map("map",{center:[34.111745,-118.113491],zoomControl:!1,dragging:!1});L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",{attribution:'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',ext:"png"}).addTo(o);let n=e.map(e=>{let n=[e.coordinates[1],e.coordinates[0]];return L.marker(n,{icon:t}).addTo(o).bindPopup(`<p>Day ${e.day}: ${e.description}</p>`,{autoClose:!1}).openPopup(),n}),a=L.latLngBounds(n).pad(.2);o.fitBounds(a),o.scrollWheelZoom.disable()}(p),l&&401===l&&(o("error","Redirecting to login page..."),setTimeout(()=>{window.location.href=`${window.location.origin}/login`},3e3));const w=document.querySelector(".form-user-data");if(w){let e=document.getElementById("email"),t=document.getElementById("name"),o=document.getElementById("photo");o&&o.addEventListener("change",function(e){let t=document.querySelector(".form__user-photo");this?.files?.length&&(t.src=URL.createObjectURL(this.files[0]),t.onload=function(){URL.revokeObjectURL(t.src)})}),w.addEventListener("submit",a=>{a.preventDefault();let s=new FormData;s.append("name",t.value),s.append("email",e.value),o?.files&&o.files[0]&&s.append("photo",o.files[0]),n(i,s)})}const f=document.querySelector(".form-user-settings");if(f){let e=document.getElementById("password-current"),t=document.getElementById("password"),o=document.getElementById("password-confirm");f.addEventListener("submit",async a=>{a.preventDefault(),await n(s,{currentPassword:e?.value||"",password:t?.value||"",passwordConfirm:o?.value||""}),e.value="",t.value="",o.value=""})}
//# sourceMappingURL=index.js.map
