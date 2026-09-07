(()=>{
  const MARK='\n[[FSBO_INTAKE_V1]]';
  function clone(v){try{return JSON.parse(JSON.stringify(v||{}))}catch{return {}}}
  function collectIntakeSafe(){
    const d=clone(state.intakeDraft||{version:1,answers:{},borrowers:[{}],updated_at:null});
    d.version=1;d.answers=d.answers&&typeof d.answers==='object'?d.answers:{};
    document.querySelectorAll('#loanIntake [data-intake-section]').forEach(el=>{
      const s=el.dataset.intakeSection,k=el.dataset.intakeField;if(!s||!k)return;
      d.answers[s]=d.answers[s]||{};d.answers[s][k]=el.type==='checkbox'?el.checked:el.value;
    });
    d.borrowers=[...document.querySelectorAll('#loanIntake .borrowerCard')].map(card=>{const b={};card.querySelectorAll('[data-borrower-field]').forEach(el=>{b[el.dataset.borrowerField]=el.value});return b});
    if(!d.borrowers.length)d.borrowers=[{}];
    d.updated_at=new Date().toISOString();
    return d;
  }
  function notesWithIntake(notes,data){return String(notes||'')+MARK+JSON.stringify(data)}
  async function persistIntake({closeModal=false}={}){
    const k=state.selected;if(!k)return;
    const lead=state.data?.leads?.find(v=>v.lead_key===k);if(!lead)return;
    const data=collectIntakeSafe();
    const status=$('#mStatus')?.value ?? lead.disposition ?? '';
    const visibleNotes=$('#mNotes')?.value ?? lead.notes ?? '';
    await saveCRM(k,status,notesWithIntake(visibleNotes,data));
    state.intakeDraft=data;state.dirty=false;await load(true);
    const refreshed=state.data?.leads?.find(v=>v.lead_key===k);
    if(refreshed&&typeof renderIntake==='function')renderIntake(refreshed);
    if(closeModal&&$('#leadModal')?.open)$('#leadModal').close();
  }
  document.addEventListener('click',async e=>{
    const btn=e.target.closest?.('#saveIntake,#mSave');if(!btn)return;
    e.preventDefault();e.stopImmediatePropagation();if(btn.disabled)return;
    const original=btn.textContent;btn.disabled=true;btn.textContent='Saving…';
    try{await persistIntake({closeModal:btn.id==='mSave'});toast(btn.id==='mSave'?'Property record saved to cloud':'Loan intake saved to cloud')}
    catch(err){console.error('INTAKE_PERSIST_FIX',err);toast('Save failed: '+(err?.message||'Unknown error'))}
    finally{btn.disabled=false;btn.textContent=original}
  },true);
})();
