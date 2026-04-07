import velocityThresholdRule from "../rules/core/velocity-threshold.rule.json" with { type: "json" };
import suspiciousSourceRule from "../rules/core/suspicious-source.rule.json" with { type: "json" };
import repeatedAuthFailureRule from "../rules/core/repeated-auth-failure.rule.json" with { type: "json" };
import promptInjectionRule from "../rules/core/prompt-injection-hit.rule.json" with { type: "json" };
import endpointEnumerationRule from "../rules/core/endpoint-enumeration.rule.json" with { type: "json" };
import repeatedRetryRule from "../rules/core/repeated-retry-anomaly.rule.json" with { type: "json" };

export const coreRules = Object.freeze([
  velocityThresholdRule,
  suspiciousSourceRule,
  repeatedAuthFailureRule,
  promptInjectionRule,
  endpointEnumerationRule,
  repeatedRetryRule,
]);

export function loadCoreRules() {
  return coreRules.map((rule) => structuredClone(rule));
}
