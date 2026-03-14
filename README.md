# carapace-detection-rules

Maintained detection rule packs for the first Carapace slice.

## Scope

This repo owns:

- rule format normalization
- maintained starter rules
- scoring contribution semantics
- fixtures that prove suspicious vs. normal behavior

## Seed Material

The initial source docs in `docs/` came from the earlier `ai-trust-layer` work and will be normalized here:

- `docs/Detection-Rule-Format.md`
- `docs/Detection-Engine.md`
- `docs/Risk-Scoring-Model.md`

## Near-Term Milestones

1. Freeze the starter rule metadata shape.
2. Implement the first rules for velocity, auth failure, prompt injection, endpoint enumeration, and retry anomalies.
3. Provide reference fixtures for the playground and JS middleware integration.

## License

Apache-2.0

