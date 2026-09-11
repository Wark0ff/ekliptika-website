import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/brand';

export const alt = `${SITE.brandFull}: строительство, реконструкция и отделка`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Генерируется по запросу: на Windows сборка @vercel/og падает на этапе build.
export const dynamic = 'force-dynamic';

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: '#0A0F1E', padding: 80, fontFamily: 'sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <path d="M15.5 22.5 A19 19 0 1 1 15.5 41.5" fill="none" stroke="#EDEBE6" strokeWidth="7" strokeLinecap="round" />
            <path d="M21 32 H37" stroke="#EDEBE6" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="32" cy="34" rx="29" ry="8.5" transform="rotate(-14 32 34)" fill="none" stroke="#C9A45C" strokeWidth="2.6" />
            <path d="M52 2.5 L53.7 8.3 L59.5 10 L53.7 11.7 L52 17.5 L50.3 11.7 L44.5 10 L50.3 8.3 Z" fill="#C9A45C" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#EDEBE6', fontSize: 38, fontWeight: 700, letterSpacing: 4 }}>ЭКЛИПТИКА</span>
            <span style={{ color: '#C9A45C', fontSize: 15, letterSpacing: 5, marginTop: 6 }}>ТЕХНОЛОГИИ ДЛЯ ДВИЖЕНИЯ ВПЕРЁД</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', color: '#EDEBE6', fontSize: 84, fontWeight: 300, lineHeight: 1 }}>
          <span>СТРОИМ</span>
          <span style={{ paddingLeft: 60 }}>ОТДЕЛЫВАЕМ</span>
          <span style={{ paddingLeft: 20 }}>СДАЁМ</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(237,235,230,0.66)', fontSize: 24 }}>
          <span>Москва и Московская область</span>
          <span style={{ color: '#C9A45C' }}>Гарантия 36 месяцев</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
