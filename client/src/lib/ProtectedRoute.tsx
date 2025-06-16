// ARQUIVO ATUALIZADO E SIMPLIFICADO: client/src/lib/ProtectedRoute.tsx

import React from 'react';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any;
}

// Este componente agora é um simples "passa-prato".
// Toda a lógica de auth e loading foi movida para o AppLayout, que o envolve.
export default function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
  return <Component {...rest} />;
}
