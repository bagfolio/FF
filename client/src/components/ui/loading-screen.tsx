export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <div className="text-center">
        <div className="relative">
          {/* Animated football with Brazilian colors */}
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-verde-brasil to-green-600 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amarelo-ouro to-yellow-500 animate-pulse animation-delay-100"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-azul-celeste to-blue-700 animate-pulse animation-delay-200"></div>
            <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 animate-spin" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
        <h2 className="mt-6 font-inter font-bold text-2xl bg-gradient-to-r from-verde-brasil via-amarelo-ouro to-azul-celeste bg-clip-text text-transparent animate-pulse">
          FUTEBOL FUTURO
        </h2>
        <div className="mt-4 flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-verde-brasil rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-amarelo-ouro rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-azul-celeste rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
}

// Add animation delay utility
if (typeof document !== 'undefined' && !document.querySelector('#loading-screen-styles')) {
  const style = document.createElement('style');
  style.id = 'loading-screen-styles';
  style.textContent = `
    .animation-delay-100 { animation-delay: 100ms; }
    .animation-delay-200 { animation-delay: 200ms; }
  `;
  document.head.appendChild(style);
}
