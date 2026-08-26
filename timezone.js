(()=>{
  const ZONES=[
    {
      id:'eastern', label:'Eastern', short:'ET', timeZone:'America/New_York',
      states:['Connecticut','Delaware','District of Columbia','Georgia','Maine','Maryland','Massachusetts','New Hampshire','New Jersey','New York','North Carolina','Ohio','Pennsylvania','Rhode Island','South Carolina','Vermont','Virginia','West Virginia'],
      partial:'Most of Florida, Indiana, Kentucky, Michigan, and Tennessee'
    },
    {
      id:'central', label:'Central', short:'CT', timeZone:'America/Chicago',
      states:['Alabama','Arkansas','Illinois','Iowa','Louisiana','Minnesota','Mississippi','Missouri','Oklahoma','Wisconsin'],
      partial:'Most of Kansas, Nebraska, North Dakota, South Dakota, and Texas; portions of Florida, Indiana, Kentucky, Michigan, and Tennessee'
    },
    {
      id:'mountain', label:'Mountain', short:'MT', timeZone:'America/Denver',
      states:['Colorado','Montana','New Mexico','Utah','Wyoming'],
      partial:'Most of Arizona and portions of Idaho, Kansas, Nebraska, North Dakota, Oregon, South Dakota, and Texas',
      note:'Most of Arizona does not observe daylight saving time, so its clock can differ from the Mountain clock shown here during part of the year.'
    },
    {
      id:'pacific', label:'Pacific', short:'PT', timeZone:'America/Los_Angeles',
      states:['California','Nevada','Washington'],
      partial:'Most of Oregon and the northern portion of Idaho'
    }
  ];

  const fmt=(timeZone,options)=>new Intl.DateTimeFormat('en-US',{timeZone,...options});
  const byId=id=>ZONES.find(zone=>zone.id===id);

  function markup(){
    return `<section class="tzPanel" aria-label="Current United States time zones">
      <div class="tzIntro"><div><span class="tzEyebrow">CALLING CLOCK</span><b>Best time to reach FSBO owners</b></div><span>Click a time zone to view its states</span></div>
      <div class="tzGrid">${ZONES.map(zone=>`<button type="button" class="tzCard" data-time-zone="${zone.id}" aria-haspopup="dialog"><span class="tzName">${zone.label}</span><strong id="tz-${zone.id}">--:--</strong><span class="tzDate" id="tz-date-${zone.id}">Loading...</span></button>`).join('')}</div>
    </section>`;
  }

  function dialogMarkup(){
    return `<dialog class="tzDialog" id="tzDialog" aria-labelledby="tzDialogTitle"><div class="tzDialogHead"><div><span class="tzEyebrow">TIME-ZONE COVERAGE</span><h2 id="tzDialogTitle"></h2></div><button type="button" class="tzClose" aria-label="Close time-zone states">Close</button></div><div class="tzDialogBody"><div class="tzStateGrid" id="tzStateGrid"></div><div class="tzPartial" id="tzPartial"></div><div class="tzNote" id="tzNote"></div></div></dialog>`;
  }

  function update(){
    const now=new Date();
    ZONES.forEach(zone=>{
      const clock=document.querySelector(`#tz-${zone.id}`);
      const date=document.querySelector(`#tz-date-${zone.id}`);
      if(clock) clock.textContent=fmt(zone.timeZone,{hour:'numeric',minute:'2-digit',second:'2-digit'}).format(now)+' '+zone.short;
      if(date) date.textContent=fmt(zone.timeZone,{weekday:'short',month:'short',day:'numeric'}).format(now);
    });
  }

  function openZone(id){
    const zone=byId(id),dialog=document.querySelector('#tzDialog');
    if(!zone||!dialog)return;
    dialog.querySelector('#tzDialogTitle').textContent=zone.label+' Time ('+zone.short+')';
    dialog.querySelector('#tzStateGrid').innerHTML=zone.states.map(state=>`<span>${state}</span>`).join('');
    dialog.querySelector('#tzPartial').innerHTML=`<b>Also included:</b> ${zone.partial}.`;
    const note=dialog.querySelector('#tzNote');
    note.textContent=zone.note||'Some state boundaries cross time zones; use the property city or ZIP when scheduling a precise call.';
    dialog.showModal();
  }

  function install(){
    const main=document.querySelector('main.main');
    if(!main||document.querySelector('.tzPanel'))return;
    main.insertAdjacentHTML('afterbegin',markup());
    document.body.insertAdjacentHTML('beforeend',dialogMarkup());
    document.querySelectorAll('[data-time-zone]').forEach(button=>button.addEventListener('click',()=>openZone(button.dataset.timeZone)));
    const dialog=document.querySelector('#tzDialog');
    dialog.querySelector('.tzClose').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
    update();
    setInterval(update,1000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
