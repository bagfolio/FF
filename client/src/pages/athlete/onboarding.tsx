import Navigation from "@/components/layout/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AthleteOnboarding() {
  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-bebas text-2xl azul-celeste">ONBOARDING DO ATLETA</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Página de onboarding em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}