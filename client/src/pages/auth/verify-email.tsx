import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { api } from "@/lib/api";

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Token de verificação não encontrado");
        return;
      }

      try {
        await api.post("/api/auth/verify-email", { token });
        setStatus("success");
        setMessage("Email verificado com sucesso!");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          setLocation("/auth/login?verified=true");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Erro ao verificar email");
      }
    };

    verifyEmail();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-900 via-black to-yellow-900">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Mail className="h-12 w-12 mx-auto text-primary" />
          </div>
          <CardTitle>Verificação de Email</CardTitle>
          <CardDescription>
            Confirmando seu endereço de email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Verificando seu email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <Alert className="mb-4">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                Você será redirecionado para a página de login...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button onClick={() => setLocation("/auth/login")} className="mt-4">
                Voltar para Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}