import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      await api.post("/api/auth/forgot-password", { email });
      setStatus("success");
      setMessage("Email de redefinição enviado! Verifique sua caixa de entrada.");
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Erro ao enviar email de redefinição");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-900 via-black to-yellow-900">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-4"
            onClick={() => setLocation("/auth/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="mb-4">
            <Mail className="h-12 w-12 mx-auto text-primary" />
          </div>
          <CardTitle>Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Não se preocupe! Digite seu email e enviaremos instruções para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "success" && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Email de Redefinição
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Lembrou sua senha?</p>
              <Button
                type="button"
                variant="link"
                onClick={() => setLocation("/auth/login")}
                disabled={isLoading}
              >
                Voltar para login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}