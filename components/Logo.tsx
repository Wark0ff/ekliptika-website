/** Знак «Эклиптики», перерисован по карточке предприятия: буква «Э» из разомкнутого круга,
 *  золотая орбита вместо перекладины, звезда над орбитой. Временный, до получения исходника.
 *  Цвета берутся из CSS-переменных концепта: --logo-ink (круг и надпись), --logo-gold (орбита, звезда). */
type Props = {
  size?: number;
  word?: boolean;
  tag?: boolean;
  className?: string;
};

export function Mark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M15.5 22.5 A19 19 0 1 1 15.5 41.5" fill="none" stroke="var(--logo-ink,#14234B)"
        strokeWidth="7" strokeLinecap="round" />
      <path d="M21 32 H37" stroke="var(--logo-ink,#14234B)" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="32" cy="34" rx="29" ry="8.5" transform="rotate(-14 32 34)" fill="none"
        stroke="var(--logo-gold,#C8913A)" strokeWidth="2.6" />
      <path d="M52 2.5 L53.7 8.3 L59.5 10 L53.7 11.7 L52 17.5 L50.3 11.7 L44.5 10 L50.3 8.3 Z"
        fill="var(--logo-gold,#C8913A)" />
    </svg>
  );
}

export default function Logo({ size = 44, word = true, tag = true, className }: Props) {
  return (
    <span className={['logo', className].filter(Boolean).join(' ')}
      style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.28 }}>
      <Mark size={size} />
      {word && (
        <span style={{ display: 'grid', lineHeight: 1 }}>
          <span className="logo-word" style={{ color: 'var(--logo-ink,#14234B)', fontWeight: 700,
            letterSpacing: '.02em', fontSize: size * 0.46 }}>ЭКЛИПТИКА</span>
          {tag && (
            <span className="logo-tag" style={{ color: 'var(--logo-gold,#C8913A)', fontWeight: 500,
              letterSpacing: '.06em', fontSize: size * 0.17, marginTop: size * 0.12 }}>
              ТЕХНОЛОГИИ ДЛЯ ДВИЖЕНИЯ ВПЕРЁД
            </span>
          )}
        </span>
      )}
      <span className="vh">Эклиптика</span>
    </span>
  );
}
