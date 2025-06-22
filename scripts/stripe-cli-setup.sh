#!/bin/bash

echo "🚀 Setting up Stripe CLI for webhook testing..."
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "📦 Installing Stripe CLI..."
    
    # Detect OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
        echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
        sudo apt update
        sudo apt install stripe
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install stripe/stripe-cli/stripe
    else
        echo "❌ Unsupported OS. Please install Stripe CLI manually:"
        echo "   https://stripe.com/docs/stripe-cli#install"
        exit 1
    fi
else
    echo "✅ Stripe CLI is already installed"
fi

echo ""
echo "📝 To test webhooks locally:"
echo "1. Run: stripe login"
echo "2. Run: stripe listen --forward-to localhost:5000/api/stripe/webhook"
echo "3. Copy the webhook signing secret shown and update your .env.local"
echo ""
echo "📋 To trigger test events:"
echo "   stripe trigger payment_intent.succeeded"
echo "   stripe trigger checkout.session.completed"
echo ""