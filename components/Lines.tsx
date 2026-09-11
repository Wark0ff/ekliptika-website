import type { CSSProperties, ElementType } from 'react';

/** Заголовок, строки которого выезжают из-под маски при появлении в экране (data-reveal="lines"). */
export default function Lines({
  lines, as: Tag = 'h2', className, id,
}: { lines: string[]; as?: ElementType; className?: string; id?: string }) {
  return (
    <Tag className={className} data-reveal="lines" id={id}>
      {lines.map((l, i) => (
        <span className="ln" key={l}>
          <span style={{ '--i': i } as CSSProperties}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
