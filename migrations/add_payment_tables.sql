-- Add payment and subscription tables to existing schema

-- Subscription plans table
CREATE TABLE IF NOT EXISTS "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'BRL',
	"features" jsonb NOT NULL,
	"max_profiles" integer DEFAULT 1,
	"verification_tests" integer DEFAULT 0,
	"scout_visibility" boolean DEFAULT false,
	"priority_support" boolean DEFAULT false,
	"stripe_product_id" varchar,
	"stripe_price_id" varchar,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"plan_id" integer NOT NULL,
	"stripe_subscription_id" varchar,
	"stripe_customer_id" varchar,
	"status" varchar NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false,
	"trial_end" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS "payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"stripe_payment_method_id" varchar NOT NULL,
	"type" varchar NOT NULL,
	"last4" varchar(4),
	"brand" varchar,
	"expiry_month" integer,
	"expiry_year" integer,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS "payment_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"subscription_id" integer,
	"stripe_payment_intent_id" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'BRL',
	"status" varchar NOT NULL,
	"type" varchar NOT NULL,
	"description" text,
	"failure_reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payment_transactions_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);

-- Add foreign key constraints
ALTER TABLE "user_subscriptions" 
  ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
  ON DELETE cascade ON UPDATE no action;

ALTER TABLE "user_subscriptions" 
  ADD CONSTRAINT "user_subscriptions_plan_id_subscription_plans_id_fk" 
  FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") 
  ON DELETE no action ON UPDATE no action;

ALTER TABLE "payment_methods" 
  ADD CONSTRAINT "payment_methods_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
  ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payment_transactions" 
  ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
  ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payment_transactions" 
  ADD CONSTRAINT "payment_transactions_subscription_id_user_subscriptions_id_fk" 
  FOREIGN KEY ("subscription_id") REFERENCES "public"."user_subscriptions"("id") 
  ON DELETE no action ON UPDATE no action;

-- Create indexes
CREATE INDEX IF NOT EXISTS "IDX_user_subscriptions_user" ON "user_subscriptions" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "IDX_user_subscriptions_status" ON "user_subscriptions" USING btree ("status");
CREATE INDEX IF NOT EXISTS "IDX_payment_methods_user" ON "payment_methods" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "IDX_payment_transactions_user" ON "payment_transactions" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "IDX_payment_transactions_status" ON "payment_transactions" USING btree ("status");

-- Insert default subscription plans
INSERT INTO "subscription_plans" (name, display_name, price, features, max_profiles, verification_tests, scout_visibility, priority_support)
VALUES 
  ('basic', 'Revela Basic', 0.00, '["Perfil básico de atleta", "Upload de fotos", "Autoavaliação de habilidades"]'::jsonb, 1, 0, false, false),
  ('pro', 'Revela Pro', 29.90, '["Tudo do Basic", "3 testes de verificação por mês", "Visibilidade para scouts", "Selo de verificação"]'::jsonb, 1, 3, true, false),
  ('elite', 'Revela Elite', 79.90, '["Tudo do Pro", "Testes ilimitados", "Análise prioritária", "Suporte prioritário", "Destaque nas buscas"]'::jsonb, 3, -1, true, true)
ON CONFLICT (id) DO NOTHING;