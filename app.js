document.documentElement.classList.add('js');
document.querySelector('#year').textContent = new Date().getFullYear();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduceMotion.matches;
const toggle = document.querySelector('#motion-toggle');
function syncMotion() {
  document.documentElement.classList.toggle('motion-off', paused);
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'アニメーションを再生' : 'アニメーションを停止');
  toggle.querySelector('span').textContent = paused ? 'OFF' : 'ON';
}
syncMotion();
toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
reduceMotion.addEventListener('change', event => {paused = event.matches; syncMotion();});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {entry.target.classList.add('visible');observer.unobserve(entry.target);}
}), {threshold: .12});
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
const hero = document.querySelector('.hero');
const art = document.querySelector('.hero-art');
hero.addEventListener('pointermove', event => {
  if (paused || event.pointerType !== 'mouse') return;
  hero.style.setProperty('--view-x', `${(event.clientX / innerWidth - .5) * 10}px`);
  hero.style.setProperty('--view-y', `${(event.clientY / innerHeight - .5) * 6}px`);
  art.style.setProperty('--px', `${(event.clientX / innerWidth - .5) * 10}px`);
  art.style.setProperty('--py', `${(event.clientY / innerHeight - .5) * 8}px`);
});
hero.addEventListener('pointerleave',()=>{art.style.setProperty('--px','0px');art.style.setProperty('--py','0px');});
const projects = [
  {title:'Moonflower', description:'月光に浮かぶ、銀の花。鏡面の冷たさと、花びらのやわらかな曲線を重ねたビジュアルスタディ。このポートフォリオのために制作したAI生成アートを用いて、静けさと儚さを表現しています。', style:'moon-art'},
  {title:'Silent Orbit', description:'静かな軌道を描く、光と金属。球体と細いリングをCSSで構成した、デジタルオブジェの造形スタディ。余白と陰影だけで、奥行きのある空間を探っています。', style:'orbit-art'}
];
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click',()=>{
  const project = projects[Number(button.dataset.project)];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  const preview = document.querySelector('#dialog-art');
  preview.className = `dialog-art ${project.style}`;
  preview.replaceChildren();
  if(project.style === 'orbit-art') {
    for (const name of ['orbit orbit-one','orbit orbit-two','orbit orbit-three','orb']) {const part = document.createElement('span');part.className=name;preview.append(part);}
  }
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

// Each direction is addressable so comparisons can be shared without changing the original.
const directions = {
  archive: {title:'海辺の記録。', kicker:'PHOTOGRAPH / PERSONAL STUDY', status:'海辺の記録 — 写真から始まるポートフォリオ', color:'#eeece5'},
  original: {title:'静けさと、記憶に残るかたち。', kicker:'A PERSONAL UNIVERSE', status:'銀の花 — 光と静けさのポートフォリオ', color:'#080e17'},
  cyber: {title:'夢のつづきは、電子の中に。', kicker:'MEMORY://RECONNECT', status:'青い記憶 — かつて夢見た未来へ', color:'#030b24'},
  angel: {title:'失われた光も、美しい。', kicker:'AN ARCHIVE OF FALLEN LIGHT', status:'堕天使 — 静かな彫刻のギャラリー', color:'#101010'},
  higan: {title:'消えゆくものに、心をとめて。', kicker:'ON THE OTHER SIDE OF LIGHT', status:'電子の彼岸 — 月と花の余韻', color:'#071713'}
};
function selectDirection(name, updateURL = true) {
  if (!Object.hasOwn(directions, name)) name = 'archive';
  const direction = directions[name];
  const archive = name === 'archive';
  projects[0] = archive
    ? {title:'海辺の記録', description:'提供された海辺の写真をもとに、AIによる加工で版画調のイラストへ。青緑の色調、広い空、オレンジの車を残し、写真と絵のあいだの質感を試した個人制作です。', style:'coastal-art'}
    : {title:'Moonflower', description:'月光に浮かぶ銀の花。このポートフォリオのためのAI生成アートによるビジュアルスタディです。', style:'moon-art'};
  const card = document.querySelector('[data-project="0"]');
  card.querySelector('.project-art').classList.toggle('coastal-art', archive);
  card.querySelector('.art-label').textContent = archive ? 'COASTAL RECORD / 001' : 'MOONFLOWER';
  card.querySelector('strong').textContent = projects[0].title;
  card.querySelector('small').textContent = archive ? 'PHOTOGRAPH → PRINT' : 'VISUAL EXPLORATION';
  document.querySelector('#work-title').innerHTML = archive ? '制作と、<br><em>記録。</em>' : 'Fragments<br><em>of creation.</em>';
  document.querySelector('#about-title').innerHTML = archive ? 'つくること。<br><em>残しておくこと。</em>' : 'A quiet mind.<br><em>A curious soul.</em>';
  document.querySelector('#contact-title').innerHTML = archive ? 'お問い合わせ。' : "Let's make<br><em>something matter.</em>";
  document.documentElement.dataset.direction = name;
  document.querySelector('#hero-title').textContent = direction.title;
  document.querySelector('#world-kicker').textContent = direction.kicker;
  document.querySelector('#direction-status').textContent = direction.status;
  document.querySelector('meta[name="theme-color"]').content = direction.color;
  document.querySelectorAll('[data-direction]').forEach(button => {
    if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.direction === name));
  });
  if(updateURL) {
    const url = new URL(location.href);
    if(name === 'archive') url.searchParams.delete('world'); else url.searchParams.set('world', name);
    history.pushState(null, '', url);
  }
}
selectDirection(new URL(location.href).searchParams.get('world'), false);
document.querySelectorAll('button[data-direction]').forEach(button=>button.addEventListener('click',()=> selectDirection(button.dataset.direction)));
addEventListener('popstate',()=> selectDirection(new URL(location.href).searchParams.get('world'),false));

const designToggle = document.querySelector('#design-toggle');
designToggle.addEventListener('click', () => {
  const collapsed = document.querySelector('.direction-picker').classList.toggle('collapsed');
  designToggle.setAttribute('aria-expanded', String(!collapsed));
  designToggle.querySelector('span').textContent = collapsed ? '＋' : '−';
});

// The plate and isolated silhouettes move at different depths, rather than tilting one image.
const depthToggle = document.querySelector('#depth-toggle');
let depthEnabled = true;
function syncDepth() {
  document.documentElement.classList.toggle('depth-enabled', depthEnabled);
  depthToggle.setAttribute('aria-pressed', String(depthEnabled));
  depthToggle.querySelector('span').textContent = depthEnabled ? '2.5D' : 'FLAT';
}
syncDepth();
depthToggle.addEventListener('click', () => {depthEnabled = !depthEnabled;syncDepth();});
const landscape = document.querySelector('#depth-landscape');
const narrowScene = matchMedia('(max-width:700px)');
function sizeScene(){landscape.setAttribute('viewBox',narrowScene.matches ? '850 0 650 941' : '0 0 1672 941');}
sizeScene();narrowScene.addEventListener('change', sizeScene);
let depthFrame = 0;
let pointerX = 0, pointerY = 0;
function updateDepth(){
  depthFrame = 0;
  if(paused || !depthEnabled) return;
  const rect = hero.getBoundingClientRect();
  if(rect.bottom <= 0 || rect.top >= innerHeight) return;
  const scroll = Math.max(-1,Math.min(1,-rect.top / rect.height));
  hero.style.setProperty('--depth-x', `${pointerX}px`);
  hero.style.setProperty('--depth-y', `${pointerY + scroll * 10}px`);
}
function requestDepth(){if(!depthFrame) depthFrame = requestAnimationFrame(updateDepth);}
hero.addEventListener('pointermove',event=>{
  if(event.pointerType !== 'mouse' || paused) return;
  const rect = hero.getBoundingClientRect();
  pointerX = ((event.clientX-rect.left)/rect.width-.5)*12;
  pointerY = ((event.clientY-rect.top)/rect.height-.5)*8;
  requestDepth();
});
hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;requestDepth();});
addEventListener('scroll',requestDepth,{passive:true});
