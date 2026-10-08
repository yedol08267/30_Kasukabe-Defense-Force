import React, { useState, useEffect } from 'react';
import {
  Radar,
  Inbox,
  Mail,
  Send,
  CheckCircle,
  MessageSquare,
  Bell,
  Clock,
  Calendar,
  Briefcase,
  Zap,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { AlertConfig, WishlistItem } from '../types';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logout as googleLogout,
  initAuth,
  getAccessToken,
} from '../services/googleAuth';
import { sendBriefingEmail } from '../services/gmail';
import {
  loginWithKakao,
  logoutKakao,
  getConnectedKakaoUser,
  sendBriefingToKakaoMemo,
  shareKakaoBriefing,
  KakaoUser,
  getKakaoAppKey,
  setKakaoAppKey,
  initKakao,
} from '../services/kakaoService';

interface AlertSettingsProps {
  config: AlertConfig;
  onSaveConfig: (newConfig: AlertConfig) => void;
  onResetConfig: () => void;
  wishlist: WishlistItem[];
  onShowToast: (msg: string) => void;
}

export const AlertSettings: React.FC<AlertSettingsProps> = ({
  config,
  onSaveConfig,
  onResetConfig,
  wishlist,
  onShowToast,
}) => {
  const [localConfig, setLocalConfig] = useState<AlertConfig>({ ...config });
  const [testMailSending, setTestMailSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSendConfirmModal, setShowSendConfirmModal] = useState(false);
  const [lastSentInfo, setLastSentInfo] = useState<{ time: string; recipient: string } | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // KakaoTalk States
  const [kakaoUser, setKakaoUser] = useState<KakaoUser | null>(() => getConnectedKakaoUser());
  const [isKakaoLoggingIn, setIsKakaoLoggingIn] = useState(false);
  const [kakaoSending, setKakaoSending] = useState(false);
  const [showKakaoConfirmModal, setShowKakaoConfirmModal] = useState(false);
  const [kakaoSendTarget, setKakaoSendTarget] = useState<'memo' | 'share'>('memo');
  const [lastKakaoSentInfo, setLastKakaoSentInfo] = useState<{ time: string; target: string } | null>(null);
  const [showKakaoKeySetting, setShowKakaoKeySetting] = useState(false);
  const [customKakaoKey, setCustomKakaoKey] = useState(() => getKakaoAppKey());

  // Monitor Google Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        setHasGoogleAuth(true);
        if (
          user.email &&
          (!localConfig.emailAddress ||
            localConfig.emailAddress === 'minji.kwangwoon@gmail.com')
        ) {
          setLocalConfig((prev) => ({
            ...prev,
            emailAddress: user.email || prev.emailAddress,
          }));
        }
      },
      () => {
        setCurrentUser(null);
        setHasGoogleAuth(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleMasterToggle = () => {
    const updated = { ...localConfig, masterActive: !localConfig.masterActive };
    setLocalConfig(updated);
    onShowToast(
      updated.masterActive
        ? '매일 아침 특가 브리핑 자동 발송이 활성화되었습니다.'
        : '알림 발송이 일시정지되었습니다.'
    );
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    onShowToast('알림 설정이 성공적으로 저장되었습니다! 내일 아침 08:30에 첫 브리핑이 발송됩니다.');
  };

  const handleReset = () => {
    onResetConfig();
    onShowToast('설정이 기본값으로 초기화되었습니다.');
  };

  // Google Sign-In
  const handleGoogleConnect = async () => {
    setIsLoggingIn(true);
    setSendError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setHasGoogleAuth(true);
        if (res.user.email) {
          setLocalConfig((prev) => ({
            ...prev,
            emailAddress: res.user.email || prev.emailAddress,
          }));
        }
        onShowToast(`Google 계정(${res.user.email})이 성공적으로 연동되었습니다!`);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      onShowToast(`Google 계정 연동 실패: ${err.message || '인증이 취소되었거나 오류가 발생했습니다.'}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    try {
      await googleLogout();
      setCurrentUser(null);
      setHasGoogleAuth(false);
      onShowToast('Google 계정 연동이 해제되었습니다.');
    } catch (err: any) {
      console.error('Google Logout Error:', err);
    }
  };

  // Triggers sending flow: validate -> check auth -> prompt confirmation
  const handleSendTestMail = async () => {
    const email = (localConfig.emailAddress || '').trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      onShowToast('수신받으실 유효한 이메일 주소를 입력해 주세요.');
      return;
    }

    const token = await getAccessToken();
    if (!token || !currentUser) {
      setIsLoggingIn(true);
      try {
        const res = await googleSignIn();
        if (res) {
          setCurrentUser(res.user);
          setHasGoogleAuth(true);
          setShowSendConfirmModal(true);
        }
      } catch (err: any) {
        console.error('Google login cancelled or failed:', err);
        onShowToast('실제 이메일을 발송하려면 Google 계정 로그인이 필요합니다.');
      } finally {
        setIsLoggingIn(false);
      }
      return;
    }

    // Explicit confirmation modal required by Workspace integration guidelines
    setShowSendConfirmModal(true);
  };

  // Executes actual sending via Gmail API
  const handleConfirmSendEmail = async () => {
    const token = await getAccessToken();
    if (!token) {
      setShowSendConfirmModal(false);
      onShowToast('Google 계정 인증이 만료되었습니다. 다시 로그인해 주세요.');
      return;
    }

    setTestMailSending(true);
    setSendError(null);
    try {
      await sendBriefingEmail(token, localConfig.emailAddress.trim());
      const nowStr = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSentInfo({
        time: nowStr,
        recipient: localConfig.emailAddress.trim(),
      });
      setShowSendConfirmModal(false);
      onShowToast(
        `[실제 발송 완료] ${localConfig.emailAddress} 으로 Gmail 특가 브리핑 메일이 전송되었습니다! Gmail 받은편지함을 확인해 보세요.`
      );
    } catch (err: any) {
      console.error('Gmail send error:', err);
      setSendError(err.message || '메일 발송 중 오류가 발생했습니다.');
      onShowToast(`발송 실패: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setTestMailSending(false);
    }
  };

  const getRadiusText = (meters: number) => {
    if (meters <= 400) return `집 앞 초근접 (${meters}m, 골목가게 2곳)`;
    if (meters <= 1000) return `도보 10분권 (${meters}m, 광운대·석계역 7곳)`;
    return `월계·공릉 광역 (${(meters / 1000).toFixed(1)}km, 대형마트 포함)`;
  };

  // Kakao Connection Handlers
  const handleKakaoConnect = async () => {
    setIsKakaoLoggingIn(true);
    try {
      const user = await loginWithKakao();
      setKakaoUser(user);
      setLocalConfig((prev) => ({ ...prev, kakaoEnabled: true, kakaoLinked: true }));
      onShowToast(`카카오 계정(${user.nickname}님)이 성공적으로 연동되었습니다!`);
    } catch (err: any) {
      console.error('Kakao login error:', err);
      onShowToast(`카카오 연동 실패: ${err.message || '인증이 취소되었거나 오류가 발생했습니다.'}`);
    } finally {
      setIsKakaoLoggingIn(false);
    }
  };

  const handleKakaoDisconnect = async () => {
    await logoutKakao();
    setKakaoUser(null);
    setLocalConfig((prev) => ({ ...prev, kakaoLinked: false }));
    onShowToast('카카오 계정 연동이 해제되었습니다.');
  };

  const handleTriggerKakaoSend = (mode: 'memo' | 'share') => {
    setKakaoSendTarget(mode);
    setShowKakaoConfirmModal(true);
  };

  const handleConfirmSendKakao = async () => {
    setKakaoSending(true);
    try {
      let result;
      if (kakaoSendTarget === 'memo' && kakaoUser) {
        result = await sendBriefingToKakaoMemo();
      } else {
        result = await shareKakaoBriefing();
      }

      const nowStr = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastKakaoSentInfo({
        time: nowStr,
        target: kakaoSendTarget === 'memo' ? '카카오톡 나와의 채팅' : '카카오톡 대화상대',
      });
      setShowKakaoConfirmModal(false);
      onShowToast(`[카카오톡 발송 성공] ${result.message}`);
    } catch (err: any) {
      console.error('Kakao send error:', err);
      onShowToast(`카카오톡 발송 실패: ${err.message || '오류가 발생했습니다.'}`);
    } finally {
      setKakaoSending(false);
    }
  };

  const handleSaveCustomKey = () => {
    setKakaoAppKey(customKakaoKey);
    setShowKakaoKeySetting(false);
    onShowToast('카카오 JavaScript 키가 성공적으로 설정되었습니다.');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-20">
      {/* Top Banner with Master Switch */}
      <section className="w-full bg-gradient-to-r from-[#f4f4ef] via-[#eeeee9] to-[#f4f4ef] rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[#e3e3de] shadow-xs">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-[#a3f69c]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-[#ffdbd1]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-14 h-14 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center shadow-md shrink-0">
              <Radar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold bg-[#0d631b] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI PRICE RADAR
                </span>
                <span className="text-xs font-bold text-[#0d631b]">
                  동네 마트 오픈 전, AI가 가격을 비교해 배달해 드려요
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a1c19] tracking-tight">
                광운대 원룸촌 맞춤형 신선식품 & 마감 세일 스마트 알림 레이더
              </h1>
              <p className="text-xs text-[#40493d] leading-relaxed">
                자취생과 1인 가구 장바구니에 꼭 맞는 소분 규격만 골라, 매일 아침 문앞까지 소식을 배달하듯 카카오톡·이메일·텔레그램으로 신선하게 브리핑합니다.
              </p>
            </div>
          </div>

          {/* Master Toggle Box */}
          <div className="bg-white px-5 py-3.5 rounded-2xl shadow-xs flex items-center justify-between gap-4 shrink-0 self-start lg:self-center border border-[#e3e3de]">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1a1c19]">매일 특가 브리핑 자동 발송</span>
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  localConfig.masterActive ? 'text-[#0d631b]' : 'text-[#707a6c]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    localConfig.masterActive ? 'bg-[#0d631b] animate-pulse' : 'bg-[#707a6c]'
                  }`}
                />
                {localConfig.masterActive ? '현재 활성화 중 (ON)' : '발송 일시정지 (OFF)'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleMasterToggle}
              className={`w-12 h-7 rounded-full transition-colors relative flex items-center px-0.5 focus:outline-none ${
                localConfig.masterActive ? 'bg-[#0d631b]' : 'bg-[#e3e3de]'
              }`}
            >
              <span
                className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform flex items-center justify-center ${
                  localConfig.masterActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <Bell
                  className={`w-3.5 h-3.5 ${
                    localConfig.masterActive ? 'text-[#0d631b]' : 'text-[#707a6c]'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Channels & Frequencies (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Channels */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e3e3de] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[#0d631b]" />
                <h2 className="font-extrabold text-base text-[#1a1c19]">
                  1. 어디로 소식을 받을까요? (수신 채널)
                </h2>
              </div>
              <span className="text-[11px] text-[#707a6c]">복수 선택 가능</span>
            </div>

            {/* Email Channel */}
            <div className="bg-[#f4f4ef] p-4 rounded-2xl border border-[#e3e3de] space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.emailEnabled}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, emailEnabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#0d631b] cursor-pointer"
                  />
                  <span className="font-bold text-xs text-[#1a1c19]">이메일 리포트</span>
                  <span className="text-[10px] bg-[#a3f69c] text-[#002204] font-bold px-2 py-0.5 rounded-full">
                    Gmail 공식 연동
                  </span>
                </label>
                {hasGoogleAuth ? (
                  <span className="text-[11px] text-[#0d631b] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Gmail 발송 준비완료
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Google 연결 필요
                  </span>
                )}
              </div>

              {/* Google OAuth Status / Connect Button */}
              {!hasGoogleAuth ? (
                <div className="p-3 bg-white rounded-xl border border-[#e3e3de] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#1a1c19] flex items-center gap-1.5">
                      <span>실제 발송을 위한 Gmail 연동</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                        연결 대기
                      </span>
                    </div>
                    <p className="text-[11px] text-[#707a6c]">
                      사용자의 허가를 받아(with permission) Gmail을 통해 실제 브리핑 메일이 발송됩니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleConnect}
                    disabled={isLoggingIn}
                    className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-[#f8f9fa] active:bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0] rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-4 h-4 shrink-0"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    <span>{isLoggingIn ? '연결 중...' : 'Google 계정으로 연동하기'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-[#eef8ed] rounded-xl border border-[#a3f69c]/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Google"
                        className="w-6 h-6 rounded-full border border-[#0d631b]/30 shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#0d631b] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        G
                      </div>
                    )}
                    <div className="text-xs truncate">
                      <span className="font-bold text-[#0d631b]">Gmail 연동됨: </span>
                      <span className="text-[#1a1c19] font-semibold">{currentUser?.email}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleDisconnect}
                    className="text-[11px] text-[#707a6c] hover:text-[#b02e00] underline font-medium cursor-pointer shrink-0"
                  >
                    연동 해제
                  </button>
                </div>
              )}

              {/* Email Input & Send Action */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 w-full flex items-center bg-white px-3 py-2 rounded-xl border border-[#e3e3de]">
                  <Mail className="w-4 h-4 text-[#707a6c] mr-2 shrink-0" />
                  <input
                    type="email"
                    value={localConfig.emailAddress}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, emailAddress: e.target.value })
                    }
                    placeholder="수신 이메일 주소 입력 (예: name@gmail.com)"
                    className="bg-transparent text-xs text-[#1a1c19] outline-none w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendTestMail}
                  disabled={testMailSending || isLoggingIn}
                  className="w-full sm:w-auto px-4 py-2 bg-[#0d631b] hover:bg-[#127f26] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  title="지금 즉시 입력한 이메일로 실시간 식재료 특가 브리핑을 발송합니다"
                >
                  {testMailSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Gmail 발송 중...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>실제 발송 테스트 메일 보내기</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sent Status Message */}
              {lastSentInfo && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>실제 발송 완료!</strong> {lastSentInfo.recipient} 계정으로 메일이 전송되었습니다 ({lastSentInfo.time}). Gmail 수신함 및 스팸함을 확인해 주세요!
                  </span>
                </div>
              )}
            </div>

            {/* KakaoTalk Channel */}
            <div className="bg-[#fffdf2] p-4 rounded-2xl border border-[#FEE500]/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.kakaoEnabled}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, kakaoEnabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#3c1e1e] cursor-pointer"
                  />
                  <span className="font-bold text-xs text-[#1a1c19] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#FEE500] text-[#191919] flex items-center justify-center font-black text-[9px]">
                      K
                    </span>
                    카카오톡 실시간 알림
                  </span>
                  <span className="text-[10px] bg-[#FEE500] text-[#191919] font-extrabold px-2 py-0.5 rounded-full">
                    실제 발송 지원
                  </span>
                </label>
                {kakaoUser ? (
                  <span className="text-[11px] text-[#0d631b] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 나와의 채팅 연동됨
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> 카카오 연결 대기
                  </span>
                )}
              </div>

              {/* Kakao Account Status / Connect Button */}
              {!kakaoUser ? (
                <div className="p-3 bg-white rounded-xl border border-[#FEE500]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#1a1c19] flex items-center gap-1.5">
                      <span>카카오 계정으로 간편 연결</span>
                      <span className="text-[10px] bg-yellow-100 text-yellow-900 px-1.5 py-0.5 rounded font-semibold">
                        1초 연동
                      </span>
                    </div>
                    <p className="text-[11px] text-[#707a6c]">
                      카카오 계정을 연동하면 내 카카오톡(나와의 채팅)으로 광운대역 마트 당일 특가 카드를 즉시 발송할 수 있습니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleKakaoConnect}
                    disabled={isKakaoLoggingIn}
                    className="w-full sm:w-auto px-4 py-2 bg-[#FEE500] hover:bg-[#FADA0A] active:bg-[#e4cb00] text-[#191919] rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054-.188.702-.68 2.545-.78 2.94-.12.482.176.475.37.346.154-.102 2.45-1.666 3.442-2.342.56.082 1.134.125 1.698.125 4.97 0 9-3.185 9-7.123C21 6.185 16.97 3 12 3z" />
                    </svg>
                    <span>{isKakaoLoggingIn ? '연결 중...' : '카카오로 1초 연동하기'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-white rounded-xl border border-[#FEE500] flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    {kakaoUser.profileImageUrl ? (
                      <img
                        src={kakaoUser.profileImageUrl}
                        alt="Kakao"
                        className="w-6 h-6 rounded-full border border-yellow-300 shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#FEE500] text-[#191919] text-[10px] font-black flex items-center justify-center shrink-0">
                        K
                      </div>
                    )}
                    <div className="text-xs truncate">
                      <span className="font-bold text-amber-900">카카오 연동 완료: </span>
                      <span className="text-[#1a1c19] font-bold">{kakaoUser.nickname}님</span>
                      <span className="text-[10px] text-[#707a6c] ml-1.5">({kakaoUser.connectedAt})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleKakaoDisconnect}
                    className="text-[11px] text-[#707a6c] hover:text-[#b02e00] underline font-medium cursor-pointer shrink-0"
                  >
                    연동 해제
                  </button>
                </div>
              )}

              {/* Send Actions: Direct Send & Share */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleTriggerKakaoSend('memo')}
                  disabled={kakaoSending}
                  className="w-full sm:flex-1 px-4 py-2 bg-[#FEE500] hover:bg-[#FADA0A] active:bg-[#e4cb00] text-[#191919] text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="내 카카오톡 나와의 채팅방으로 당일 특가 브리핑을 즉시 전송합니다"
                >
                  {kakaoSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>카카오톡 전송 중...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054-.188.702-.68 2.545-.78 2.94-.12.482.176.475.37.346.154-.102 2.45-1.666 3.442-2.342.56.082 1.134.125 1.698.125 4.97 0 9-3.185 9-7.123C21 6.185 16.97 3 12 3z" />
                      </svg>
                      <span>카카오톡 나와의 채팅으로 보내기</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerKakaoSend('share')}
                  disabled={kakaoSending}
                  className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-[#f9f9f5] border border-[#d6d6cf] text-[#191919] text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title="카카오톡 친구 또는 단톡방에 식재료 특가 브리핑을 공유합니다"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#555]" />
                  <span>카카오톡 공유창 열기</span>
                </button>
              </div>

              {/* Last Sent Status Message */}
              {lastKakaoSentInfo && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>카카오톡 전송 완료!</strong> {lastKakaoSentInfo.target} ({lastKakaoSentInfo.time}). 카카오톡에서 전송된 브리핑 카드를 확인해 보세요!
                  </span>
                </div>
              )}

              {/* Custom App Key Toggle Drawer (Optional) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowKakaoKeySetting(!showKakaoKeySetting)}
                  className="text-[11px] text-[#707a6c] hover:text-[#1a1c19] flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  <span>카카오 JavaScript 키 직접 설정 (선택사항)</span>
                </button>

                {showKakaoKeySetting && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-[#e3e3de] space-y-2 text-xs">
                    <p className="text-[11px] text-[#707a6c]">
                      기본 카카오 앱 키가 활성화되어 있습니다. 본인의 카카오 개발자 콘솔(developers.kakao.com) JavaScript 키를 사용하시려면 입력하세요.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customKakaoKey}
                        onChange={(e) => setCustomKakaoKey(e.target.value)}
                        placeholder="32자리 카카오 JavaScript Key 입력"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#e3e3de] text-xs outline-none focus:border-[#0d631b]"
                      />
                      <button
                        type="button"
                        onClick={handleSaveCustomKey}
                        className="px-3 py-1.5 bg-[#1a1c19] text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        적용
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Telegram Channel */}
            <div className="bg-[#f4f4ef] p-4 rounded-2xl border border-[#e3e3de] space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.telegramEnabled}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, telegramEnabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#0d631b] cursor-pointer"
                  />
                  <span className="font-bold text-xs text-[#1a1c19]">텔레그램 즉시 알림봇</span>
                  <span className="text-[10px] bg-[#eef8ed] text-[#0d631b] border border-[#a3f69c]/60 font-bold px-2 py-0.5 rounded-full">
                    초특가 추천
                  </span>
                </label>
                <span className="text-[11px] text-[#0d631b] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> @wolgye_mart_bot 연결됨
                </span>
              </div>

              <div className="pl-6 space-y-1.5">
                <p className="text-[11px] text-[#40493d]">
                  마트별 당일 한정 타임세일 발생 시 3초 이내에 텔레그램 메신저로 핑(Ping)이 울립니다.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={localConfig.includeMapLink}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, includeMapLink: e.target.checked })
                    }
                    className="w-3.5 h-3.5 rounded accent-[#0d631b]"
                  />
                  <span className="text-xs text-[#1a1c19] font-medium">
                    알림 메시지에 '월계동 마트 카카오맵 길찾기 바로가기' 포함
                  </span>
                </label>
              </div>
            </div>

            {/* Web Push Channel */}
            <div className="bg-[#f4f4ef] p-4 rounded-2xl border border-[#e3e3de] flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localConfig.webPushEnabled}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, webPushEnabled: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-[#0d631b] cursor-pointer"
                />
                <div>
                  <div className="font-bold text-xs text-[#1a1c19]">
                    데스크톱 브라우저 / 모바일 웹 푸시
                  </div>
                  <div className="text-[11px] text-[#707a6c]">
                    브라우저가 켜져 있을 때 화면 우측 하단 팝업 통지
                  </div>
                </div>
              </label>
              <span className="text-[11px] text-[#707a6c] bg-white border border-[#e3e3de] px-2 py-0.5 rounded-md">
                권한 승인 대기중
              </span>
            </div>
          </div>

          {/* Section 2: Frequency & Time Slot */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e3e3de] space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0d631b]" />
              <h2 className="font-extrabold text-base text-[#1a1c19]">
                2. 언제 받아볼까요? (주기 및 시간)
              </h2>
            </div>

            {/* Frequency Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-[#1a1c19]">발송 빈도 선택</label>
              <div className="grid grid-cols-3 gap-2 bg-[#f4f4ef] p-1.5 rounded-2xl border border-[#e3e3de]">
                <button
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, frequency: 'daily' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    localConfig.frequency === 'daily'
                      ? 'bg-white text-[#0d631b] shadow-xs'
                      : 'text-[#40493d] hover:text-[#1a1c19]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>매일 아침</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, frequency: 'weekdays' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    localConfig.frequency === 'weekdays'
                      ? 'bg-white text-[#0d631b] shadow-xs'
                      : 'text-[#40493d] hover:text-[#1a1c19]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>주중(월~금)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, frequency: 'instant' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    localConfig.frequency === 'instant'
                      ? 'bg-white text-[#0d631b] shadow-xs'
                      : 'text-[#40493d] hover:text-[#1a1c19]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>특가 발생 즉시</span>
                </button>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#eeeee9]">
              <div>
                <span className="font-bold text-xs text-[#1a1c19]">정기 브리핑 시간대</span>
                <p className="text-[11px] text-[#707a6c]">
                  광운대역 등교 및 마트 개점(09:30~10:00) 전 골든타임
                </p>
              </div>
              <select
                value={localConfig.timeSlot}
                onChange={(e) => setLocalConfig({ ...localConfig, timeSlot: e.target.value })}
                className="bg-[#f4f4ef] text-xs font-bold text-[#1a1c19] px-3.5 py-2.5 rounded-xl border border-[#e3e3de] outline-none cursor-pointer"
              >
                <option value="08:00">오전 08:00 (초단기 얼리버드)</option>
                <option value="08:30">오전 08:30 (등교·출근 골든타임 ★)</option>
                <option value="09:00">오전 09:00 (마트 오픈 직전)</option>
                <option value="18:30">오후 06:30 (퇴근길 마감세일 겨냥)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Filters & Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 3: Smart Filters */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e3e3de] space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0d631b]" />
              <h2 className="font-extrabold text-base text-[#1a1c19]">
                3. 스마트 필터링 조건
              </h2>
            </div>

            {/* Solo Portion Filter */}
            <label className="p-3.5 bg-[#f4f4ef] rounded-2xl flex items-start gap-3 cursor-pointer hover:bg-[#eeeee9] transition-colors border border-[#e3e3de]">
              <input
                type="checkbox"
                checked={localConfig.onlySinglePortion}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, onlySinglePortion: e.target.checked })
                }
                className="w-4 h-4 rounded accent-[#0d631b] mt-0.5 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#1a1c19] flex items-center gap-1.5">
                  1인 가구 소량·단품 전용 필터
                  <span className="text-[10px] bg-[#a3f69c] text-[#002204] font-bold px-1.5 py-0.2 rounded-full">
                    필수
                  </span>
                </span>
                <span className="text-[11px] text-[#40493d] mt-0.5">
                  10kg 쌀가마니, 1박스 대용량 채소 제외. 1개입/소포장 특가만 추출
                </span>
              </div>
            </label>

            {/* Minimum Discount Filter */}
            <label className="p-3.5 bg-[#f4f4ef] rounded-2xl flex items-start gap-3 cursor-pointer hover:bg-[#eeeee9] transition-colors border border-[#e3e3de]">
              <input
                type="checkbox"
                checked={localConfig.minDiscountOnly}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, minDiscountOnly: e.target.checked })
                }
                className="w-4 h-4 rounded accent-[#0d631b] mt-0.5 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#1a1c19] flex items-center gap-1.5">
                  25% 이상 세일 또는 역대 최저가만
                  <span className="text-[10px] bg-[#eef8ed] text-[#0d631b] border border-[#a3f69c]/60 font-bold px-1.5 py-0.2 rounded-full">
                    강력추천
                  </span>
                </span>
                <span className="text-[11px] text-[#40493d] mt-0.5">
                  형식적인 3~5% 할인 정보로 인한 알림 피로를 방지합니다.
                </span>
              </div>
            </label>

            {/* Mart Radius Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1a1c19]">비교 대상 마트 탐색 반경</span>
                <span className="font-bold text-[#0d631b]">
                  {getRadiusText(localConfig.radiusMeters)}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="2000"
                step="100"
                value={localConfig.radiusMeters}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, radiusMeters: parseInt(e.target.value, 10) })
                }
                className="w-full h-2 bg-[#eeeee9] rounded-lg appearance-none cursor-pointer accent-[#0d631b]"
              />
              <div className="flex justify-between text-[10px] text-[#707a6c] px-0.5">
                <span>집 앞 (300m)</span>
                <span>광운대·석계역 7곳 (800m)</span>
                <span>월계·공릉 (2km)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Tomorrow Morning Simulation Preview */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e3e3de] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1a1c19]">내일 아침 발송 프리뷰</h3>
              <span className="text-[10px] bg-[#0d631b]/10 text-[#0d631b] font-bold px-2 py-0.5 rounded-full">
                D-1 내일 {localConfig.timeSlot} 발송 대기
              </span>
            </div>

            {/* Mock Telegram / Push Card */}
            <div className="bg-[#f4f4ef] rounded-2xl p-4 border border-[#e3e3de] space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 font-bold text-[#1a1c19]">
                  <span className="w-2 h-2 rounded-full bg-[#0d631b]" />
                  <span>[월계장터] 내일의 원룸 장바구니 리포트</span>
                </div>
                <span className="text-[#707a6c]">내일 {localConfig.timeSlot} 예정</span>
              </div>

              <p className="text-xs text-[#40493d] leading-relaxed">
                민지님, 찜해두신 식재료 중 <strong>3개 품목</strong>이 역대 최저가 범위에 진입했습니다!
              </p>

              {/* Mini Item List */}
              <div className="space-y-1.5 text-xs">
                <div className="bg-white p-2 rounded-xl flex items-center justify-between border border-[#eeeee9]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1a1c19]">
                    <span>손질 햇양파 (소포장 2입)</span>
                    <span className="text-[10px] bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] px-1.5 py-0.2 rounded font-bold">-39%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0d631b]">1,200원</span>
                    <span className="text-[10px] text-[#707a6c] block">석계 알뜰청과</span>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl flex items-center justify-between border border-[#eeeee9]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1a1c19]">
                    <span>무항생제 신선 대란 10구</span>
                    <span className="text-[10px] bg-[#eef8ed] text-[#0d631b] border border-[#a3f69c] px-1.5 py-0.2 rounded font-bold">-28%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0d631b]">2,790원</span>
                    <span className="text-[10px] text-[#707a6c] block">월계 화랑마트</span>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl flex items-center justify-between border border-[#eeeee9]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1a1c19]">
                    <span>국산 찌개용 부침두부 1모</span>
                    <span className="text-[10px] bg-[#a3f69c] text-[#002204] px-1 rounded">-32%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0d631b]">990원</span>
                    <span className="text-[10px] text-[#707a6c] block">월계 화랑마트</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e3e3de] flex items-center justify-between text-[11px] text-[#40493d]">
                <span>총 예상 절약액: <strong>2,340원 (이마트 대비)</strong></span>
                {localConfig.includeMapLink && (
                  <span className="text-[#0d631b] font-bold flex items-center gap-0.5">
                    길찾기 링크 포함됨 <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#707a6c]">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>내일 오전 실제 수집 공공데이터 시세에 따라 품목 및 할인율이 반영됩니다.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Toolbar */}
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl p-4 shadow-lg border border-[#e3e3de] flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#a3f69c] text-[#002204] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#0d631b]" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-[#1a1c19]">
              변경된 알림 설정 내용이 즉시 레이더 시스템에 반영됩니다.
            </div>
            <div className="text-[11px] text-[#707a6c]">마지막 수정: 오늘 오후 3:12 (광운대역 기준)</div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#f4f4ef] hover:bg-[#eeeee9] text-[#707a6c] font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 초기화</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#0d631b] hover:bg-[#127f26] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>알림 설정 저장하기</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Sending Email (Workspace Integration Requirement) */}
      {showSendConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3e3de] space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0d631b]/10 text-[#0d631b] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#1a1c19]">
                  당일 특가 브리핑 메일 발송 확인
                </h3>
                <p className="text-xs text-[#707a6c]">
                  Google Gmail API를 통해 실제 이메일이 발송됩니다.
                </p>
              </div>
            </div>

            <div className="bg-[#f4f4ef] rounded-2xl p-4 border border-[#e3e3de] space-y-2.5 text-xs text-[#40493d]">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-[#1a1c19] shrink-0">수신 이메일:</span>
                <span className="font-bold text-[#0d631b] break-all text-right">
                  {localConfig.emailAddress}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-[#1a1c19] shrink-0">발송 계정:</span>
                <span className="font-medium text-[#40493d] break-all text-right">
                  {currentUser?.email} (Gmail 연동)
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-[#1a1c19] shrink-0">메일 제목:</span>
                <span className="font-medium text-[#1a1c19] text-right">
                  [웰계장터] 광운대역 3대 마트 당일 식재료 특가 브리핑
                </span>
              </div>
              <div className="pt-2 border-t border-[#e3e3de] text-[11px] text-[#707a6c] leading-relaxed">
                💡 <strong>공공데이터(오전 06:00)</strong> 및 <strong>골목마트 현장 확인(오전 08:30)</strong> 실측 기반 계란·두부·대파 당일 최저가 리포트가 전송됩니다.
              </div>
            </div>

            {sendError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{sendError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSendConfirmModal(false);
                  setSendError(null);
                }}
                disabled={testMailSending}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#e3e3de] text-[#40493d] hover:bg-[#f4f4ef] font-semibold text-xs transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmSendEmail}
                disabled={testMailSending}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0d631b] hover:bg-[#127f26] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {testMailSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>발송 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>확인 및 메일 발송하기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal for Kakao Briefing */}
      {showKakaoConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3e3de] space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FEE500] text-[#191919] flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054-.188.702-.68 2.545-.78 2.94-.12.482.176.475.37.346.154-.102 2.45-1.666 3.442-2.342.56.082 1.134.125 1.698.125 4.97 0 9-3.185 9-7.123C21 6.185 16.97 3 12 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#1a1c19]">
                  카카오톡 특가 브리핑 발송 확인
                </h3>
                <p className="text-xs text-[#707a6c]">
                  카카오톡 메시지로 오늘 마트 최저가 요약 카드가 전송됩니다.
                </p>
              </div>
            </div>

            {/* Kakao Card Preview Box */}
            <div className="bg-[#fffdf2] rounded-2xl p-4 border border-[#FEE500] space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-yellow-200">
                <span className="font-bold text-[#191919]">전송 대상:</span>
                <span className="font-bold text-amber-900">
                  {kakaoSendTarget === 'memo' && kakaoUser
                    ? `카카오톡 "나와의 채팅" (${kakaoUser.nickname}님)`
                    : '카카오톡 대화상대 / 나와의 채팅 선택'}
                </span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-yellow-200 space-y-2 shadow-xs">
                <div className="text-[11px] font-extrabold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>[월계장터] 광운대역 3대 마트 당일 특가 브리핑</span>
                </div>
                <div className="space-y-1 text-xs text-[#333]">
                  <div className="flex justify-between font-medium">
                    <span>• 애호박 1개 (월계화랑마트)</span>
                    <strong className="text-[#0d631b]">990원 (-38%)</strong>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>• 국내산 삼겹살 100g (이마트)</span>
                    <strong className="text-[#0d631b]">1,380원 (-28%)</strong>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>• 대파 1단 (공릉도깨비시장)</span>
                    <strong className="text-[#0d631b]">1,780원</strong>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>• 신선란 15구 (월계화랑마트)</span>
                    <strong className="text-[#0d631b]">3,980원</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#707a6c]">
                  <span>장바구니 4종 합계:</span>
                  <span className="font-extrabold text-[#1a1c19]">8,130원 (전일比 -2,850원)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#707a6c] leading-relaxed">
                💬 <strong>[확인 및 카카오톡 전송]</strong>을 누르면 카카오톡 앱 또는 공유창이 연결되어 실시간 특가 메시지 카드가 전송됩니다.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowKakaoConfirmModal(false)}
                disabled={kakaoSending}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#e3e3de] text-[#40493d] hover:bg-[#f4f4ef] font-semibold text-xs transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmSendKakao}
                disabled={kakaoSending}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FEE500] hover:bg-[#FADA0A] active:bg-[#e4cb00] text-[#191919] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {kakaoSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>전송 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.708 4.8 4.27 6.054-.188.702-.68 2.545-.78 2.94-.12.482.176.475.37.346.154-.102 2.45-1.666 3.442-2.342.56.082 1.134.125 1.698.125 4.97 0 9-3.185 9-7.123C21 6.185 16.97 3 12 3z" />
                    </svg>
                    <span>확인 및 카카오톡 전송</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
