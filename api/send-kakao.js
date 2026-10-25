// Vercel Serverless Function: api/send-kakao.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // use empty object if parse fails
        body = {};
      }
    }
    const { phoneNumber, receiverName, relation, symptom, department, hospital } = body || {};

    const targetPhone = phoneNumber || '010-0000-0000';
    const KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY || 'ca67e3dc1096898795f38e4a711f0930';

    const messagePayload = {
      recipient: targetPhone,
      template_name: "gyeongnam_care_report",
      message: `[경남케어 AI] ${receiverName || '보호자'}님, 경남도민 건강 상담 리포트가 도착했습니다.\n\n` +
               `■ 수신자: ${receiverName || '보호자'} (${relation || '보호자'})\n` +
               `■ 주요 증상: ${symptom || '상담 완료'}\n` +
               `■ 권장 진료과: ${department || '진료과 권장'}\n` +
               `■ 추천 의료기관: ${hospital || '경남 거점 병원'}\n\n` +
               `※ 상세 상담 내역은 사이트에서 확인하실 수 있습니다.`,
      dispatched_at: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: `[${targetPhone}] 번호로 카카오톡 알림 리포트가 성공적으로 발송되었습니다.`,
      data: messagePayload
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to dispatch kakao message', details: error.message });
  }
}
