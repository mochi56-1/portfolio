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
  original: {title:'静けさと、記憶に残るかたち。', kicker:'A PERSONAL UNIVERSE', status:'銀の花 — 光と静けさのポートフォリオ', color:'#080e17'},
  cyber: {title:'夢のつづきは、電子の中に。', kicker:'MEMORY://RECONNECT', status:'青い記憶 — かつて夢見た未来へ', color:'#030b24'},
  angel: {title:'失われた光も、美しい。', kicker:'AN ARCHIVE OF FALLEN LIGHT', status:'堕天使 — 静かな彫刻のギャラリー', color:'#101010'},
  higan: {title:'消えゆくものに、心をとめて。', kicker:'ON THE OTHER SIDE OF LIGHT', status:'電子の彼岸 — 月と花の余韻', color:'#071713'}
};
function selectDirection(name, updateURL = true) {
  if (!Object.hasOwn(directions, name)) name = 'original';
  const direction = directions[name];
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
    if(name === 'original') url.searchParams.delete('world'); else url.searchParams.set('world', name);
    history.pushState(null, '', url);
  }
}
selectDirection(new URL(location.href).searchParams.get('world'), false);
document.querySelectorAll('button[data-direction]').forEach(button=>button.addEventListener('click',()=> selectDirection(button.dataset.direction)));
addEventListener('popstate',()=> selectDirection(new URL(location.href).searchParams.get('world'),false));
