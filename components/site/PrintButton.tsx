'use client';

export default function PrintButton() {
  return (
    <button type="button" className="v1-pill no-print" onClick={() => window.print()}>
      Печать или PDF
      <i aria-hidden="true">↓</i>
    </button>
  );
}
