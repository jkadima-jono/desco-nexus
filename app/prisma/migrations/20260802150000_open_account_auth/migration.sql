ALTER TABLE "LoginToken"
ADD COLUMN "requestedFullName" TEXT,
ADD COLUMN "termsVersion" TEXT,
ADD COLUMN "privacyVersion" TEXT;

CREATE TABLE "AccountAcceptance" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "termsVersion" TEXT NOT NULL,
  "privacyVersion" TEXT NOT NULL,
  "requestIpHash" TEXT,
  "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AccountAcceptance_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AccountAcceptance_userId_termsVersion_privacyVersion_key"
ON "AccountAcceptance"("userId", "termsVersion", "privacyVersion");
CREATE INDEX "AccountAcceptance_acceptedAt_idx" ON "AccountAcceptance"("acceptedAt");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

ALTER TABLE "AccountAcceptance"
ADD CONSTRAINT "AccountAcceptance_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "AccountLifecycleRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'requested',
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "AccountLifecycleRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AccountLifecycleRequest_userId_type_status_idx" ON "AccountLifecycleRequest"("userId", "type", "status");
CREATE INDEX "AccountLifecycleRequest_status_requestedAt_idx" ON "AccountLifecycleRequest"("status", "requestedAt");
CREATE UNIQUE INDEX "AccountLifecycleRequest_one_open_request_idx"
ON "AccountLifecycleRequest"("userId", "type")
WHERE "status" IN ('requested', 'in_review');
ALTER TABLE "AccountLifecycleRequest" ADD CONSTRAINT "AccountLifecycleRequest_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
