/** Decorative organic wave used to separate page bands. */
export default function WaveDivider({
  className = '',
  fill = '#f3ebdd',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      className={`wave-divider ${className}`}
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0,24 C240,56 480,0 720,20 C960,40 1200,56 1440,20 L1440,48 L0,48 Z"
        fill={fill}
      />
    </svg>
  );
}
