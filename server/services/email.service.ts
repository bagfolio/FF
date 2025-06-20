import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY || 're_test_key');

// Email templates
const emailTemplates = {
  verification: (name: string, verificationUrl: string) => ({
    subject: 'Verifique seu email - Revela',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #009639;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #009639;
            }
            .content {
              padding: 30px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #009639;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #007a2f;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚽ Revela</div>
            </div>
            <div class="content">
              <h1>Olá ${name}!</h1>
              <p>Bem-vindo ao Revela! Estamos animados em ter você conosco.</p>
              <p>Para começar a usar sua conta, por favor verifique seu endereço de email clicando no botão abaixo:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar Email</a>
              </div>
              <p>Este link expira em 24 horas por motivos de segurança.</p>
              <p>Se você não criou uma conta no Revela, pode ignorar este email.</p>
              <p><strong>Dica:</strong> Após verificar seu email, complete seu perfil para aumentar suas chances de ser descoberto por scouts!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Revela. Todos os direitos reservados.</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Olá ${name}!
      
      Bem-vindo ao Revela! Estamos animados em ter você conosco.
      
      Para começar a usar sua conta, por favor verifique seu endereço de email visitando o link abaixo:
      
      ${verificationUrl}
      
      Este link expira em 24 horas por motivos de segurança.
      
      Se você não criou uma conta no Revela, pode ignorar este email.
      
      Dica: Após verificar seu email, complete seu perfil para aumentar suas chances de ser descoberto por scouts!
      
      © ${new Date().getFullYear()} Revela. Todos os direitos reservados.
    `
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Redefinir senha - Revela',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #009639;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #009639;
            }
            .content {
              padding: 30px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #009639;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #007a2f;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeeba;
              color: #856404;
              padding: 10px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚽ Revela</div>
            </div>
            <div class="content">
              <h1>Olá ${name}!</h1>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta Revela.</p>
              <p>Clique no botão abaixo para criar uma nova senha:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </div>
              <div class="warning">
                <strong>Importante:</strong> Este link expira em 1 hora por motivos de segurança.
              </div>
              <p>Se você não solicitou a redefinição de senha, pode ignorar este email com segurança. Sua senha atual permanecerá inalterada.</p>
              <p>Por questões de segurança, recomendamos que você:</p>
              <ul>
                <li>Use uma senha forte e única</li>
                <li>Não compartilhe sua senha com ninguém</li>
                <li>Ative a autenticação de dois fatores quando disponível</li>
              </ul>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Revela. Todos os direitos reservados.</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Olá ${name}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta Revela.
      
      Clique no link abaixo para criar uma nova senha:
      
      ${resetUrl}
      
      Importante: Este link expira em 1 hora por motivos de segurança.
      
      Se você não solicitou a redefinição de senha, pode ignorar este email com segurança. Sua senha atual permanecerá inalterada.
      
      Por questões de segurança, recomendamos que você:
      - Use uma senha forte e única
      - Não compartilhe sua senha com ninguém
      - Ative a autenticação de dois fatores quando disponível
      
      © ${new Date().getFullYear()} Revela. Todos os direitos reservados.
    `
  }),

  welcomeAthlete: (name: string) => ({
    subject: 'Bem-vindo ao Revela! 🌟',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #009639;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #009639;
            }
            .content {
              padding: 30px 0;
            }
            .feature {
              background-color: #f8f9fa;
              padding: 15px;
              margin: 10px 0;
              border-radius: 5px;
              border-left: 4px solid #009639;
            }
            .cta {
              background-color: #009639;
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 30px 0;
            }
            .cta a {
              color: white;
              text-decoration: none;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚽ Revela</div>
            </div>
            <div class="content">
              <h1>Parabéns ${name}! 🎉</h1>
              <p>Você deu o primeiro passo para revolucionar sua carreira no futebol!</p>
              
              <h2>O que você pode fazer no Revela:</h2>
              
              <div class="feature">
                <strong>📊 Perfil Profissional</strong>
                <p>Crie um perfil completo com suas estatísticas, vídeos e conquistas</p>
              </div>
              
              <div class="feature">
                <strong>🏃‍♂️ Testes de Verificação</strong>
                <p>Valide suas habilidades com nosso sistema de IA e ganhe selos de confiança</p>
              </div>
              
              <div class="feature">
                <strong>🔍 Seja Descoberto</strong>
                <p>Scouts de todo o Brasil podem encontrar você através da nossa plataforma</p>
              </div>
              
              <div class="feature">
                <strong>📈 Acompanhe seu Progresso</strong>
                <p>Monitore sua evolução e compare com outros atletas da sua categoria</p>
              </div>
              
              <div class="cta">
                <h3>Próximos Passos</h3>
                <p>Complete seu perfil agora para aumentar suas chances de ser descoberto!</p>
                <a href="${process.env.APP_URL || 'http://localhost:5000'}/athlete/profile">Completar Perfil →</a>
              </div>
              
              <p><strong>Dica Pro:</strong> Atletas com perfis 100% completos têm 3x mais chances de serem contactados por scouts!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Revela. Todos os direitos reservados.</p>
              <p>Precisa de ajuda? Responda este email que teremos prazer em ajudar!</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Parabéns ${name}! 🎉
      
      Você deu o primeiro passo para revolucionar sua carreira no futebol!
      
      O que você pode fazer no Revela:
      
      📊 Perfil Profissional
      Crie um perfil completo com suas estatísticas, vídeos e conquistas
      
      🏃‍♂️ Testes de Verificação
      Valide suas habilidades com nosso sistema de IA e ganhe selos de confiança
      
      🔍 Seja Descoberto
      Scouts de todo o Brasil podem encontrar você através da nossa plataforma
      
      📈 Acompanhe seu Progresso
      Monitore sua evolução e compare com outros atletas da sua categoria
      
      Próximos Passos:
      Complete seu perfil agora para aumentar suas chances de ser descoberto!
      
      Visite: ${process.env.APP_URL || 'http://localhost:5000'}/athlete/profile
      
      Dica Pro: Atletas com perfis 100% completos têm 3x mais chances de serem contactados por scouts!
      
      © ${new Date().getFullYear()} Revela. Todos os direitos reservados.
      Precisa de ajuda? Responda este email que teremos prazer em ajudar!
    `
  }),

  subscriptionCreated: (name: string, planName: string, trialEnd?: Date) => ({
    subject: 'Assinatura confirmada - Revela ✅',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #009639;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #009639;
            }
            .content {
              padding: 30px 0;
            }
            .success-box {
              background-color: #d4edda;
              border: 1px solid #c3e6cb;
              color: #155724;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .plan-details {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .feature-list {
              list-style: none;
              padding: 0;
            }
            .feature-list li {
              padding: 8px 0;
              padding-left: 25px;
              position: relative;
            }
            .feature-list li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #009639;
              font-weight: bold;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #009639;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚽ Revela</div>
            </div>
            <div class="content">
              <h1>Parabéns ${name}! 🎊</h1>
              <div class="success-box">
                <strong>Sua assinatura ${planName} foi ativada com sucesso!</strong>
              </div>
              
              ${trialEnd ? `
                <p><strong>Período de teste grátis:</strong> Você tem acesso completo até ${trialEnd.toLocaleDateString('pt-BR')}. Após esta data, sua assinatura será cobrada automaticamente.</p>
              ` : ''}
              
              <div class="plan-details">
                <h3>Seus benefícios ${planName}:</h3>
                <ul class="feature-list">
                  ${planName === 'Revela Pro' ? `
                    <li>Visibilidade completa para scouts</li>
                    <li>3 testes de verificação mensais</li>
                    <li>Selo de verificação de perfil</li>
                    <li>Upload de vídeos ilimitado</li>
                    <li>Análise de desempenho com IA</li>
                  ` : `
                    <li>Visibilidade prioritária para scouts</li>
                    <li>Testes de verificação ilimitados</li>
                    <li>Selo de verificação dourado</li>
                    <li>Upload de vídeos em HD</li>
                    <li>Análise avançada com IA</li>
                    <li>Suporte prioritário</li>
                    <li>3 perfis adicionais</li>
                  `}
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:5000'}/athlete/dashboard" class="button">Acessar Dashboard</a>
              </div>
              
              <p><strong>Próximos passos:</strong></p>
              <ol>
                <li>Complete 100% do seu perfil</li>
                <li>Faça os testes de verificação</li>
                <li>Adicione vídeos dos seus melhores momentos</li>
                <li>Mantenha suas estatísticas atualizadas</li>
              </ol>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Revela. Todos os direitos reservados.</p>
              <p>Gerencie sua assinatura a qualquer momento no seu dashboard.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Parabéns ${name}! 🎊
      
      Sua assinatura ${planName} foi ativada com sucesso!
      
      ${trialEnd ? `Período de teste grátis: Você tem acesso completo até ${trialEnd.toLocaleDateString('pt-BR')}. Após esta data, sua assinatura será cobrada automaticamente.` : ''}
      
      Acesse seu dashboard: ${process.env.APP_URL || 'http://localhost:5000'}/athlete/dashboard
      
      Próximos passos:
      1. Complete 100% do seu perfil
      2. Faça os testes de verificação
      3. Adicione vídeos dos seus melhores momentos
      4. Mantenha suas estatísticas atualizadas
      
      © ${new Date().getFullYear()} Revela. Todos os direitos reservados.
      Gerencie sua assinatura a qualquer momento no seu dashboard.
    `
  }),

  subscriptionCanceled: (name: string, endDate: Date) => ({
    subject: 'Confirmação de cancelamento - Revela',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #dc3545;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #009639;
            }
            .content {
              padding: 30px 0;
            }
            .alert-box {
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
              color: #721c24;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .info-box {
              background-color: #d1ecf1;
              border: 1px solid #bee5eb;
              color: #0c5460;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #009639;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚽ Revela</div>
            </div>
            <div class="content">
              <h1>Olá ${name}</h1>
              <div class="alert-box">
                <strong>Sua assinatura foi cancelada</strong>
              </div>
              
              <p>Confirmamos o cancelamento da sua assinatura Revela.</p>
              
              <div class="info-box">
                <p><strong>Importante:</strong> Você continuará tendo acesso aos recursos premium até <strong>${endDate.toLocaleDateString('pt-BR')}</strong>.</p>
              </div>
              
              <p>Após esta data, seu perfil voltará ao plano gratuito com as seguintes limitações:</p>
              <ul>
                <li>Sem visibilidade para scouts</li>
                <li>Sem testes de verificação</li>
                <li>Funcionalidades básicas apenas</li>
              </ul>
              
              <p>Sentiremos sua falta! Se mudar de ideia, você pode reativar sua assinatura a qualquer momento.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:5000'}/athlete/subscription" class="button">Reativar Assinatura</a>
              </div>
              
              <p>Se você cancelou por algum problema ou insatisfação, adoraríamos ouvir seu feedback. Responda este email com suas sugestões.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Revela. Todos os direitos reservados.</p>
              <p>Obrigado por fazer parte da nossa comunidade!</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Olá ${name}
      
      Sua assinatura foi cancelada.
      
      Confirmamos o cancelamento da sua assinatura Revela.
      
      Importante: Você continuará tendo acesso aos recursos premium até ${endDate.toLocaleDateString('pt-BR')}.
      
      Após esta data, seu perfil voltará ao plano gratuito com as seguintes limitações:
      - Sem visibilidade para scouts
      - Sem testes de verificação
      - Funcionalidades básicas apenas
      
      Sentiremos sua falta! Se mudar de ideia, você pode reativar sua assinatura a qualquer momento.
      
      Reativar: ${process.env.APP_URL || 'http://localhost:5000'}/athlete/subscription
      
      Se você cancelou por algum problema ou insatisfação, adoraríamos ouvir seu feedback. Responda este email com suas sugestões.
      
      © ${new Date().getFullYear()} Revela. Todos os direitos reservados.
      Obrigado por fazer parte da nossa comunidade!
    `
  }),

  paymentFailed: (name: string, retryUrl: string) => ({
    subject: 'Problema com pagamento - Ação necessária',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 2px solid #ffc107;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #009639;
            }
            .content {
              padding: 30px 0;
            }
            .warning-box {
              background-color: #fff3cd;
              border: 1px solid #ffeeba;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #ffc107;
              color: #212529;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              color: #666;
              font-size: 14px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚽ Revela</div>
            </div>
            <div class="content">
              <h1>Olá ${name}</h1>
              <div class="warning-box">
                <strong>⚠️ Houve um problema ao processar seu pagamento</strong>
              </div>
              
              <p>Não conseguimos processar o pagamento da sua assinatura Revela. Isso pode acontecer por diversos motivos:</p>
              <ul>
                <li>Cartão expirado</li>
                <li>Limite insuficiente</li>
                <li>Dados do cartão desatualizados</li>
              </ul>
              
              <p><strong>Para manter seu acesso aos recursos premium, por favor atualize suas informações de pagamento.</strong></p>
              
              <div style="text-align: center;">
                <a href="${retryUrl}" class="button">Atualizar Pagamento</a>
              </div>
              
              <p>Se você não atualizar o pagamento nos próximos 7 dias, sua conta voltará ao plano gratuito.</p>
              
              <p>Precisa de ajuda? Responda este email ou entre em contato com nosso suporte.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Revela. Todos os direitos reservados.</p>
              <p>Este é um email automático sobre sua assinatura.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Olá ${name}
      
      ⚠️ Houve um problema ao processar seu pagamento
      
      Não conseguimos processar o pagamento da sua assinatura Revela. Isso pode acontecer por diversos motivos:
      - Cartão expirado
      - Limite insuficiente
      - Dados do cartão desatualizados
      
      Para manter seu acesso aos recursos premium, por favor atualize suas informações de pagamento.
      
      Atualizar Pagamento: ${retryUrl}
      
      Se você não atualizar o pagamento nos próximos 7 dias, sua conta voltará ao plano gratuito.
      
      Precisa de ajuda? Responda este email ou entre em contato com nosso suporte.
      
      © ${new Date().getFullYear()} Revela. Todos os direitos reservados.
    `
  })
};

// Email service class
export class EmailService {
  private from = process.env.EMAIL_FROM || 'Revela <noreply@revela.app>';

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.APP_URL || 'http://localhost:5000'}/auth/verify-email?token=${token}`;
    const template = emailTemplates.verification(name, verificationUrl);

    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/auth/reset-password?token=${token}`;
    const template = emailTemplates.passwordReset(name, resetUrl);

    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const template = emailTemplates.welcomeAthlete(name);

    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error for welcome emails - they're not critical
    }
  }

  async sendParentalConsentEmail(parentEmail: string, athleteName: string, consentUrl: string): Promise<void> {
    try {
      await resend.emails.send({
        from: this.from,
        to: parentEmail,
        subject: `Autorização necessária - ${athleteName} no Revela`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #009639; color: white; text-decoration: none; border-radius: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Autorização de Responsável</h1>
                <p>Olá,</p>
                <p>${athleteName} está criando um perfil no Revela, a plataforma que conecta jovens talentos do futebol com scouts profissionais.</p>
                <p>Como ${athleteName} é menor de idade, precisamos da sua autorização para continuar.</p>
                <p>Por favor, clique no botão abaixo para revisar e autorizar:</p>
                <p style="text-align: center;">
                  <a href="${consentUrl}" class="button">Revisar e Autorizar</a>
                </p>
                <p>Se você tiver alguma dúvida, entre em contato conosco.</p>
                <p>Atenciosamente,<br>Equipe Revela</p>
              </div>
            </body>
          </html>
        `,
        text: `
          Autorização de Responsável
          
          Olá,
          
          ${athleteName} está criando um perfil no Revela, a plataforma que conecta jovens talentos do futebol com scouts profissionais.
          
          Como ${athleteName} é menor de idade, precisamos da sua autorização para continuar.
          
          Por favor, visite o link abaixo para revisar e autorizar:
          ${consentUrl}
          
          Se você tiver alguma dúvida, entre em contato conosco.
          
          Atenciosamente,
          Equipe Revela
        `
      });
    } catch (error) {
      console.error('Failed to send parental consent email:', error);
      throw new Error('Failed to send parental consent email');
    }
  }

  async sendSubscriptionCreatedEmail(email: string, name: string, planName: string, trialEnd?: Date): Promise<void> {
    const template = emailTemplates.subscriptionCreated(name, planName, trialEnd);

    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      console.error('Failed to send subscription created email:', error);
      // Don't throw error for subscription emails - they're not critical
    }
  }

  async sendSubscriptionCanceledEmail(email: string, name: string, endDate: Date): Promise<void> {
    const template = emailTemplates.subscriptionCanceled(name, endDate);

    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      console.error('Failed to send subscription canceled email:', error);
      // Don't throw error for subscription emails - they're not critical
    }
  }

  async sendPaymentFailedEmail(email: string, name: string): Promise<void> {
    const retryUrl = `${process.env.APP_URL || 'http://localhost:5000'}/athlete/subscription`;
    const template = emailTemplates.paymentFailed(name, retryUrl);

    try {
      await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (error) {
      console.error('Failed to send payment failed email:', error);
      // Don't throw error for payment emails - they're not critical
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();