/**
 * SILVERCARE AI - INTERACTIVE LOGIC & VAPI VOICE SIMULATOR
 * 2026 Ulsan AI Hackathon | Kimbeomju Team
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Senior Accessibility Controls
  initSeniorControls();

  // 2. Hospital Recommendations
  renderHospitals('all');
  initHospitalFilters();

  // 3. Vapi Voice Simulator
  initVoiceSimulator();

  // 4. Follow-up Care Simulator
  initFollowupCare();
});

/* ====================================================
   1. SENIOR ACCESSIBILITY CONTROLS
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
    speakText("실버케어 AI에 오신 것을 환영합니다. 앱 설치나 본인인증 없이 전화 통화만으로 어르신의 아픈 곳을 상담하고 병원을 찾아드립니다.");
  });
}

/* ====================================================
   2. DATA & HOSPITAL RECOMMENDATIONS
   ==================================================== */
const hospitalData = [
  {
    id: 1,
    name: "울산 성심정형외과의원",
    dept: "정형외과",
    type: "의원",
    distance: "도보 7분 (350m)",
    address: "울산 중구 번영로 123 2층",
    phone: "052-246-8800",
    perks: ["승강기 완비", "휠체어 경사로", "어르신 우선 접수", "관절 전문"],
    waitTime: "현재 대기 3명 (약 10분)",
    isSpecial: true
  },
  {
    id: 2,
    name: "바른마디 정형외과병원",
    dept: "정형외과",
    type: "병원",
    distance: "차량 5분 (1.4km)",
    address: "울산 중구 태화로 88",
    phone: "052-211-7500",
    perks: ["지하/지상 승강기", "물리치료실 완비", "주차 안내 요원"],
    waitTime: "현재 대기 5명 (약 20분)",
    isSpecial: false
  },
  {
    id: 3,
    name: "연세이비인후과의원",
    dept: "이비인후과",
    type: "의원",
    distance: "도보 5분 (280m)",
    address: "울산 중구 중앙길 54 1층",
    phone: "052-258-0033",
    perks: ["1층 바로 진입", "계단 없음", "독감 백신 지정의료기관"],
    waitTime: "현재 대기 2명 (약 5분)",
    isSpecial: true
  },
  {
    id: 4,
    name: "울산 하나내과의원",
    dept: "내과",
    type: "의원",
    distance: "도보 9분 (520m)",
    address: "울산 중구 학성로 67 3층",
    phone: "052-294-1122",
    perks: ["대형 승강기", "만성질환 고혈압/당뇨 안심 클리닉", "복약 지도"],
    waitTime: "현재 대기 4명 (약 15분)",
    isSpecial: false
  },
  {
    id: 5,
    name: "중앙 사랑약국",
    dept: "약국",
    type: "약국",
    distance: "도보 3분 (180m)",
    address: "울산 중구 중앙길 45",
    phone: "052-243-5566",
    perks: ["어르신 전용 큰 글씨 복약봉투", "친절 상담", "문턱 없는 입구"],
    waitTime: "즉시 조제 가능",
    isSpecial: true
  },
  {
    id: 6,
    name: "온누리 세종약국",
    dept: "약국",
    type: "약국",
    distance: "도보 6분 (410m)",
    address: "울산 중구 번영로 118",
    phone: "052-297-7788",
    perks: ["자동 혈압측정기 구비", "연중무휴 안심약국"],
    waitTime: "즉시 조제 가능",
    isSpecial: false
  }
];

function renderHospitals(filterDept) {
  const container = document.getElementById('hospital-cards-container');
  if (!container) return;

  const filtered = filterDept === 'all' 
    ? hospitalData 
    : hospitalData.filter(h => h.dept === filterDept);

  container.innerHTML = filtered.map(h => `
    <article class="hospital-card" data-id="${h.id}">
      <div class="hosp-badge-row">
        <span class="hosp-type">${h.type} · ${h.dept}</span>
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
  const filterBtns = document.querySelectorAll('.dept-filter-bar .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dept = btn.getAttribute('data-dept');
      renderHospitals(dept);
    });
  });
}

window.callHospital = function(name, phone) {
  alert(`[안심 전화 연결] ${name} (${phone})으로 통화를 연결합니다.\n어르신 우선 접수 문의가 자동으로 전달됩니다.`);
};

/* ====================================================
   3. VAPI VOICE AGENT SIMULATOR
   ==================================================== */
const scenarioData = {
  knee: {
    title: "무릎 관절 통증",
    elderText: "어제부터 계단 내려갈 때 오른쪽 무릎이 찌릿찌릿 쑤시고 열감이 나서 걷기가 너무 힘들어유...",
    aiResponse: "어르신, 무릎 관절 통증으로 많이 불편하시겠어요. 계단 보행 시 통증과 열감은 정형외과 진료가 꼭 필요합니다. 계단 없이 엘리베이터가 있는 도보 7분 거리의 '울산 성심정형외과'로 안내해 드릴게요. 자녀분 카카오톡으로도 병원 정보와 통화 내용을 바로 보내드렸으니 안심하세요.",
    dept: "정형외과 (퇴행성 관절염 / 염좌)",
    hospitalName: "울산 성심정형외과의원 (도보 7분, 엘리베이터 완비)",
    severity: "중등도 (당일 진료 권장)",
    quote: "어제부터 계단 내려갈 때 오른쪽 무릎에 열감이 있고 쑤셔. 절뚝거리며 걷고 있어."
  },
  cold: {
    title: "감기·고열·기침",
    elderText: "이틀 전부터 목이 따갑더니 밤새 기침이 심하고 몸에 으슬으슬 열이 나네...",
    aiResponse: "어르신, 열이 나고 기침이 심하시군요. 환절기 호흡기 감염이나 독감일 수 있어 이비인후과 진료를 추천드립니다. 1층에 위치해 들어가시기 편한 '연세이비인후과'가 280미터 거리에 있습니다. 보호자분께 진료 동행 및 예약 알림을 전송했습니다.",
    dept: "이비인후과 (급성 상기도감염 의심)",
    hospitalName: "연세이비인후과의원 (1층 입구, 계단 없음)",
    severity: "중등도 (호흡기 진료 요망)",
    quote: "이틀 전부터 목이 따갑고 기침과 오한, 열이 남."
  },
  hypertension: {
    title: "만성질환·혈압약 처방",
    elderText: "매일 먹던 혈압약이 오늘 아침으로 딱 떨어졌어. 처방전 다시 받아야 혀...",
    aiResponse: "혈압약은 거르시면 위험하니 오늘 꼭 처방받으셔야 해요! 어르신 댁에서 도보 9분 거리에 만성질환 안심 클리닉을 운영하는 '울산 하나내과'가 있습니다. 진료 후 바로 앞 '중앙 사랑약국'에서 큰 글씨 복약봉투로 지어가실 수 있도록 안내해 드릴게요.",
    dept: "내과 (만성질환 약 처방)",
    hospitalName: "울산 하나내과의원 및 중앙사랑약국",
    severity: "정기 복약 관리",
    quote: "혈압약 소진으로 당일 내과 처방 및 약국 조제 필요."
  },
  stomach: {
    title: "소화불량·위장 통증",
    elderText: "점심 먹고부터 윗배가 더부룩하고 쥐어짜듯이 살살 아프고 토할 것 같아...",
    aiResponse: "어르신, 명치 쪽 쥐어짜는 통증은 급체나 급성 위염일 수 있습니다. 따뜻한 보리차를 조금씩 드시고, 소화기 내과 전문의가 계시는 '울산 하나내과'로 지금 내원하시는 것이 좋겠습니다. 자녀분께도 현재 증상을 카카오톡으로 긴급 보고해 드렸습니다.",
    dept: "내과 (급성 위염 / 소화기 질환)",
    hospitalName: "울산 하나내과의원",
    severity: "주의 (통증 지속 시 대면진료)",
    quote: "상복부 통증, 소화불량 및 오심 증상 호소."
  }
};

let callActive = false;
let callDuration = 0;
let callTimerInterval = null;
let recognition = null;
let isListening = false;

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

  // Call Start
  btnStart.addEventListener('click', () => {
    startCall();
  });

  // Call End
  btnEnd.addEventListener('click', () => {
    endCall();
  });

  // Mic STT Toggle
  btnMic.addEventListener('click', () => {
    toggleMicSpeech();
  });

  // Custom Input
  btnSendCustom.addEventListener('click', () => {
    const text = customInput.value.trim();
    if (!text) return;
    if (!callActive) startCall();
    handleCustomInput(text);
    customInput.value = '';
  });

  customInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnSendCustom.click();
    }
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

    recognition.onerror = () => {
      stopMicState();
    };

    recognition.onend = () => {
      stopMicState();
    };
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
  const greetMsg = "안녕하세요 어르신! 실버케어 간호사입니다. 오늘 몸 어디가 편찮으신가요? 편하게 말씀해 주세요.";
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
  statusPill.textContent = '통화 종료됨 (카카오톡 리포트 전송)';

  wave.classList.remove('speaking');
  stopMicState();

  appendAgentDialogue("통화가 안전하게 종료되었습니다. 상담 요약본과 병원 안내를 자녀분 카카오톡으로 발송했습니다. 쾌유를 빕니다!");
  speakText("통화가 종료되었습니다. 건강 유의하세요.");
}

function toggleMicSpeech() {
  if (!recognition) {
    alert("현재 브라우저에서는 음성 인식(마이크)을 직접 지원하지 않습니다. 시나리오 버튼 또는 텍스트 입력을 이용해 주세요!");
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
      statusPill.textContent = '어르신 말씀 듣는 중...';
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
    
    // Highlight and render
    renderHospitals(targetFilter);
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
  // Simple smart matching
  let matched = scenarioData.knee;
  if (userText.includes('목') || userText.includes('기침') || userText.includes('열') || userText.includes('감기') || userText.includes('가래')) {
    matched = scenarioData.cold;
  } else if (userText.includes('약') || userText.includes('혈압') || userText.includes('당뇨') || userText.includes('처방')) {
    matched = scenarioData.hypertension;
  } else if (userText.includes('배') || userText.includes('속') || userText.includes('소화') || userText.includes('토') || userText.includes('체')) {
    matched = scenarioData.stomach;
  }

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
  div.innerHTML = `<strong>어르신 말씀:</strong> "${text}"`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function updateAnalysisCard(symptom, dept, severity) {
  document.getElementById('analysis-status').textContent = 'Function Tool 분석 완료';
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
  utter.rate = 0.95; // slightly slower for elderly friendly pacing
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
   4. FOLLOW-UP POST-CARE SIMULATOR
   ==================================================== */
function initFollowupCare() {
  const btnTrigger = document.getElementById('btn-trigger-followup');
  const resultBox = document.getElementById('followup-result-box');

  btnTrigger.addEventListener('click', () => {
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    speakText("어르신, 성심정형외과에서 받아오신 관절약 아침에 챙겨드셨지요? 통증은 좀 어떠신가요?");
  });
}
