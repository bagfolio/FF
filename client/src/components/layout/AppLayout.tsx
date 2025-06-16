// ARQUIVO ATUALIZADO: client/src/components/layout/AppLayout.tsx

import Navigation from "./Navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/loading-screen";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Usamos a opção 'protected' para futuramente habilitar o redirecionamento
  // para a página de login caso o usuário não esteja autenticado.
  const { user, isLoading } = useAuth({ protected: true });

  // Se o hook ainda está verificando o usuário ou se o usuário não foi encontrado
  // (o que, em modo DEV, nunca deve acontecer, mas é bom para produção),
  // mostramos a tela de carregamento.
  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  // Se o usuário foi verificado com sucesso, mostramos o layout da aplicação.
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-12"> {/* Aumentei um pouco o padding-top para mais respiro */}
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}