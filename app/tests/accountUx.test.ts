import test from "node:test";
import assert from "node:assert/strict";
import { LOCALES } from "../src/lib/i18n";
import { accountCopy } from "../src/lib/translations/account";

test("account creation and verification copy is complete in every supported language", () => {
  for (const locale of LOCALES) {
    const copy = accountCopy(locale);
    for (const key of ["signIn", "createAccount", "loginTitle", "signupTitle", "basicAccountNotice", "termsAcceptance", "checkEmailBody", "verifyTitle", "verifyError", "onboardingBoundary"] as const) {
      assert.ok(copy[key].trim().length > 0, `${locale}.${key} must be populated`);
    }
  }
});

test("basic-account copy does not imply confidential or institutional approval", () => {
  assert.match(accountCopy("en").basicAccountNotice, /does not grant institutional qualification/i);
  assert.match(accountCopy("en").onboardingBoundary, /does not verify an organisation/i);
});
