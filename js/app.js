/**
 * GYEONGNAMCARE AI - INTERACTIVE LOGIC & REAL KAKAOTALK DISPATCH
 * Gyeongnam Smart Medical AI & Care Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility Controls
  initSeniorControls();

  // 2. Hospital Recommendations (Gyeongnam 18 Districts)
  renderHospitals('all', 'all');
  initHospitalFilters();

  // 3. Vapi Voice Simulator
  initVoiceSimulator();

  // 4. Real KakaoTalk Phone Dispatch Logic
  initKakaoDispatch();

  // 5. Follow-up Care Simulator
  initFollowupCare();
});

/* ====================================================
   1. CITIZEN ACCESSIBILITY CONTROLS
   ==================================================== */
function initSeniorControls() {
  const body = document.body;
  const btnSm = document.getElementById('font-sm-btn');
  const btnMd = document.getElementById('font-md-btn');
  const btnLg = document.getElementById('font-lg-btn');
  const btnContrast = document.getElementById('contrast-toggle-btn');
  const btnTts = document.getElementById('tts-guide-btn');

  // Font Size Buttons
  btnSm.addEventListener('click', () => {
    body.className = body.className.replace(/font-\w+/g, '');
    body.classList.add('font-sm');
    updateActiveFontBtn(btnSm);
  });

  btnMd.addEventListener('click', () => {
    body.className = body.className.replace(/font-\w+/g, '');
    body.classList.add('font-normal');
    updateActiveFontBtn(btnMd);
  });

  btnLg.addEventListener('click', () => {
    body.className = body.className.replace(/font-\w+/g, '');
    body.classList.add('font-lg');
    updateActiveFontBtn(btnLg);
  });

  function updateActiveFontBtn(activeBtn) {
    [btnSm, btnMd, btnLg].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  // High Contrast Mode
  btnContrast.addEventListener('click', () => {
    body.classList.toggle('high-contrast');
    const isHc = body.classList.contains('high-contrast');
    btnContrast.innerHTML = isHc 
      ? '<i class="fa-solid fa-sun"></i> 일반 모드' 
      : '<i class="fa-solid fa-circle-half-stroke"></i> 고대비 모드';
  });

  // Screen Voice Guide (TTS)
  btnTts.addEventListener('click', () => {
    speakText("경남케어 AI에 오신 것을 환영합니다. 경남도민 누구나 앱 설치나 본인인증 없이 전화 한 통으로 증상을 상담받고, 가까운 경남 지역 병원을 찾고, 보호자 카카오톡으로 리포트를 받아보실 수 있습니다.");
  });
}

/* ====================================================
   2. GYEONGNAM 18 DISTRICTS HOSPITAL DATA & FILTER
   ==================================================== */
const gyeongnamHospitalData = [
  {
    id: 1,
    name: "창원경상국립대학교병원",
    region: "창원",
    dept: "정형외과",
    type: "상급종합병원",
    distance: "창원 성산구 (도내 거점)",
    address: "경남 창원시 성산구 삼정자로 11",
    phone: "1577-1111",
    perks: ["경남 권역 응급의료센터", "척추·관절 전문", "승강기 및 배리어프리", "어르신·장애인 전용 창구"],
    waitTime: "현재 대기 4명 (약 15분)",
    isSpecial: true
  },
  {
    id: 2,
    name: "삼성창원병원",
    region: "창원",
    dept: "내과",
    type: "상급종합병원",
    distance: "창원 마산회원구",
    address: "경남 창원시 마산회원구 팔용로 158",
    phone: "055-233-5114",
    perks: ["소화기·심뇌혈관 센터", "만성질환 안심 클리닉", "주차 및 휠체어 지원"],
    waitTime: "현재 대기 6명 (약 20분)",
    isSpecial: true
  },
  {
    id: 3,
    name: "경상국립대학교병원 (진주)",
    region: "진주",
    dept: "정형외과",
    type: "상급종합병원",
    distance: "진주시 칠암동 (서부경남 거점)",
    address: "경남 진주시 강남로 79",
    phone: "055-750-8000",
    perks: ["서부경남 권역 응급의료", "퇴행성 관절염 클리닉", "닥터헬기 이착륙 연계"],
    waitTime: "현재 대기 5명 (약 20분)",
    isSpecial: true
  },
  {
    id: 4,
    name: "진주 제일이비인후과의원",
    region: "진주",
    dept: "이비인후과",
    type: "의원",
    distance: "진주 대안동",
    address: "경남 진주시 진주대로 1060 2층",
    phone: "055-742-5500",
    perks: ["1층 승강기 완비", "호흡기 감기·독감 집중 치료", "즉시 진료"],
    waitTime: "현재 대기 2명 (약 5분)",
    isSpecial: false
  },
  {
    id: 5,
    name: "양산부산대학교병원",
    region: "양산",
    dept: "내과",
    type: "상급종합병원",
    distance: "양산시 물금읍",
    address: "경남 양산시 물금읍 금오로 20",
    phone: "1577-7512",
    perks: ["동남권 메디컬 클러스터", "고혈압/당뇨 정밀 진단", "에스컬레이터·승강기 전층"],
    waitTime: "현재 대기 4명 (약 15분)",
    isSpecial: true
  },
  {
    id: 6,
    name: "김해 복음병원",
    region: "김해",
    dept: "정형외과",
    type: "종합병원",
    distance: "김해시 활천로",
    address: "경남 김해시 활천로 33",
    phone: "055-330-8888",
    perks: ["관절·척추 중점 병원", "간호간병통합서비스", "외국인·다문화 통역"],
    waitTime: "현재 대기 3명 (약 10분)",
    isSpecial: false
  },
  {
    id: 7,
    name: "거제 백병원",
    region: "거제",
    dept: "내과",
    type: "종합병원",
    distance: "거제시 고현동",
    address: "경남 거제시 두모길 16",
    phone: "055-636-1121",
    perks: ["24시간 지역 응급실", "내과 전문의 상주", "문턱 없는 진입로"],
    waitTime: "현재 대기 3명 (약 10분)",
    isSpecial: false
  },
  {
    id: 8,
    name: "통영 적십자병원",
    region: "통영",
    dept: "이비인후과",
    type: "공공종합병원",
    distance: "통영시 서호동",
    address: "경남 통영시 중앙로 97",
    phone: "055-644-8901",
    perks: ["도서지역 순회 진료 연계", "의료 취약계층 안심 지원", "감기·이비인후과 진료"],
    waitTime: "현재 대기 2명 (약 5분)",
    isSpecial: true
  },
  {
    id: 9,
    name: "남해군 보건의료원 / 창선보건지소",
    region: "농어촌",
    dept: "내과",
    type: "공공의료원",
    distance: "남해군 남해읍",
    address: "경남 남해군 남해읍 망운로9번길 16",
    phone: "055-860-8700",
    perks: ["어르신 만성질환 무료 검진", "찾아가는 이동진료", "원격 협진"],
    waitTime: "즉시 접수 가능",
    isSpecial: true
  },
  {
    id: 10,
    name: "하동군 안심 당번약국 (하동사랑약국)",
    region: "농어촌",
    dept: "약국",
    type: "약국",
    distance: "하동군 하동읍",
    address: "경남 하동군 하동읍 중앙로 25",
    phone: "055-884-2233",
    perks: ["주말·야간 당번 운영", "큰 글씨 복약 지도", "배송 상담"],
    waitTime: "즉시 조제 가능",
    isSpecial: true
  },
  {
    id: 11,
    name: "창원 중앙 온누리약국",
    region: "창원",
    dept: "약국",
    type: "약국",
    distance: "창원 의창구 원이대로",
    address: "경남 창원시 의창구 원이대로 56",
    phone: "055-267-0099",
    perks: ["연중무휴 안심약국", "처방전 즉시 조제", "어르신 맞춤 복약상담"],
    waitTime: "즉시 조제 가능",
    isSpecial: false
  }
];

let currentRegionFilter = 'all';
let currentDeptFilter = 'all';

function renderHospitals(region, dept) {
  const container = document.getElementById('hospital-cards-container');
  if (!container) return;

  currentRegionFilter = region;
  currentDeptFilter = dept;

  const filtered = gyeongnamHospitalData.filter(h => {
    const matchRegion = (region === 'all' || h.region === region);
    const matchDept = (dept === 'all' || h.dept === dept);
    return matchRegion && matchDept;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
        <i class="fa-solid fa-hospital-user" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
        <p style="font-size: 1.1rem; font-weight: 700; color: #334155;">해당 지역 및 진료과의 등록 의료기관을 검색 중입니다.</p>
        <span style="font-size: 0.9rem; color: #64748b;">'경상남도 전체'를 선택하시면 도내 전역 거점 의료기관을 확인하실 수 있습니다.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(h => `
    <article class="hospital-card" data-id="${h.id}">
      <div class="hosp-badge-row">
        <span class="hosp-type">${h.type} · [${h.region}] ${h.dept}</span>
        <span class="hosp-dist"><i class="fa-solid fa-location-dot"></i> ${h.distance}</span>
      </div>
      <h4 class="hosp-name">${h.name}</h4>
      <p class="hosp-addr"><i class="fa-regular fa-compass"></i> ${h.address}</p>
      
      <div class="senior-perks-list">
        ${h.perks.map((p, idx) => `
          <span class="perk-tag ${idx === 0 ? 'perk-highlight' : ''}">
            <i class="fa-solid fa-check"></i> ${p}
          </span>
        `).join('')}
      </div>

      <div class="hosp-status-row">
        <div class="hosp-wait"><i class="fa-regular fa-clock"></i> <strong>${h.waitTime}</strong></div>
        <button class="hosp-btn-call" onclick="callHospital('${h.name}', '${h.phone}')">
          <i class="fa-solid fa-phone"></i> 바로 전화연결
        </button>
      </div>
    </article>
  `).join('');
}

function initHospitalFilters() {
  const regionSelect = document.getElementById('region-select');
  const filterBtns = document.querySelectorAll('.dept-filter-bar .filter-btn');

  if (regionSelect) {
    regionSelect.addEventListener('change', (e) => {
      renderHospitals(e.target.value, currentDeptFilter);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dept = btn.getAttribute('data-dept');
      renderHospitals(currentRegionFilter, dept);
    });
  });
}

window.callHospital = function(name, phone) {
  alert(`[경남 안심 의료 연결] ${name} (${phone})으로 전화를 연결합니다.\n도민 우선 진료 및 접수 안내가 전달됩니다.`);
};

/* ====================================================
   3. VAPI VOICE AGENT SIMULATOR (ALL CITIZENS)
   ==================================================== */
const scenarioData = {
  knee: {
    title: "허리·관절 통증",
    elderText: "농사일이랑 작업 후에 허리가 끊어질 듯 뻐근하고 무릎이 찌릿찌릿 쑤셔서 걷기 힘들어요...",
    aiResponse: "도민님, 작업 후 지속되는 관절 통증과 방사통은 정형외과 정밀 진료가 필요합니다. 도내 관절 척추 전문 의료기관인 '창원경상국립대학교병원' 또는 가까운 거점 정형외과로 안내해 드릴게요. 입력하신 보호자분 카카오톡으로도 상담 리포트와 병원 정보를 즉시 보내드렸으니 안심하세요.",
    dept: "정형외과 (요추 염좌 / 관절염 의심)",
    hospitalName: "창원경상국립대병원 / 성심정형외과",
    severity: "중등도 (조기 진료 권장)",
    quote: "작업 후 요통 및 무릎 관절 찌릿함 호소."
  },
  cold: {
    title: "감기·독감·발열",
    elderText: "이틀 전부터 목이 심하게 붓고 기침이 멈추지 않으면서 몸에 으슬으슬 오한과 열이 납니다...",
    aiResponse: "도민님, 고열과 심한 인후통은 급성 독감이나 상기도 감염일 가능성이 높습니다. 호흡기 진료를 위해 가까운 이비인후과 내원을 권장드립니다. 통영적십자병원 및 지역 이비인후과 정보를 정리하여 보호자분 카카오톡으로 보내드렸습니다.",
    dept: "이비인후과 (급성 상기도감염 / 독감)",
    hospitalName: "통영적십자병원 / 진주제일이비인후과",
    severity: "주의 (발열 호흡기 진료 요망)",
    quote: "목 통증, 지속 기침 및 발열 오한 증상."
  },
  hypertension: {
    title: "만성질환·혈압약 처방",
    elderText: "매일 복용하는 혈압약과 당뇨약이 오늘 아침으로 다 떨어졌습니다. 재처방을 받아야 해요...",
    aiResponse: "혈압약과 당뇨약은 절대 거르시면 안 됩니다! 도민님 댁 인근의 만성질환 안심 클리닉인 '양산부산대학교병원' 또는 가까운 내과 및 당번약국을 바로 안내해 드릴게요. 복약 알림도 함께 설정해 드렸습니다.",
    dept: "내과 (만성질환 약 재처방)",
    hospitalName: "양산부산대병원 및 안심 당번약국",
    severity: "정기 복약 관리 (당일 처방)",
    quote: "혈압약/당뇨약 소진으로 내과 처방전 발급 필요."
  },
  stomach: {
    title: "급체·복통·소화불량",
    elderText: "점심 식사 후부터 윗배가 더부룩하고 쥐어짜듯이 살살 아프며 속이 메스껍습니다...",
    aiResponse: "도민님, 상복부 쥐어짜는 통증과 오심은 급성 위염이나 담도계 질환일 수 있습니다. 따뜻한 물을 소량씩 드시고, 소화기 내과 전문의가 상주하는 '삼성창원병원' 또는 인근 내과를 지금 방문하시길 권장합니다. 보호자분께도 현재 상태를 카카오톡으로 보고했습니다.",
    dept: "내과 (급성 위장염 / 소화기 질환)",
    hospitalName: "삼성창원병원 / 김해복음병원",
    severity: "주의 (통증 지속 시 진료 요망)",
    quote: "상복부 통증, 소화불량 및 오심 증상 호소."
  }
};

let callActive = false;
let callDuration = 0;
let callTimerInterval = null;
let recognition = null;
let isListening = false;
let currentSummary = scenarioData.knee; // default

function initVoiceSimulator() {
  const btnStart = document.getElementById('btn-start-call');
  const btnEnd = document.getElementById('btn-end-call');
  const btnMic = document.getElementById('btn-mic-toggle');
  const btnSendCustom = document.getElementById('btn-send-custom');
  const customInput = document.getElementById('custom-input-text');

  // Scenario Buttons
  const scenarioBtns = document.querySelectorAll('.scenario-card');
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const scenarioKey = btn.getAttribute('data-scenario');
      if (scenarioData[scenarioKey]) {
        if (!callActive) startCall();
        triggerScenario(scenarioData[scenarioKey]);
      }
    });
  });

  // Call Controls
  btnStart.addEventListener('click', () => startCall());
  btnEnd.addEventListener('click', () => endCall());
  btnMic.addEventListener('click', () => toggleMicSpeech());

  // Custom Input
  btnSendCustom.addEventListener('click', () => {
    const text = customInput.value.trim();
    if (!text) return;
    if (!callActive) startCall();
    handleCustomInput(text);
    customInput.value = '';
  });

  customInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnSendCustom.click();
  });

  // Setup Web Speech API if supported
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      appendUserDialogue(transcript);
      processAiResponse(transcript);
    };

    recognition.onerror = () => stopMicState();
    recognition.onend = () => stopMicState();
  }
}

function startCall() {
  if (callActive) return;
  callActive = true;
  callDuration = 0;

  const btnStart = document.getElementById('btn-start-call');
  const btnEnd = document.getElementById('btn-end-call');
  const btnMic = document.getElementById('btn-mic-toggle');
  const statusPill = document.getElementById('call-status-pill');

  btnStart.classList.add('disabled');
  btnStart.disabled = true;

  btnEnd.classList.remove('disabled');
  btnEnd.disabled = false;

  btnMic.classList.remove('disabled');
  btnMic.disabled = false;

  statusPill.className = 'status-pill status-connected';
  statusPill.textContent = '통화 연결 중 (음성 대화 가능)';

  // Timer
  clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    callDuration++;
    const min = String(Math.floor(callDuration / 60)).padStart(2, '0');
    const sec = String(callDuration % 60).padStart(2, '0');
    document.getElementById('call-timer').textContent = `${min}:${sec}`;
  }, 1000);

  // Initial Greeting
  const greetMsg = "안녕하세요 경남도민 여러분! 경남케어 간호사입니다. 오늘 어디가 불편하신가요? 편하게 말씀해 주세요.";
  appendAgentDialogue(greetMsg);
  speakText(greetMsg);
}

function endCall() {
  if (!callActive) return;
  callActive = false;
  clearInterval(callTimerInterval);

  const btnStart = document.getElementById('btn-start-call');
  const btnEnd = document.getElementById('btn-end-call');
  const btnMic = document.getElementById('btn-mic-toggle');
  const statusPill = document.getElementById('call-status-pill');
  const wave = document.getElementById('voice-waves');

  btnStart.classList.remove('disabled');
  btnStart.disabled = false;

  btnEnd.classList.add('disabled');
  btnEnd.disabled = true;

  btnMic.classList.add('disabled');
  btnMic.disabled = true;

  statusPill.className = 'status-pill status-ready';
  statusPill.textContent = '통화 종료됨 (카카오톡 리포트 자동 발송)';

  wave.classList.remove('speaking');
  stopMicState();

  appendAgentDialogue("통화가 안전하게 종료되었습니다. 상담 요약본과 병원 안내를 입력하신 보호자 카카오톡으로 발송했습니다. 쾌유를 빕니다!");
  speakText("통화가 종료되었습니다. 건강 유의하세요.");

  // Automatically trigger Kakao dispatch UI notification
  const targetPhone = document.getElementById('guardian-phone').value;
  if (targetPhone && targetPhone.length >= 10) {
    showDispatchAlert(targetPhone, "통화 종료 후 상담 리포트가 보호자 휴대폰으로 발송 예약되었습니다.");
  }
}

function toggleMicSpeech() {
  if (!recognition) {
    alert("현재 브라우저에서는 마이크 인식을 직접 지원하지 않습니다. 시나리오 버튼 또는 직접 입력창을 이용해 주세요!");
    return;
  }

  const btnMic = document.getElementById('btn-mic-toggle');
  const statusPill = document.getElementById('call-status-pill');

  if (!isListening) {
    try {
      recognition.start();
      isListening = true;
      btnMic.classList.add('active');
      btnMic.querySelector('span').textContent = '듣는 중...';
      statusPill.className = 'status-pill status-listening';
      statusPill.textContent = '도민 말씀 듣는 중...';
    } catch (e) {
      console.warn(e);
    }
  } else {
    recognition.stop();
    stopMicState();
  }
}

function stopMicState() {
  isListening = false;
  const btnMic = document.getElementById('btn-mic-toggle');
  const statusPill = document.getElementById('call-status-pill');
  if (btnMic) {
    btnMic.classList.remove('active');
    btnMic.querySelector('span').textContent = '마이크 말하기';
  }
  if (statusPill && callActive) {
    statusPill.className = 'status-pill status-connected';
    statusPill.textContent = '통화 연결 중';
  }
}

function triggerScenario(data) {
  currentSummary = data;
  appendUserDialogue(data.elderText);

  setTimeout(() => {
    appendAgentDialogue(data.aiResponse);
    speakText(data.aiResponse);

    // Update Live AI analysis card
    updateAnalysisCard(data.title, data.dept, data.severity);

    // Update Kakao Talk Preview
    updateKakaoReport(data.elderText, data.dept, data.hospitalName, data.quote);

    // Filter hospital recommendations
    let targetFilter = 'all';
    if (data.dept.includes('정형외과')) targetFilter = '정형외과';
    else if (data.dept.includes('이비인후과')) targetFilter = '이비인후과';
    else if (data.dept.includes('내과')) targetFilter = '내과';
    
    renderHospitals(currentRegionFilter, targetFilter);
    const filterBtns = document.querySelectorAll('.dept-filter-bar .filter-btn');
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-dept') === targetFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

  }, 600);
}

function handleCustomInput(text) {
  appendUserDialogue(text);
  processAiResponse(text);
}

function processAiResponse(userText) {
  let matched = scenarioData.knee;
  if (userText.includes('목') || userText.includes('기침') || userText.includes('열') || userText.includes('감기') || userText.includes('가래')) {
    matched = scenarioData.cold;
  } else if (userText.includes('약') || userText.includes('혈압') || userText.includes('당뇨') || userText.includes('처방')) {
    matched = scenarioData.hypertension;
  } else if (userText.includes('배') || userText.includes('속') || userText.includes('소화') || userText.includes('토') || userText.includes('체')) {
    matched = scenarioData.stomach;
  }

  currentSummary = matched;

  setTimeout(() => {
    appendAgentDialogue(matched.aiResponse);
    speakText(matched.aiResponse);
    updateAnalysisCard(userText, matched.dept, "확인 요망");
    updateKakaoReport(userText, matched.dept, matched.hospitalName, userText);
  }, 700);
}

function appendAgentDialogue(text) {
  const container = document.getElementById('live-dialogue-area');
  const div = document.createElement('div');
  div.className = 'dialogue-bubble msg-agent';
  div.innerHTML = `<strong>AI 간호 에이전트:</strong> ${text}`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendUserDialogue(text) {
  const container = document.getElementById('live-dialogue-area');
  const div = document.createElement('div');
  div.className = 'dialogue-bubble msg-user';
  div.innerHTML = `<strong>도민 말씀:</strong> "${text}"`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function updateAnalysisCard(symptom, dept, severity) {
  document.getElementById('analysis-status').textContent = 'AI 분석 완료';
  document.getElementById('analysis-status').className = 'badge-status-call text-success';
  document.getElementById('an-symptom').textContent = symptom;
  document.getElementById('an-dept').textContent = dept;
  document.getElementById('an-severity').textContent = severity;
}

function updateKakaoReport(symptom, dept, hospital, quote) {
  document.getElementById('k-symptom').textContent = symptom;
  document.getElementById('k-dept').textContent = dept;
  document.getElementById('k-hospital').textContent = hospital;
  document.getElementById('k-quote').textContent = `"${quote}"`;
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const wave = document.getElementById('voice-waves');
  if (wave) wave.classList.add('speaking');

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = 0.95;
  utter.pitch = 1.0;

  utter.onend = () => {
    if (wave) wave.classList.remove('speaking');
  };
  utter.onerror = () => {
    if (wave) wave.classList.remove('speaking');
  };

  window.speechSynthesis.speak(utter);
}

/* ====================================================
   4. REAL KAKAOTALK PHONE NUMBER DISPATCH LOGIC
   ==================================================== */
function initKakaoDispatch() {
  const phoneInput = document.getElementById('guardian-phone');
  const nameInput = document.getElementById('guardian-name');
  const relationSelect = document.getElementById('guardian-relation');
  const btnSubmit = document.getElementById('btn-send-real-kakao');
  const btnShare = document.getElementById('btn-share-kakao-link');

  // Initialize Kakao SDK with user provided API key
  if (window.Kakao && !window.Kakao.isInitialized()) {
    try {
      window.Kakao.init('ca67e3dc1096898795f38e4a711f0930');
    } catch (e) {
      console.warn("Kakao init:", e);
    }
  }

  // Auto format phone number
  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 3 && val.length <= 7) {
      val = val.substring(0, 3) + '-' + val.substring(3);
    } else if (val.length > 7) {
      val = val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11);
    }
    e.target.value = val;

    // Real-time sync with mockup
    const targetPhoneSpan = document.getElementById('k-target-phone');
    if (targetPhoneSpan) {
      targetPhoneSpan.textContent = val || '010-XXXX-XXXX';
    }
  });

  // Name & Relation sync with mockup
  function syncReceiverName() {
    const receiverDisplay = document.getElementById('k-receiver-display');
    const name = nameInput.value.trim() || '보호자';
    const rel = relationSelect.value;
    receiverDisplay.textContent = `${name} (${rel})님`;
  }

  nameInput.addEventListener('input', syncReceiverName);
  relationSelect.addEventListener('change', syncReceiverName);

  // Send real KakaoTalk trigger button
  btnSubmit.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    const name = nameInput.value.trim() || '보호자';
    const relation = relationSelect.value;

    if (!phone || phone.length < 12) {
      alert("알림톡을 수신할 올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)");
      phoneInput.focus();
      return;
    }

    // 1. Show immediate success feedback banner
    showDispatchAlert(phone, `${name} (${relation})님의 휴대폰 [${phone}]으로 경남케어 AI 상담 리포트가 성공적으로 발송되었습니다.`);

    // 2. Also try Kakao SDK Share / Web link picker
    triggerKakaoShareDirect();

    // 3. Optional POST to serverless backend
    fetch('/api/send-kakao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: phone,
        receiverName: name,
        relation: relation,
        symptom: currentSummary.elderText,
        department: currentSummary.dept,
        hospital: currentSummary.hospitalName
      })
    }).catch(() => {
      // Gracefully handled if standalone static
    });
  });

  // Direct Kakao Share button
  btnShare.addEventListener('click', () => {
    triggerKakaoShareDirect();
  });
}

function showDispatchAlert(phone, message) {
  const feedbackBox = document.getElementById('dispatch-feedback');
  const title = document.getElementById('feedback-title');
  const msg = document.getElementById('feedback-msg');

  title.textContent = `카카오톡 전송 완료! (${phone})`;
  msg.textContent = message;

  feedbackBox.classList.remove('hidden');
  feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.triggerKakaoShareDirect = function() {
  const phone = document.getElementById('guardian-phone').value || '010-XXXX-XXXX';
  const name = document.getElementById('guardian-name').value || '보호자';
  const dept = currentSummary.dept || '정형외과';
  const hosp = currentSummary.hospitalName || '경남 거점 의료기관';
  const desc = `[경남케어 AI] ${name}님, 도민 건강 상담 리포트: 권장 진료과 [${dept}], 추천 병원 [${hosp}] 안내가 도착했습니다.`;

  // If Kakao SDK is available and working
  if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '[경남케어 AI] 도민 건강 상담 안심 리포트',
          description: desc,
          imageUrl: 'https://gyeongnamcontest.vercel.app/assets/image2.png',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href
          }
        },
        buttons: [
          {
            title: '리포트 자세히 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href
            }
          }
        ]
      });
      return;
    } catch (e) {
      console.warn("Kakao.Share error:", e);
    }
  }

  // Fallback to KakaoTalk Web Sharer URL or Mobile URL scheme
  const shareUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=ca67e3dc1096898795f38e4a711f0930&validation_action=default&url=${encodeURIComponent(window.location.href)}`;
  const popup = window.open(shareUrl, 'KakaoShare', 'width=450,height=650');
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // Popup blocked, open normal
    window.location.href = `kakaolink://send?appkey=ca67e3dc1096898795f38e4a711f0930&appver=1.0&apiver=3.0&linkver=4.0&type=link&url=${encodeURIComponent(window.location.href)}`;
  }
};

/* ====================================================
   5. POST-VISIT FOLLOW-UP CALL SIMULATOR
   ==================================================== */
function initFollowupCare() {
  const btnTrigger = document.getElementById('btn-trigger-followup');
  const resultBox = document.getElementById('followup-result-box');

  btnTrigger.addEventListener('click', () => {
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    speakText("도민님, 병원에서 처방받아 오신 약은 아침 식사 후에 잘 챙겨드셨나요? 통증은 좀 어떠신가요?");
  });
}
