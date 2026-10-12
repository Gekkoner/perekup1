/* Shared item inspection views. The location remains the live scene. */
window.FlipInspection=(()=>{

  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function profile(i){
    const t=i.title.toLowerCase();
    if(i.category==='Обувь')return {kind:'shoe',checks:{label:'Проверить бирку',wear:'Проверить швы',function:'Осмотреть подошву'},points:{label:[49,31],wear:[66,59],function:[50,65]}};
    if(i.category==='Одежда')return {kind:'clothes',checks:{label:'Проверить бирку',wear:'Проверить швы',function:'Осмотреть ткань'},points:{label:[50,23],wear:[67,55],function:[48,55]}};
    if(i.category==='Сумки')return {kind:'bag',checks:{label:'Проверить маркировку',wear:'Проверить швы',function:'Проверить застёжку'},points:{label:[50,48],wear:[72,60],function:[51,30]}};
    if(i.category==='Электроника')return {kind:'audio',checks:{label:'Проверить маркировку',wear:'Осмотреть корпус',function:'Проверить звук'},points:{label:[48,58],wear:[64,44],function:[58,42]}};
    if(/час/.test(t))return {kind:'watch',checks:{label:'Проверить маркировку',wear:'Осмотреть стекло',function:'Проверить механизм'},points:{label:[50,48],wear:[50,45],function:[57,47]}};
    if(/очк/.test(t))return {kind:'glasses',checks:{label:'Проверить дужку',wear:'Осмотреть линзы',function:'Проверить крепления'},points:{label:[70,35],wear:[43,49],function:[73,44]}};
    if(/ремень/.test(t))return {kind:'belt',checks:{label:'Проверить маркировку',wear:'Осмотреть края',function:'Проверить пряжку'},points:{label:[49,48],wear:[68,56],function:[42,42]}};
    return {kind:'accessory',checks:{label:'Проверить бирку',wear:'Осмотреть материал',function:'Проверить целостность'},points:{label:[50,52],wear:[60,56],function:[47,49]}};
  }
  function markup(i,check,problem){
    const p=profile(i),point=check==='label'?(labelPoints[i.imageIndex]||p.points.label):(p.points[check]||[50,45]);
    const k=i.imageIndex%25,view=check||'label',src=`assets/inspect-${Math.floor(i.imageIndex/25)}-${view}.webp`;
    return `<div class="held-inspection ${p.kind}" data-check="${view}">
      <div class="held-sprite" role="img" aria-label="${esc(i.title)} в руках: ${esc(p.checks[view])}" data-atlas="${src}" style="background-image:url('${src}');background-position:${k%5*25}% ${Math.floor(k/5)*25}%"></div>
      ${check&&problem?`<span class="inspection-point bad" style="left:${point[0]}%;top:${point[1]}%" aria-hidden="true"></span>
      <div class="inspection-callout bad" role="status">${esc(problem)}</div>
      <svg class="inspection-line bad" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M ${point[0]} ${point[1]} L 65 15 L 72 15"/></svg>`:''}
      <div class="inspection-item-name">${esc(i.title)}</div>
    </div>`;
  }
  // Label anchors follow the individual art, not a single screen coordinate.
  const labelPoints=[
    [52,40],[50,40],[50,39],[34,38],[50,43], [34,32],[35,40],[52,23],[50,38],[51,39], [49,26],[49,26],[51,32],[51,30],[51,23], [35,33],[52,41],[49,48],[50,33],[50,33], [34,31],[50,33],[50,24],[50,31],[50,42],
    [52,45],[50,31],[50,30],[35,40],[50,42], [50,30],[50,41],[35,36],[50,26],[50,23], [50,29],[50,17],[50,67],[50,27],[50,40], [50,31],[50,29],[50,16],[34,35],[50,18], [50,39],[50,25],[50,18],[50,26],[35,35],
    [50,37],[50,42],[35,43],[50,30],[50,38], [50,28],[50,51],[56,39],[50,27],[50,27], [64,40],[35,33],[50,45],[50,35],[63,63], [35,40],[54,65],[50,31],[51,53],[34,37], [50,20],[50,21],[51,40],[33,40],[50,31],
    [55,53],[35,33],[52,39],[35,35],[52,38], [50,48],[33,37],[50,37],[50,17],[50,32], [50,36],[34,28],[50,43],[33,33],[50,42], [50,54],[50,26],[50,36],[50,25],[50,24], [50,31],[50,36],[50,41],[50,42],[50,34]
  ];
  function mount(root,i){
    const sprite=root.querySelector('.held-sprite');if(!sprite)return;
    const image=new Image();image.onerror=()=>{if(sprite.isConnected){sprite.classList.add('load-failed');sprite.textContent='Не удалось загрузить ракурс. Нажми другую проверку или вернись к продавцу.'}};
    image.src=sprite.dataset.atlas;
    for(const key of ['label','wear','function']){const preload=new Image();preload.src=`assets/inspect-${Math.floor(i.imageIndex/25)}-${key}.webp`}
  }

  return {profile,markup,mount};
})();
