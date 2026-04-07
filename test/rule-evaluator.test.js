import assert from "node:assert/strict";
import test from "node:test";

import normalSequence from "../fixtures/normal-sequence.json" with { type: "json" };
import suspiciousSequence from "../fixtures/suspicious-sequence.json" with { type: "json" };
import { coreRules, createRuleEvaluator, listRuleFlags } from "../src/index.js";

test("loads the full starter rule pack", () => {
  assert.equal(coreRules.length, 6);
  assert.deepEqual(
    coreRules.map((rule) => rule.id),
    [
      "carapace.velocity-threshold",
      "carapace.suspicious-source",
      "carapace.repeated-auth-failure",
      "carapace.prompt-injection-hit",
      "carapace.endpoint-enumeration",
      "carapace.repeated-retry-anomaly",
    ],
  );
});

test("keeps normal sequences at allow", () => {
  const evaluate = createRuleEvaluator({ rules: coreRules });
  const outcome = evaluate(normalSequence);

  assert.equal(outcome.action, "allow");
  assert.equal(outcome.score, 0);
  assert.deepEqual(outcome.hits, []);
});

test("stacks multiple hits for suspicious sequences", () => {
  const evaluate = createRuleEvaluator({ rules: coreRules });
  const outcome = evaluate(suspiciousSequence);
  const flags = listRuleFlags(outcome.hits);

  assert.equal(outcome.action, "block");
  assert.equal(outcome.score, 100);
  assert.equal(flags.includes("prompt_injection"), true);
  assert.equal(flags.includes("proxy_source"), true);
  assert.equal(flags.includes("endpoint_enumeration"), true);
});
