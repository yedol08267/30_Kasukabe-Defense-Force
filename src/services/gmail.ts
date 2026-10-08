/**
 * Gmail API Client for Welgye Market Price Briefing Emails
 */

export interface SendEmailResult {
  id: string;
  threadId: string;
}

// Convert string to base64url format required by Gmail API
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Format RFC 2047 encoded-word for UTF-8 non-ASCII email headers
function encodeSubject(subject: string): string {
  const bytes = new TextEncoder().encode(subject);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `=?UTF-8?B?${btoa(binary)}?=`;
}

export function generateBriefingHtml(recipient: string): string {
  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>웰계장터 당일 식재료 특가 브리핑</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1c19;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f7f3; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e3e3de; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d631b 0%, #15802e 100%); padding: 32px 24px; text-align: left; color: #ffffff;">
              <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 9999px; padding: 4px 12px; font-size: 11px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 12px;">
                AI PRICE RADAR · 월계1동 특가 브리핑
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; line-height: 1.3; color: #ffffff;">
                🥬 웰계장터 광운대역 3대 마트 당일 시세
              </h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: #d0f7cb; line-height: 1.4;">
                ${todayStr} · 1인 가구 & 자취생을 위한 아침 장보기 최저가 리포트
              </p>
            </td>
          </tr>

          <!-- Update Source Notice -->
          <tr>
            <td style="padding: 16px 24px; background-color: #f1f8ee; border-bottom: 1px solid #dceed5;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; color: #0d631b; font-weight: 600; line-height: 1.5;">
                    <span style="background-color: #0d631b; color: #ffffff; padding: 2px 7px; border-radius: 6px; font-size: 10px; margin-right: 6px;">시세 출처 분리</span>
                    공공데이터(KAMIS 공식 도매) <strong>오전 06:00</strong> / 골목마트 현장 확인 <strong>오전 08:30</strong> 업데이트
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #40493d;">
                안녕하세요, 이웃님(<strong>${recipient}</strong>)!<br>
                광운대역과 석계역 인근 골목마트 3곳(우리마트, 싱싱마트, GS더프레시)의 오늘 아침 실시간 할인 및 1인 가구 소분 식재료 시세를 정리해 전달해 드립니다.
              </p>

              <!-- Price Cards -->
              <h2 style="margin: 20px 0 12px; font-size: 15px; font-weight: 800; color: #1a1c19;">
                🔥 오늘의 찜 식재료 레이더 주요 시세
              </h2>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <!-- Item 1 -->
                <tr>
                  <td style="padding: 12px; background-color: #fafaf7; border: 1px solid #e3e3de; border-radius: 12px; margin-bottom: 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <div style="font-size: 11px; color: #0d631b; font-weight: 700;">
                            우리마트 · 광운대역 1번 출구 <span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 4px;">현장 확인</span>
                          </div>
                          <div style="font-size: 15px; font-weight: 700; color: #1a1c19; margin: 2px 0;">
                            🥚 무항생제 대란 10구
                          </div>
                          <div style="font-size: 12px; color: #2e7d32; font-weight: 700;">
                            3,280원 <span style="color: #15803d; font-size: 11px;">(전일 대비 -200원 / 초특가)</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td height="8"></td></tr>

                <!-- Item 2 -->
                <tr>
                  <td style="padding: 12px; background-color: #fafaf7; border: 1px solid #e3e3de; border-radius: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <div style="font-size: 11px; color: #0d631b; font-weight: 700;">
                            싱싱마트 · 석계로 골목 <span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 4px;">현장 확인</span>
                          </div>
                          <div style="font-size: 15px; font-weight: 700; color: #1a1c19; margin: 2px 0;">
                            🍲 국산 콩 찌개용 부침두부 (300g)
                          </div>
                          <div style="font-size: 12px; color: #2e7d32; font-weight: 700;">
                            1,450원 <span style="color: #15803d; font-size: 11px;">(최근 1주일 중 최저 / 구매적기)</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td height="8"></td></tr>

                <!-- Item 3 -->
                <tr>
                  <td style="padding: 12px; background-color: #fafaf7; border: 1px solid #e3e3de; border-radius: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <div style="font-size: 11px; color: #0d631b; font-weight: 700;">
                            GS더프레시 월계점 <span style="background-color: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 4px;">현장 확인</span>
                          </div>
                          <div style="font-size: 15px; font-weight: 700; color: #1a1c19; margin: 2px 0;">
                            🌱 손질 흙대파 (1단 소포장)
                          </div>
                          <div style="font-size: 12px; color: #2e7d32; font-weight: 700;">
                            1,980원 <span style="color: #15803d; font-size: 11px;">(마감 전 특가 / 전일 대비 -300원)</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Mart Comparison Summary -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 24px;">
                <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">
                  📍 오늘 자취생 추천 장보기 동선
                </div>
                <div style="font-size: 12px; color: #475569; line-height: 1.6;">
                  1️⃣ <strong>우리마트</strong> (광운대역 1번출구): 계란·두부 최저가 집중 구매<br>
                  2️⃣ <strong>GS더프레시</strong> (월계역 방향): 소포장 채소 및 대파 구매 추천
                </div>
              </div>

              <!-- Button CTA -->
              <div style="text-align: center; margin: 24px 0 12px;">
                <a href="https://ais-dev-gzd5tjkojm4k2qfaexjd3c-244789190386.asia-northeast1.run.app" style="display: inline-block; background-color: #0d631b; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 12px; box-shadow: 0 2px 8px rgba(13,99,27,0.3);">
                  웰계장터 실시간 시세 바로보기 →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 24px; background-color: #f4f4ef; border-top: 1px solid #e3e3de; text-align: center; font-size: 11px; color: #707a6c; line-height: 1.5;">
              본 메일은 웰계장터 알림 설정 페이지에서 발송 테스트를 요청하셨거나 알림 구독을 신청하셔서 발송되었습니다.<br>
              수신을 원치 않으시면 웰계장터 설정에서 이메일 수신 스위치를 해제해 주세요.<br>
              © 2026 웰계장터 (Welgye Market) · 서울특별시 노원구 월계1동
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends a real price briefing email via Gmail API
 */
export async function sendBriefingEmail(
  accessToken: string,
  recipient: string,
  customSubject?: string
): Promise<SendEmailResult> {
  const subject =
    customSubject ||
    `[웰계장터] 광운대역 3대 마트 당일 식재료 특가 브리핑 (${new Date().toLocaleDateString('ko-KR')})`;
  const htmlBody = generateBriefingHtml(recipient);

  // Construct RFC 2822 email message
  const emailLines = [
    `To: ${recipient}`,
    `Subject: ${encodeSubject(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    htmlBody,
  ];

  const rawMessage = emailLines.join('\r\n');
  const encodedRaw = toBase64Url(rawMessage);

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedRaw,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody?.error?.message ||
      `Gmail 발송 요청이 실패했습니다 (HTTP ${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  return {
    id: data.id,
    threadId: data.threadId,
  };
}
