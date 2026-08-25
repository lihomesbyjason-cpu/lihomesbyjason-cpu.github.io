(()=>{
const STATUS_PAGES={called:['Called','Leads you have called'],working:['Working','Active opportunities you are working'],converted:['Converted','Leads converted into active business'],dead:['Dead','Leads marked dead']};
const navInsert=NAV.findIndex(([id])=>id==='activity');
if(navInsert>=0&&!NAV.some(([id])=>id==='called')) NAV.splice(navInsert,0,['called','Called'],['working','Working'],['converted','Converted'],['dead','Dead']);

const baseShow=show;
show=function(id){if(STATUS_PAGES[id])state.filters.d='';baseShow(id)};
const baseRender=render;
render=function(){
  if(!state.data)return;
  if(STATUS_PAGES[state.page]){
    const [title,sub]=STATUS_PAGES[state.page];
    const list=state.data.leads.filter(x=>x.disposition===state.page);
    const root=$('#'+state.page);
    root.innerHTML=listPage(title,sub,list);
    wirePage(root);
    return;
  }
  baseRender();
};
const baseWirePage=wirePage;
wirePage=function(root){
  baseWirePage(root);
  root.querySelectorAll('[data-card]').forEach(c=>{
    const v=c.dataset.card;
    if(STATUS_PAGES[v])c.onclick=()=>show(v);
  });
};
nav();

const F=(id,label,type='text',options=[])=>({id,label,type,options});
const BORROWER_FIELDS=[
  F('full_legal_name','Full legal name'),F('citizenship_residency_status','Citizenship/residency status','select',['','U.S. Citizen','Permanent Resident','Non-Permanent Resident','Foreign National','Other']),F('marital_status','Marital status','select',['','Single','Married','Separated','Divorced','Widowed']),F('phone','Phone','tel'),F('email','Email','email'),F('current_home_address','Current home address'),F('credit_score_estimate','Credit-score estimate','number')
];
const SECTIONS=[
 {id:'loan_request',title:'1. Loan Request',open:true,fields:[
  F('loan_purpose','Purchase, rate-and-term refinance, or cash-out refinance','select',['','Purchase','Rate-and-Term Refinance','Cash-Out Refinance']),
  F('occupancy_type','Primary residence, second home, or investment property','select',['','Primary Residence','Second Home','Investment Property']),
  F('desired_loan_amount','Desired loan amount','number'),F('purchase_price_estimated_value','Purchase price or estimated property value','number'),F('down_payment','Down payment','number'),F('cash_out_amount_purpose','Cash-out amount and purpose','textarea'),F('desired_rate_type_term','Desired rate type and loan term'),F('target_closing_date','Target closing date','date'),F('listing_status','Is the property currently listed for sale or recently removed?','select',['','No','Currently Listed','Recently Removed','Unknown'])
 ]},
 {id:'subject_property',title:'3. Subject Property',fields:[
  F('complete_property_address','Complete property address'),F('county_state','County and state'),F('property_type','Property type'),F('number_of_units','Number of units','number'),F('year_built','Year built','number'),F('square_footage','Square footage','number'),F('purchase_price_estimated_value','Purchase price or estimated value','number'),F('current_occupancy','Current occupancy'),F('intended_occupancy','Intended occupancy'),F('annual_property_taxes','Annual property taxes','number'),F('homeowners_insurance','Homeowners insurance','number'),F('flood_insurance','Flood insurance','number'),F('hoa_dues','HOA dues','number'),F('special_assessments','Special assessments','number'),F('property_condition','Property condition'),F('required_repairs_renovations','Required repairs or renovations','textarea'),F('mixed_use_commercial_space','Mixed-use or commercial space','select',['','No','Yes','Unknown']),F('warrantability','Is it warrantable, non-warrantable, or unknown?','select',['','Warrantable','Non-Warrantable','Unknown'])
 ]},
 {id:'transaction_purchase',title:'4A. Transaction Details — Purchase',fields:[
  F('contract_date','Contract date','date'),F('closing_date','Closing date','date'),F('earnest_money_deposit','Earnest-money deposit','number'),F('seller_concessions','Seller concessions','number'),F('real_estate_agents','Real estate agents'),F('attorney_title_company','Attorney or title company'),F('gift_funds','Gift funds','number'),F('source_down_payment_closing_costs','Source of down payment and closing costs','textarea')
 ]},
 {id:'transaction_refinance',title:'4B. Transaction Details — Refinance',fields:[
  F('original_purchase_date','Original purchase date','date'),F('original_purchase_price','Original purchase price','number'),F('current_mortgage_balance','Current mortgage balance','number'),F('existing_interest_rate','Existing interest rate'),F('existing_monthly_payment','Existing monthly payment','number'),F('current_lender','Current lender'),F('second_mortgages_helocs','Second mortgages or HELOCs','textarea'),F('requested_cash_out','Requested cash-out','number'),F('cash_out_purpose','Cash-out purpose','textarea'),F('length_of_ownership','Length of ownership'),F('recent_listing_history','Recent listing history','textarea')
 ]},
 {id:'employment_business',title:'5. Employment and Business Information',fields:[
  F('employment_status','Employment status','select',['','Employed','Self-Employed','Retired','Unemployed','Other']),F('employer_name_address_phone','Employer name, address, and phone','textarea'),F('job_title','Job title'),F('years_in_profession','Years in profession','number'),F('base_monthly_income','Base monthly income','number'),F('overtime_bonus_commission','Overtime, bonus, and commission','number'),F('previous_employer','Previous employer, if needed'),F('self_employed_business_name','Self-employed business name'),F('ownership_percentage','Ownership percentage'),F('business_type','Business type'),F('business_start_date','Business start date','date'),F('business_income','Business income','number'),F('two_year_employment_history','Two-year employment history','textarea')
 ]},
 {id:'other_income',title:'6. Other Income',fields:[
  F('rental_income','Rental income','number'),F('social_security','Social Security','number'),F('pension_retirement','Pension or retirement','number'),F('disability','Disability','number'),F('alimony_child_support','Alimony or child support, when the borrower chooses to use it','number'),F('interest_dividend_income','Interest and dividend income','number'),F('trust_income','Trust income','number'),F('va_benefits','VA benefits','number'),F('other_recurring_income','Other recurring income','number')
 ]},
 {id:'assets',title:'7. Assets and Funds to Close',fields:[
  F('checking_accounts','Checking accounts','number'),F('savings_accounts','Savings accounts','number'),F('money_market_accounts','Money-market accounts','number'),F('earnest_money_deposit','Earnest-money deposit','number'),F('other_assets','Other assets','number'),F('total_available_funds','Total available funds','number'),F('required_reserves','Required reserves','number')
 ]},
 {id:'investment_dscr',title:'8. Investment / DSCR Property Details',note:'Use this section for investment loans.',fields:[
  F('rental_term','Long-term, short-term, or mid-term rental','select',['','Long-Term','Short-Term','Mid-Term']),F('current_monthly_rent','Current monthly rent','number'),F('market_rent','Market rent','number'),F('lease_start_date','Lease start date','date'),F('lease_expiration_date','Lease expiration date','date'),F('security_deposit','Security deposit','number'),F('current_occupancy_status','Current occupancy status'),F('tenants_units_occupied','Number of tenants or units occupied','number'),F('annual_gross_rental_income','Annual gross rental income','number'),F('operating_expenses','Operating expenses','number'),F('property_management_fee','Property-management fee','number'),F('utilities_paid_by_owner','Utilities paid by owner','number'),F('repairs_maintenance','Repairs and maintenance','number'),F('current_projected_dscr','Current or projected DSCR'),F('current_rent_roll','Current rent roll','textarea'),F('existing_leases','Existing leases','textarea'),F('short_term_rental_history','Short-term rental history','textarea'),F('airbnb_vrbo_statements','Airbnb/VRBO statements, if applicable','textarea'),F('investor_experience','Investor experience','textarea'),F('number_properties_owned','Number of properties owned','number'),F('investment_transactions_completed','Number of investment transactions completed','number'),F('exit_strategy','Exit strategy','textarea'),F('prepayment_penalty_preference','Prepayment-penalty preference'),F('interest_only_request','Interest-only request','select',['','No','Yes','Flexible']),F('title_holding','Whether title will be held personally or in an entity','select',['','Personally','Entity','Undecided'])
 ]}
];
const DOCS=[
 {id:'documents_primary',title:'9A. Documents Checklist — Primary / Full Documentation',fields:[
  F('government_id','Government-issued identification','checkbox'),F('w2_1099_two_years','Two years of W-2s or 1099s','checkbox'),F('recent_pay_stubs','Recent pay stubs','checkbox'),F('tax_returns_two_years','Two years of tax returns, when required','checkbox'),F('asset_statements_two_months','Two months of asset statements','checkbox'),F('current_mortgage_statement','Current mortgage statement','checkbox'),F('homeowners_insurance_info','Homeowners-insurance information','checkbox'),F('purchase_contract','Purchase contract','checkbox'),F('gift_letter_donor_docs','Gift letter and donor documentation, if applicable','checkbox'),F('divorce_support_docs','Divorce decree or support documentation, if applicable','checkbox')
 ]},
 {id:'documents_dscr',title:'9B. Documents Checklist — Investment / DSCR',fields:[
  F('government_id','Government-issued identification','checkbox'),F('entity_documents','Entity documents','checkbox'),F('purchase_contract_mortgage_statement','Purchase contract or mortgage statement','checkbox'),F('asset_statements_two_months','Two months of asset statements','checkbox'),F('current_lease_rent_roll','Current lease and rent roll','checkbox'),F('short_term_rental_statements','Short-term rental statements','checkbox'),F('property_insurance','Property insurance','checkbox'),F('property_management_agreement','Property-management agreement','checkbox'),F('tax_bill','Tax bill','checkbox'),F('hoa_statement','HOA statement','checkbox'),F('existing_payoff_information','Existing payoff information','checkbox'),F('renovation_budget','Renovation budget, if applicable','checkbox'),F('investor_experience_schedule','Investor-experience schedule','checkbox')
 ]}
];

function blankData(){return {version:1,answers:{},borrowers:[{}],updated_at:null}}
function clone(v){try{return JSON.parse(JSON.stringify(v||{}))}catch{return {}}}
function normalizeData(lead){
  const d=clone(lead?.application_data);
  if(!d||typeof d!=='object'||Array.isArray(d))return blankData();
  d.version=1;d.answers=d.answers&&typeof d.answers==='object'?d.answers:{};
  d.borrowers=Array.isArray(d.borrowers)&&d.borrowers.length?d.borrowers:[{}];
  const s=d.answers.subject_property||(d.answers.subject_property={});
  if(!s.complete_property_address)s.complete_property_address=lead.address||'';
  if(!s.county_state)s.county_state=lead.state||'';
  if(!s.property_type)s.property_type=lead.property_type||'';
  if(!s.square_footage&&lead.sqft)s.square_footage=lead.sqft;
  if(!s.purchase_price_estimated_value&&lead.price)s.purchase_price_estimated_value=lead.price;
  const lr=d.answers.loan_request||(d.answers.loan_request={});
  if(!lr.purchase_price_estimated_value&&lead.price)lr.purchase_price_estimated_value=lead.price;
  return d;
}
function getAnswer(data,section,field){return data?.answers?.[section]?.[field]??''}
function fieldHtml(section,f,value){
  const attr=`data-intake-section="${section}" data-intake-field="${f.id}"`;
  if(f.type==='textarea')return `<label class="intakeField intakeWide"><span>${esc(f.label)}</span><textarea ${attr}>${esc(value)}</textarea></label>`;
  if(f.type==='select')return `<label class="intakeField"><span>${esc(f.label)}</span><select ${attr}>${f.options.map(o=>`<option value="${esc(o)}" ${String(value)===String(o)?'selected':''}>${esc(o||'Select…')}</option>`).join('')}</select></label>`;
  if(f.type==='checkbox')return `<label class="checkRow"><input type="checkbox" ${attr} ${value?'checked':''}><span>${esc(f.label)}</span></label>`;
  return `<label class="intakeField"><span>${esc(f.label)}</span><input type="${f.type}" ${attr} value="${esc(value)}"></label>`;
}
function answeredSection(data,s){const a=data.answers?.[s.id]||{};return s.fields.filter(f=>f.type==='checkbox'?a[f.id]===true:String(a[f.id]??'').trim()!=='').length}
function sectionHtml(data,s){
  const count=answeredSection(data,s);
  return `<details class="intakeSection" ${s.open?'open':''}><summary><b>${esc(s.title)}</b><span>${count}/${s.fields.length} answered</span></summary>${s.note?`<div class="sectionNote">${esc(s.note)}</div>`:''}<div class="intakeGrid">${s.fields.map(f=>fieldHtml(s.id,f,getAnswer(data,s.id,f.id))).join('')}</div></details>`
}
function borrowersHtml(data){return `<details class="intakeSection" open><summary><b>2. Borrower Information</b><span>${data.borrowers.length} borrower${data.borrowers.length===1?'':'s'}</span></summary><div class="sectionNote">Collect separately for each borrower.</div><div id="borrowerList">${data.borrowers.map((b,i)=>borrowerCard(b,i,data.borrowers.length)).join('')}</div><button type="button" class="btn intakeAdd" id="addBorrower">+ Add Borrower</button></details>`}
function borrowerCard(b,i,total){return `<div class="borrowerCard" data-borrower-index="${i}"><div class="borrowerHead"><b>Borrower ${i+1}</b>${total>1?`<button type="button" class="btn borrowerRemove" data-remove-borrower="${i}">Remove</button>`:''}</div><div class="intakeGrid">${BORROWER_FIELDS.map(f=>{
 const value=b?.[f.id]??''; const attr=`data-borrower-field="${f.id}"`;
 if(f.type==='select')return `<label class="intakeField"><span>${esc(f.label)}</span><select ${attr}>${f.options.map(o=>`<option value="${esc(o)}" ${String(value)===String(o)?'selected':''}>${esc(o||'Select…')}</option>`).join('')}</select></label>`;
 return `<label class="intakeField"><span>${esc(f.label)}</span><input type="${f.type}" ${attr} value="${esc(value)}"></label>`;
}).join('')}</div></div>`}
function completion(data){let total=0,done=0;SECTIONS.concat(DOCS).forEach(s=>{total+=s.fields.length;done+=answeredSection(data,s)});total+=data.borrowers.length*BORROWER_FIELDS.length;data.borrowers.forEach(b=>BORROWER_FIELDS.forEach(f=>{if(String(b?.[f.id]??'').trim())done++}));return {done,total,pct:total?Math.round(done/total*100):0}}
function renderIntake(lead){
  const d=normalizeData(lead);state.intakeDraft=d;const c=completion(d);
  const n=$('#loanIntake');if(!n)return;
  n.innerHTML=`<div class="intakeTop"><div><h3>Loan Application Intake</h3><div class="tiny">All answers save to this property record and persist across browsers.</div></div><div class="intakeProgress"><b>${c.pct}%</b><span>${c.done} of ${c.total} answered</span></div></div><div class="progressTrack"><i style="width:${c.pct}%"></i></div>${sectionHtml(d,SECTIONS[0])}${borrowersHtml(d)}${SECTIONS.slice(1).map(s=>sectionHtml(d,s)).join('')}${DOCS.map(s=>sectionHtml(d,s)).join('')}<div class="intakeActions"><button type="button" class="btn primary" id="saveIntake">Save Loan Intake</button><span class="tiny" id="intakeSaved">${d.updated_at?'Last saved '+time(d.updated_at):'Not saved yet'}</span></div>`;
  wireIntake(n);
}
function collectIntake(){
  const d=clone(state.intakeDraft||blankData());d.answers=d.answers||{};
  document.querySelectorAll('#loanIntake [data-intake-section]').forEach(el=>{const s=el.dataset.intakeSection,k=el.dataset.intakeField;d.answers[s]=d.answers[s]||{};d.answers[s][k]=el.type==='checkbox'?el.checked:el.value});
  d.borrowers=[...document.querySelectorAll('#loanIntake .borrowerCard')].map(card=>{const b={};card.querySelectorAll('[data-borrower-field]').forEach(el=>b[el.dataset.borrowerField]=el.value);return b});
  d.updated_at=new Date().toISOString();return d;
}
function wireIntake(root){
  root.addEventListener('input',()=>state.dirty=true);
  root.addEventListener('change',()=>state.dirty=true);
  const add=root.querySelector('#addBorrower');if(add)add.onclick=()=>{const d=collectIntake();d.borrowers.push({});state.intakeDraft=d;renderIntake({...state.data.leads.find(x=>x.lead_key===state.selected),application_data:d});state.dirty=true};
  root.querySelectorAll('[data-remove-borrower]').forEach(b=>b.onclick=()=>{const d=collectIntake();d.borrowers.splice(Number(b.dataset.removeBorrower),1);if(!d.borrowers.length)d.borrowers=[{}];state.intakeDraft=d;renderIntake({...state.data.leads.find(x=>x.lead_key===state.selected),application_data:d});state.dirty=true});
  const save=root.querySelector('#saveIntake');if(save)save.onclick=saveIntakeOnly;
}
async function saveIntakeOnly(){const k=state.selected;if(!k)return;const b=$('#saveIntake');if(b){b.disabled=true;b.textContent='Saving…'}try{const data=collectIntake();await api('intake',{fetch:{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({lead_key:k,application_data:data})}});toast('Loan intake saved to cloud');state.dirty=false;await load(true);const x=state.data.leads.find(v=>v.lead_key===k);if(x)renderIntake(x)}catch(e){toast('Intake save failed: '+e.message)}finally{const x=$('#saveIntake');if(x){x.disabled=false;x.textContent='Save Loan Intake'}}}

const baseOpenLead=openLead;
openLead=async function(k){await baseOpenLead(k);const x=state.data?.leads?.find(v=>v.lead_key===k);if(x)renderIntake(x)};

async function saveAll(){
  const k=state.selected;if(!k)return;const b=$('#mSave');b.disabled=true;b.textContent='Saving…';
  try{
    const intake=collectIntake();
    await Promise.all([
      saveCRM(k,$('#mStatus').value,$('#mNotes').value),
      api('intake',{fetch:{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({lead_key:k,application_data:intake})}})
    ]);
    toast('Property record saved to cloud');state.dirty=false;await load(true);$('#leadModal').close();
  }catch(e){toast('Save failed: '+e.message)}finally{b.disabled=false;b.textContent='Save Changes'}
}
$('#mSave').onclick=saveAll;
})();