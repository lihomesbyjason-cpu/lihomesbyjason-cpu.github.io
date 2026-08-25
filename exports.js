(()=>{
  function currentLead(){
    if(!state?.selected||!state?.data?.leads)return null;
    const lead=state.data.leads.find(x=>x.lead_key===state.selected);
    if(!lead)return null;
    return {
      ...lead,
      disposition:$('#mStatus')?.value||lead.disposition||'',
      notes:$('#mNotes')?.value??lead.notes??''
    };
  }

  function safeName(value){
    return String(value||'property').replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').trim().slice(0,90)||'property';
  }

  function downloadBlob(blob,filename){
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }

  function csvCell(value){
    const s=Array.isArray(value)?value.join('; '):String(value??'');
    return '"'+s.replace(/"/g,'""')+'"';
  }

  function createCSV(){
    const x=currentLead();
    if(!x){toast('Open a property first');return;}
    const fields=[
      ['Address',x.address],['City',x.city],['State',x.state],['ZIP',x.zip],
      ['Asking Price',x.price],['Beds',x.beds],['Baths',x.baths],['Sq Ft',x.sqft],
      ['Property Type',x.property_type],['Priority',x.priority],['Why Flagged',x.why_flagged],
      ['DSCR / Refi Rationale',x.dscr_angle],['First Seen',x.first_seen],['Last Seen',x.last_seen],
      ['Times Seen',x.times_seen],['Seen Dates',x.seen_dates],['Disposition',x.disposition||'Unassigned'],
      ['Notes',x.notes],['Zillow URL',x.source_url],['Lead Key',x.lead_key]
    ];
    const csv='\uFEFF'+fields.map(f=>csvCell(f[0])).join(',')+'\r\n'+fields.map(f=>csvCell(f[1])).join(',')+'\r\n';
    downloadBlob(new Blob([csv],{type:'text/csv;charset=utf-8'}),safeName(x.address)+' - FSBO Radar.csv');
    toast('CSV created');
  }

  function createPDF(){
    const x=currentLead();
    if(!x){toast('Open a property first');return;}
    if(!window.jspdf?.jsPDF){toast('PDF library is still loading. Try again in a moment.');return;}
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({unit:'pt',format:'letter'});
    const W=612,H=792,M=46,contentW=W-M*2;
    let y=44;
    const blue=[7,31,77];

    const newPage=()=>{doc.addPage();y=46;};
    const ensure=h=>{if(y+h>H-46)newPage();};
    const line=(label,value)=>{
      ensure(24);
      doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(71,85,105);doc.text(label.toUpperCase(),M,y);
      doc.setFont('helvetica','normal');doc.setFontSize(11);doc.setTextColor(17,24,39);
      const txt=String(value??'—');
      const lines=doc.splitTextToSize(txt,contentW-145);
      doc.text(lines,M+145,y);
      y+=Math.max(19,lines.length*14+3);
    };
    const section=(title,text)=>{
      const lines=doc.splitTextToSize(String(text||'—'),contentW);
      ensure(31+lines.length*14);
      y+=7;
      doc.setDrawColor(219,226,234);doc.line(M,y-4,W-M,y-4);
      doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(7,31,77);doc.text(title.toUpperCase(),M,y+10);
      y+=27;
      doc.setFont('helvetica','normal');doc.setFontSize(10.5);doc.setTextColor(31,41,55);doc.text(lines,M,y);
      y+=lines.length*14+5;
    };

    doc.setFillColor(...blue);doc.rect(0,0,W,92,'F');
    doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(21);doc.text('FSBO Opportunity Radar',M,38);
    doc.setFontSize(14);doc.text(String(x.address||'Property Summary'),M,63);
    doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.setTextColor(219,234,254);doc.text(`${x.city||''}, ${x.state||''} ${x.zip||''}`.trim(),M,79);
    y=119;

    line('Asking Price',money(x.price));
    line('Property Type',x.property_type||'—');
    line('Beds / Baths',`${num(x.beds)} / ${num(x.baths)}`);
    line('Square Feet',num(x.sqft));
    line('Priority',x.priority||'—');
    line('Disposition',x.disposition?x.disposition.charAt(0).toUpperCase()+x.disposition.slice(1):'Unassigned');
    line('First Seen',date(x.first_seen));
    line('Last Seen',date(x.last_seen));
    line('Times Seen',num(x.times_seen));
    if(x.seen_dates?.length) line('Seen Dates',x.seen_dates.join(', '));

    section('Why This Property Was Flagged',x.why_flagged);
    section('DSCR / Refinance Rationale',x.dscr_angle);
    section('CRM Notes',x.notes||'No notes entered.');

    if(x.source_url){
      ensure(42);y+=5;
      doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(7,31,77);doc.text('ZILLOW LISTING',M,y);
      y+=17;doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(37,99,235);
      const urlLines=doc.splitTextToSize(x.source_url,contentW);
      doc.text(urlLines,M,y);
      try{doc.link(M,y-10,contentW,Math.max(16,urlLines.length*12),{url:x.source_url});}catch{}
      y+=urlLines.length*12+8;
    }

    ensure(34);y+=8;doc.setDrawColor(219,226,234);doc.line(M,y,W-M,y);y+=17;
    doc.setFontSize(8.5);doc.setTextColor(100,116,139);doc.text(`Generated ${new Date().toLocaleString()} • FSBO Opportunity Radar`,M,y);
    doc.save(safeName(x.address)+' - FSBO Radar.pdf');
    toast('PDF created');
  }

  function installButtons(){
    const foot=document.querySelector('#leadModal .modalFoot');
    if(!foot||document.querySelector('#mPDF'))return;
    const pdf=document.createElement('button');
    pdf.type='button';pdf.id='mPDF';pdf.className='btn';pdf.textContent='Create PDF';pdf.addEventListener('click',createPDF);
    const csv=document.createElement('button');
    csv.type='button';csv.id='mCSV';csv.className='btn';csv.textContent='Create CSV';csv.addEventListener('click',createCSV);
    foot.insertBefore(csv,foot.firstChild);
    foot.insertBefore(pdf,foot.firstChild);
  }

  installButtons();
})();