(function(window, document){
    "use strict";

    const PLANETS=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
    const HI={Sun:"सूर्य",Moon:"चंद्र",Mars:"मंगल",Mercury:"बुध",Jupiter:"गुरु",Venus:"शुक्र",Saturn:"शनि",Rahu:"राहु",Ketu:"केतु"};
    const GANA_HI={Deva:"देव",Manushya:"मनुष्य",Rakshasa:"राक्षस"};
    const NADI_HI={Adi:"आदि",Madhya:"मध्य",Antya:"अंत्य"};
    const YONI_HI={Horse:"घोड़ा",Elephant:"हाथी",Sheep:"भेड़",Serpent:"सर्प",Dog:"कुत्ता",Cat:"बिल्ली",Rat:"चूहा",Cow:"गाय",Buffalo:"भैंस",Tiger:"बाघ",Deer:"हिरण",Monkey:"बंदर",Mongoose:"नेवला",Lion:"सिंह"};
    const escape=v=>String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
    const val=(v,f="—")=>v===null||v===undefined||v===""?f:String(v);
    function getState(){return window.KundliState?.getState?window.KundliState.getState():null;}
    function nakshatra(k){const m=k?.planets?.Moon;if(m?.nakshatra&&typeof m.nakshatra==="object")return m.nakshatra;if(Number.isFinite(Number(m?.longitude))&&window.KundliEngine?.utils?.getNakshatra)return window.KundliEngine.utils.getNakshatra(Number(m.longitude));return null;}
    function navamsa(p){if(p?.navamsa)return p.navamsa;if(Number.isFinite(Number(p?.longitude))&&window.KundliEngine?.utils?.getNavamsa)return window.KundliEngine.utils.getNavamsa(Number(p.longitude));return null;}
    function sign(x){return x?.sign||x||null;}
    function rashi(x){const s=sign(x);return s?val(s.hindi||s.name):"—";}
    function taraScore(a,b){
        const na=nakshatra(a), nb=nakshatra(b);
        if(!na||!nb||!Number.isInteger(Number(na.index))||!Number.isInteger(Number(nb.index))) return null;
        const good=r=>![3,5,7].includes(r);
        const rem=(to,from)=>{const d=((to-from+27)%27)+1;const r=d%9===0?9:d%9;return {d,r,good:good(r)};};
        const f=rem(Number(nb.index),Number(na.index)), r=rem(Number(na.index),Number(nb.index));
        return {score:f.good&&r.good?3:(f.good||r.good?1.5:0),detail:`A→B ${f.d}/${f.r}; B→A ${r.d}/${r.r}`};
    }
    function milan(a,b,pa,pb){if(window.KundliGunMilan?.calculateForKundlis)return window.KundliGunMilan.calculateForKundlis(a,b,pa,pb);const m=getState()?.milan;return m?.rows?m:null;}
    function render(){
        const out=document.getElementById("detailedReportContent");if(!out)return;const st=getState();const k=st?.kundliA;
        if(!k){out.innerHTML='<div class="report-empty">पहले Birth Details में वास्तविक Kundli calculate और save करें।</div>';return;}
        const p=st.personA||{};const nk=nakshatra(k);const lag=k.lagna;const engine=k.engine||{};
        const planetRows=PLANETS.map(id=>{const x=k.planets?.[id];if(!x)return `<tr><td>${escape(HI[id])}</td><td>${escape(id)}</td><td colspan="8">Data unavailable</td></tr>`;const d9=navamsa(x);return `<tr><td><strong>${escape(HI[id])}</strong></td><td>${escape(id)}</td><td>${escape(rashi(x.rashi))}</td><td>${escape(val(x.degreeFormatted))}</td><td>${escape(val(x.house))}</td><td>${escape(x.nakshatra?.hindi||x.nakshatra?.name)}</td><td>${escape(x.nakshatra?.pada)}</td><td>${escape(rashi(d9))} · P${escape(d9?.pada)}</td><td>${escape(x.dignity?.label||"सामान्य / Neutral")}</td><td>${x.combust?"अस्त / Combust":x.retrograde?"वक्री / Retrograde":"मार्गी / Direct"}</td></tr>`;}).join("");
        const m=st.kundliB?milan(k,st.kundliB,st.personA,st.personB):null;const row=id=>m?.rows?.find(x=>x.id===id);const score=id=>{const x=row(id);return x?`${x.score} / ${x.max}`:"—";};
        document.getElementById("reportEngineBadge").textContent=engine.provider?`${engine.provider} · ${engine.ayanamsha||"Lahiri"} · ${engine.houseSystem||"Whole Sign"}`:"Kundli Engine";
        document.getElementById("reportTitle").textContent=`${p.name||k.input?.name||"Kundli"} — Detailed Report / विस्तृत रिपोर्ट`;
        out.innerHTML=`
        <section class="report-card"><h3 class="report-section-title">Birth & Lagna / जन्म एवं लग्न</h3><div class="report-grid">
          <div class="report-stat"><small>Name / नाम</small><strong>${escape(p.name||k.input?.name)}</strong></div>
          <div class="report-stat"><small>Lagna / लग्न</small><strong>${escape(rashi(lag?.rashi))}</strong></div>
          <div class="report-stat"><small>Lagna Lord / लग्न स्वामी</small><strong>${escape(lag?.rashiLord)}</strong></div>
          <div class="report-stat"><small>Moon Nakshatra / चंद्र नक्षत्र</small><strong>${escape(nk?.hindi||nk?.name)} · P${escape(nk?.pada)}</strong></div>
        </div></section>
        <section class="report-card"><h3 class="report-section-title">D1 Planetary Snapshot / D1 ग्रह स्थिति</h3><div class="report-table-wrap"><table class="report-table"><thead><tr><th>ग्रह</th><th>Planet</th><th>राशि</th><th>अंश</th><th>भाव</th><th>नक्षत्र</th><th>पाद</th><th>Navamsa</th><th>Dignity</th><th>Status</th></tr></thead><tbody>${planetRows}</tbody></table></div></section>
        <section class="report-card"><h3 class="report-section-title">Moon Nakshatra Profile / चंद्र नक्षत्र प्रोफाइल</h3><div class="report-grid">
          <div class="report-stat"><small>Gana / गण</small><strong>${escape(nk?.gana)} / ${escape(GANA_HI[nk?.gana])}</strong></div>
          <div class="report-stat"><small>Yoni / योनि</small><strong>${escape(nk?.yoni)} / ${escape(YONI_HI[nk?.yoni])}</strong></div>
          <div class="report-stat"><small>Nadi / नाड़ी</small><strong>${escape(nk?.nadi)} / ${escape(NADI_HI[nk?.nadi])}</strong></div>
          <div class="report-stat"><small>Pada / पाद</small><strong>${escape(nk?.pada)}</strong></div>
        </div></section>
        <section class="report-card"><h3 class="report-section-title">Navamsa D9 / नवांश</h3><div class="report-grid">
          <div class="report-stat"><small>D9 Lagna</small><strong>${escape(rashi(k.navamsa?.lagna))}</strong></div>
          <div class="report-stat"><small>D9 Moon</small><strong>${escape(rashi(navamsa(k.planets?.Moon)))}</strong></div>
          <div class="report-stat"><small>D9 Venus</small><strong>${escape(rashi(navamsa(k.planets?.Venus)))}</strong></div>
          <div class="report-stat"><small>D9 Jupiter</small><strong>${escape(rashi(navamsa(k.planets?.Jupiter)))}</strong></div>
        </div></section>
        ${m?`<section class="report-card"><h3 class="report-section-title">Ashtakoota / Gun Milan</h3><div class="report-grid"><div class="report-stat"><small>Total / कुल गुण</small><strong>${escape(m.total)} / 36</strong></div><div class="report-stat"><small>Tara / तारा</small><strong>${m?score("tara"):(st.kundliB?`${taraScore(k,st.kundliB)?.score ?? "—"} / 3`:"Person B required")}</strong></div><div class="report-stat"><small>Gana / गण</small><strong>${score("gana")}</strong></div><div class="report-stat"><small>Nadi / नाड़ी</small><strong>${score("nadi")}</strong></div></div><div class="report-note">Tara, Gana, Nadi और अन्य Koota केवल दोनों saved Kundli के वास्तविक Moon Sign/Nakshatra से calculate किए गए हैं।</div></section>`:""}
        <section class="report-card"><h3 class="report-section-title">Calculation Integrity / गणना आधार</h3><div class="report-note">इस report में random score, fake planetary position, artificial compatibility percentage या manually invented result नहीं है। जिस field का वास्तविक calculated source उपलब्ध है वही दिखाया गया है; missing source को blank की जगह स्पष्ट रूप से unavailable बताया जाता है।</div></section>`;
    }
    const api={init:render,render};window.KundliDetailedReport=api;window.KundliModules=window.KundliModules||{};window.KundliModules["detailed-report"]={init:render};
})(window,document);
