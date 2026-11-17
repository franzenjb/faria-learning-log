(function(){if(window.PRESENTER)return;
const f=document.createElement('iframe');f.id='claude-frame';f.title='Interactive class slide';f.src='claude/index.html';document.body.appendChild(f);
const arrows=document.createElement('div');arrows.id='class-arrows';arrows.innerHTML='<button title="Previous">‹</button><button title="Next">›</button><button title="Presenter notes (P)">P</button>';
document.body.appendChild(arrows);arrows.children[0].onclick=()=>World.prev();arrows.children[1].onclick=()=>World.next();arrows.children[2].onclick=()=>dispatchEvent(new KeyboardEvent('keydown',{key:'p'}));
let pending=null,ready=false;
window.ClassBridge={bypass:false,show(b){const on=b.claude!=null;f.classList.toggle('active',on);if(on){pending=b.claude;if(ready){f.contentWindow.postMessage({type:'to-claude-set',i:pending},'*');setTimeout(()=>f.contentWindow.focus(),80);}}else{if(document.activeElement===f)f.blur();window.focus();}},key(key){if(ready)f.contentWindow.postMessage({type:'to-claude-key',key},'*');}};
f.onload=()=>{ready=true;if(pending!=null&&World.beats[World.k]?.claude!=null){f.contentWindow.postMessage({type:'to-claude-set',i:pending},'*');f.contentWindow.focus();}};
addEventListener('message',e=>{if(e.source!==f.contentWindow)return;const m=e.data||{};if(m.type==='class-nav'){ClassBridge.bypass=true;if(m.dir>0)World.next();else World.prev();ClassBridge.bypass=false;}else if(m.type==='class-key')dispatchEvent(new KeyboardEvent('keydown',{key:m.key}));});
})();