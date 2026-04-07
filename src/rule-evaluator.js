export const ACTION_PRECEDENCE = {
  allow: 0,
  log: 1,
  rate_limit: 2,
  block: 3,
};

function toTimestamp(value) {
  return Date.parse(value || "");
}

function eventTimestamp(event) {
  const ts = toTimestamp(event?.ts);
  return Number.isNaN(ts) ? 0 : ts;
}

function actorKey(event) {
  return `${event?.actor?.ip || "unknown"}:${event?.actor?.path || "/"}`;
}

function requestKey(event) {
  return `${event?.actor?.ip || "unknown"}:${event?.actor?.method || "GET"}:${event?.actor?.path || "/"}`;
}

function withinWindow(events, currentEvent, windowMs) {
  const currentTs = eventTimestamp(currentEvent);
  return events.filter((event) => currentTs - eventTimestamp(event) <= windowMs);
}

function countDistinctPaths(events) {
  return new Set(events.map((event) => event?.actor?.path).filter(Boolean)).size;
}

function matchesSuspiciousSource(event, watchlist = []) {
  const ip = event?.actor?.ip || "";

  if (!ip) {
    return false;
  }

  return watchlist.some((prefix) => ip.startsWith(prefix));
}

function evaluateCondition(rule, currentEvent, history) {
  const { condition } = rule;
  if (!condition) {
    return false;
  }

  if (!rule.eventTypes.includes(currentEvent.type)) {
    return false;
  }

  if (condition.kind === "velocity_threshold") {
    return (currentEvent.metrics?.hitCount || 0) >= condition.hitCount;
  }

  if (condition.kind === "suspicious_source") {
    return matchesSuspiciousSource(currentEvent, condition.ipStartsWith);
  }

  if (condition.kind === "event_presence") {
    return true;
  }

  if (condition.kind === "repeated_auth_failure") {
    const matching = withinWindow(
      history.filter(
        (event) =>
          event.type === "auth_failure" &&
          actorKey(event) === actorKey(currentEvent),
      ),
      currentEvent,
      condition.windowMs,
    );

    return matching.length >= condition.failureCount;
  }

  if (condition.kind === "endpoint_enumeration") {
    const matching = withinWindow(
      history.filter((event) => event.type === "api_request" && event.actor?.ip === currentEvent.actor?.ip),
      currentEvent,
      condition.windowMs,
    );

    return countDistinctPaths(matching) >= condition.distinctPaths;
  }

  if (condition.kind === "repeated_retry") {
    const matching = withinWindow(
      history.filter(
        (event) =>
          event.type === "api_request" &&
          requestKey(event) === requestKey(currentEvent),
      ),
      currentEvent,
      condition.windowMs,
    );

    return matching.length >= condition.attemptCount;
  }

  return false;
}

function highestAction(currentAction, nextAction) {
  if (ACTION_PRECEDENCE[nextAction] > ACTION_PRECEDENCE[currentAction]) {
    return nextAction;
  }

  return currentAction;
}

export function listRuleFlags(hits) {
  return [...new Set(hits.flatMap((hit) => hit.flags))];
}

export function summarizeHits(hits) {
  const flags = listRuleFlags(hits);
  const reasons = hits.map((hit) => hit.ruleId);
  const score = Math.min(
    100,
    hits.reduce((total, hit) => total + hit.scoreContribution, 0),
  );
  const actionFromRules = hits.reduce(
    (currentAction, hit) => highestAction(currentAction, hit.suggestedAction),
    "allow",
  );

  let action = actionFromRules;
  if (score >= 80) {
    action = highestAction(action, "block");
  } else if (score >= 50) {
    action = highestAction(action, "rate_limit");
  } else if (score >= 25) {
    action = highestAction(action, "log");
  }

  return {
    action,
    flags,
    reasons,
    score,
  };
}

export function createRuleEvaluator({ rules }) {
  return function evaluateEventSequence(currentEvents, priorEvents = []) {
    const hits = [];
    const history = [...priorEvents];

    for (const event of currentEvents) {
      history.push(event);

      for (const rule of rules) {
        if (!evaluateCondition(rule, event, history)) {
          continue;
        }

        hits.push({
          ruleId: rule.id,
          title: rule.title,
          severity: rule.severity,
          eventType: event.type,
          flags: rule.outputFlags,
          scoreContribution: rule.scoreContribution,
          suggestedAction: rule.suggestedAction,
        });
      }
    }

    return {
      hits,
      ...summarizeHits(hits),
    };
  };
}
