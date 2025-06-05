CREATE TABLE "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"title" varchar NOT NULL,
	"amount" integer NOT NULL,
	"category" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
