# carapace-detection-rules

Maintained detection rule packs for the first Carapace slice.

Support Carapace on Patreon: <https://www.patreon.com/carapacehq>

## Scope

This repo owns:

- rule format normalization
- maintained starter rules
- scoring contribution semantics
- fixtures that prove suspicious vs. normal behavior
- a local evaluator that can score the starter rules without external services

## Seed Material

The initial source docs in `docs/` came from the earlier `ai-trust-layer` work and will be normalized here:

- `docs/Detection-Rule-Format.md`
- `docs/Detection-Engine.md`
- `docs/Risk-Scoring-Model.md`

## Starter Rule Pack

The shipped `rules/core/` pack implements the first-slice rules:

- velocity threshold
- suspicious source or proxy-like forwarded source
- repeated authentication failure
- known prompt injection pattern hit
- endpoint enumeration behavior
- repeated retry anomaly

Each rule ships with the minimum metadata locked in the steering backlog:

- `id`
- `title`
- `severity`
- `eventTypes`
- `condition`
- `outputFlags`
- `scoreContribution`
- `suggestedAction`

## Local Usage

Install the starter rule pack:

```bash
npm install @carapacehq/detection-rules
```

Evaluate a sequence of Carapace events:

```js
import { coreRules, createRuleEvaluator } from "@carapacehq/detection-rules";

const evaluate = createRuleEvaluator({ rules: coreRules });
const outcome = evaluate(events, previousEvents);
```

The returned outcome includes:

- `hits`
- `flags`
- `score`
- `reasons`
- `action`

## Development

```bash
npm test
npm pack --dry-run
```

## License

Apache-2.0
