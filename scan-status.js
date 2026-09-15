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
    const page=window.state?.page;
    if(page!=='dashboard'&&page!=='history') return;
    const root=document.getElementById(page);
    if(!root||root.querySelector('#scanStatusNotice')) return;
    const top=root.querySelector('.top');
    if(top) top.insertAdjacentHTML('afterend',box());
    else root.insertAdjacentHTML('afterbegin',box());
  }
  try{
    if(typeof render==='function'){
      const originalRender=render;
      render=function(){originalRender();queueMicrotask(inject)};
    }
  }catch(e){console.warn('scan status hook',e)}
  window.addEventListener('load',()=>setTimeout(inject,250));
  const observer=new MutationObserver(()=>inject());
  observer.observe(document.documentElement,{subtree:true,childList:true});
})();
