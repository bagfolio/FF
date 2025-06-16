import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cinza-claro">
      <div className="text-center">
        <div className="w-20 h-20 bg-verde-brasil rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="font-bebas text-2xl azul-celeste mb-2">CARREGANDO...</h2>
        <p className="text-gray-600">Preparando sua experiência</p>
      </div>
    </div>
  );
}
