import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export default function TestPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Get current user
      const userRes = await fetch('/api/auth/user');
      results.currentUser = {
        status: userRes.status,
        data: await userRes.json()
      };

      // Test 2: Set user type to athlete
      const setAthleteRes = await apiRequest('POST', '/api/auth/user-type', { userType: 'athlete' });
      results.setAthlete = {
        status: setAthleteRes.status,
        data: await setAthleteRes.json()
      };

      // Test 3: Get athlete profile
      const athleteRes = await fetch('/api/athletes/me');
      results.athleteProfile = {
        status: athleteRes.status,
        data: await athleteRes.json()
      };

      // Test 4: Get all athletes
      const athletesRes = await fetch('/api/athletes');
      const athletesData = await athletesRes.json();
      results.allAthletes = {
        status: athletesRes.status,
        count: athletesData.length,
        sample: athletesData.slice(0, 3)
      };

      // Test 5: Get tests
      const testsRes = await fetch('/api/tests/athlete/1');
      results.tests = {
        status: testsRes.status,
        data: await testsRes.json()
      };

      // Test 6: Set user type to scout
      const setScoutRes = await apiRequest('POST', '/api/auth/user-type', { userType: 'scout' });
      results.setScout = {
        status: setScoutRes.status,
        data: await setScoutRes.json()
      };

      // Test 7: Get scout profile
      const scoutRes = await fetch('/api/scouts/me');
      results.scoutProfile = {
        status: scoutRes.status,
        data: await scoutRes.json()
      };

    } catch (error: any) {
      results.error = error.message;
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-cinza-claro p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-bebas text-4xl azul-celeste mb-8">Sistema de Testes - Revela</h1>
        
        {/* Current Auth State */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estado Atual da Autenticação</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify({ user, isLoading, isAuthenticated }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Test Runner */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Testar Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="btn-primary mb-4"
            >
              {testing ? "Testando..." : "Executar Todos os Testes"}
            </Button>
            
            {Object.keys(testResults).length > 0 && (
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline"
                onClick={() => setLocation('/')}
              >
                Landing Page
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/home')}
              >
                Home (Seleção)
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/athlete/dashboard')}
              >
                Dashboard Atleta
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/scout/dashboard')}
              >
                Dashboard Scout
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/auth/welcome')}
              >
                Onboarding Flow
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/scout/search')}
              >
                Busca Scout
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/trust-pyramid-demo')}
              >
                Pirâmide Demo
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Recarregar
              </Button>
              <Button 
                variant="outline"
                className="text-red-600"
                onClick={() => {
                  // Clear all storage except critical auth data
                  const authToken = localStorage.getItem('authToken');
                  localStorage.clear();
                  sessionStorage.clear();
                  if (authToken) {
                    localStorage.setItem('authToken', authToken);
                  }
                  window.location.reload();
                }}
              >
                Limpar Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}