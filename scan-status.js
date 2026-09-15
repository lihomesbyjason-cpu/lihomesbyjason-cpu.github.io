(()=>{
  const STATUS={
    date:'2026-09-15',
    freshFsbo:597,
    multifamily:26,
    rentalStatus:'Incomplete — Zillow returned more matches than it would display in the current connector response.',
    note:'September 15 scan is partially verified. Fresh FSBO and multifamily counts are shown from the live Zillow search. Rental/tenant SFR and investor-pool totals are intentionally not posted until the full qualifying set can be retrieved, so the dashboard does not show misleading totals.'
  };
  function box(){
    return `<div class="notice" id="scanStatusNotice" style="margin-bottom:14px"><b>September 15 Scan Status</b><br>`+
      `Fresh FSBO reported by Zillow: <b>${STATUS.freshFsbo.toLocaleString()}</b> &nbsp;•&nbsp; `+
      `Multifamily reported: <b>${STATUS.multifamily.toLocaleString()}</b><br>`+
      `<span class="tiny">Rental / tenant SFR: ${STATUS.rentalStatus}</span><br>`+
      `<span class="tiny">${STATUS.note}</span></div>`;
  }
  function inject(){
    const root=document.querySelector('.page.active');
    if(!root || !['dashboard','history'].includes(root.id)) return;
    if(root.querySelector('#scanStatusNotice')) return;
    const top=root.querySelector('.top');
    if(top) top.insertAdjacentHTML('afterend',box());
    else root.insertAdjacentHTML('afterbegin',box());
  }
  function scheduleInject(){setTimeout(inject,0)}
  window.addEventListener('load',()=>setTimeout(inject,250));
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-page]')) setTimeout(inject,50);
  },true);
  const observer=new MutationObserver(scheduleInject);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
})();
