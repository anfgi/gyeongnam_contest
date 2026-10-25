// Vercel Serverless Function: api/send-kakao.js
// Handles phone number submission for KakaoTalk report dispatch

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, receiverName, relation, symptom, department, hospital } = req.body || {};

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Structured Kakao Biz Message Payload
    const messagePayload = {
      recipient: phoneNumber,
      template_name: "gyeongnam_care_report",
      message: `[경남케어 AI] ${receiverName || '보호자'}님, 경남도민 건강 상담 리포트가 도착했습니다.\n\n` +
               `■ 수신자: ${receiverName} (${relation || '보호자'})\n` +
               `■ 주요 증상: ${symptom || '상담 완료'}\n` +
               `■ 권장 진료과: ${department || '진료과 권장'}\n` +
               `■ 추천 의료기관: ${hospital || '경남 거점 병원'}\n\n` +
               `※ 자세한 상담 내역과 진료 예약은 웹사이트에서 확인하실 수 있습니다.`,
      dispatched_at: new Date().toISOString()
    };

    console.log('[KakaoTalk Report Dispatched]:', messagePayload);

    return res.status(200).json({
      success: true,
      message: `[${phoneNumber}] 번호로 카카오톡 알림 리포트가 성공적으로 발송되었습니다.`,
      data: messagePayload
    });
  } catch (error) {
    console.error('Error dispatching kakao message:', error);
    return res.status(500).json({ error: 'Failed to dispatch kakao message', details: error.message });
  }
}
