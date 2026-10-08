import React from 'react';
import { Database, CheckCircle2, HeartHandshake, Sparkles } from 'lucide-react';
import { DataSourceType } from '../types';

interface SourceBadgeProps {
  source: DataSourceType;
  detail?: string;
  size?: 'sm' | 'xs';
  showIcon?: boolean;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  detail,
  size = 'xs',
  showIcon = true,
  className = '',
}) => {
  const getBadgeStyle = () => {
    switch (source) {
      case '공공데이터 기준':
      case '공공데이터':
        return {
          label: '공공데이터 기준',
          bg: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
          Icon: Database,
          defaultTip: 'KAMIS 농수산물유통정보 등 공공데이터 공식 시세',
        };
      case '현장 확인':
        return {
          label: '현장 확인',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
          Icon: CheckCircle2,
          defaultTip: '월계1동 동네 마트 매장 방문 실측 확인 가격',
        };
      case '현장 확인·이웃 제보':
        return {
          label: '현장 확인·이웃 제보',
          bg: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
          Icon: CheckCircle2,
          defaultTip: '매장 방문 실측 및 주민 영수증 제보 확인',
        };
      case '이웃 제보':
        return {
          label: '이웃 제보',
          bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
          Icon: HeartHandshake,
          defaultTip: '월계1동 이웃 자취생 영수증 제보 검증',
        };
      case '시연용 예시':
      default:
        return {
          label: '시연용 예시',
          bg: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
          Icon: Sparkles,
          defaultTip: 'UI 시연을 위한 가상 데이터',
        };
    }
  };

  const { label, bg, Icon, defaultTip } = getBadgeStyle();
  const textClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-md border ${bg} ${textClass} select-none shrink-0 transition-colors cursor-help ${className}`}
      title={detail ? `[출처] ${label} (${detail})` : `[출처] ${defaultTip}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-2.5 h-2.5'} />}
      <span>{label}</span>
    </span>
  );
};
