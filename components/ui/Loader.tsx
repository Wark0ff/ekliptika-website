


export default function Loader({
  size = 8,
  color,
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label="Загрузка"
      className={`inline-flex items-center ${className}`}
      style={{ gap: size * 0.7 }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="ekl-dot"
          style={{
            width: size,
            height: size,
            animationDelay: `${-0.3 + i * 0.2}s`,
            ...(color ? { backgroundColor: color } : {}),
          }}
        />
      ))}
    </span>
  );
}
