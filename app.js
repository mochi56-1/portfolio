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
