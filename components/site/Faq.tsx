/** Вопросы и ответы: нативные details, открываются без JS. */
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="v1-acc">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
