type PreloaderProps = {
  isLoading: boolean;
};

export function Preloader({ isLoading }: PreloaderProps) {
  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,246,196,0.92))] transition duration-700 ${
        isLoading ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isLoading}
    >
      <div className="text-center">
        <p className="font-display text-4xl tracking-[0.45em] text-[#20304a] md:text-5xl">ARIA VALE</p>
        <div className="mx-auto mt-6 h-px w-44 overflow-hidden rounded-full bg-[#44ACFF]/16">
          <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] bg-[linear-gradient(90deg,#FE9EC7,#89D4FF,#44ACFF,#F9F6C4)]" />
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(240%);
          }
        }
      `}</style>
    </div>
  );
}
