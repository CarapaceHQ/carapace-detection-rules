# AI Agent Trust Layer

## Detection Engine Specification

This document defines the **Detection Engine** for the Carapace platform.

The Detection Engine is the system responsible for transforming raw behavioral telemetry into actionable **risk detections**, **flags**, and **derived signals** that feed the Risk Scoring Engine, Trust Graph, dashboard, and policy systems.

It acts as the bridge between:

- Risk Event collection
- behavioral signal analysis
- risk scoring
- trust decisions

---

# 1. Purpose

The Detection Engine exists to identify suspicious, abusive, malicious, or anomalous patterns in AI agent behavior.

It consumes standardized **Risk Events** and evaluates them using multiple detection methods such as:

- rules
- thresholds
- temporal logic
- correlation logic
- anomaly logic
- signature matching

Its output is a stream of normalized detections that can be used by other Carapace components.

---

# 2. Role in the Architecture

The Detection Engine sits after event ingestion and before risk scoring.

Pipeline:

Agent / Service Interaction  
↓  
Event Collection SDK  
↓  
Event Ingestion API  
↓  
Streaming Queue  
↓  
Detection Engine  
↓  
Risk Scoring Engine  
↓  
Trust Graph Updates  
↓  
Dashboard / Policy Engine

The engine does not make final trust decisions by itself.

Its job is to detect behavior patterns and emit structured findings.

---

# 3. Design Goals

The Detection Engine should be designed to achieve the following goals.

## 3.1 Real-Time Operation

Detect risky behaviors quickly enough to support:

- API protection
- session scoring
- challenge workflows
- rate limiting
- blocking decisions

## 3.2 Explainability

Every detection should be explainable.

The platform should be able to answer:

- what was detected
- why it was detected
- which signals triggered it
- how severe it is
- how confident the engine is

## 3.3 Extensibility

The engine must support evolving detection logic as new attack patterns emerge.

This includes support for:

- new rule packs
- new event categories
- new scoring inputs
- future ML-based detections

## 3.4 Local-First Deployment

Organizations should be able to run the Detection Engine locally without sharing raw telemetry externally.

## 3.5 Privacy Preservation

The engine should prefer derived behavioral signals over raw payload storage whenever possible.

---

# 4. Inputs

The Detection Engine consumes standardized **Risk Events** defined by the Carapace Risk Event Schema.

Primary input fields include:

- event_id
- event_type
- event_timestamp
- agent_id
- organization_id
- service_id
- environment
- metadata
- network
- content
- economic

These events may contain signals derived from the Behavior Telemetry Taxonomy, including:

- network signals
- request behavior signals
- authentication signals
- agent behavior signals
- content signals
- economic signals
- environment signals
- organizational signals

The Detection Engine operates on both:

- individual events
- aggregated behavioral windows across many events

---

# 5. Detection Model

The Detection Engine supports multiple detection classes.

## 5.1 Rule-Based Detection

Rule-based detections evaluate defined conditions against incoming events or aggregates.

Examples:

- request velocity above threshold
- repeated login failures
- known prompt injection signatures
- residential proxy usage
- endpoint enumeration patterns

Rule-based detection is the default MVP approach.

## 5.2 Threshold Detection

Threshold detections trigger when a value exceeds a configured boundary.

Examples:

- requests_per_minute > 60
- failed_login_attempts > 5
- unique_ip_count_per_agent > 10 in 1 hour
- chargeback_rate above configured limit

## 5.3 Temporal Detection

Temporal detections evaluate behavior across time windows.

Examples:

- burst traffic within 2 minutes
- repeated retry patterns across 15 minutes
- high geo movement velocity over 1 hour
- rapid account creation over 24 hours

## 5.4 Correlation Detection

Correlation detections combine multiple signals to increase confidence.

Examples:

- proxy_detected + high request velocity
- prompt injection signature + model exfiltration indicators
- failed login spikes + multi-account behavior
- wallet reuse + shared infrastructure + trial abuse

## 5.5 Signature Detection

Signature detections identify known malicious strings, patterns, fingerprints, or heuristics.

Examples:

- known prompt injection phrases
- exploit payload indicators
- credential stuffing patterns
- token exfiltration markers

## 5.6 Behavioral Anomaly Detection

Behavioral anomaly detection identifies deviations from baseline behavior.

Examples:

- unusual endpoint diversity
- abnormal task execution cadence
- unexpected session reuse behavior
- sudden shift in compute consumption

This capability may begin with simple baseline logic and evolve toward machine learning models later.

## 5.7 Graph-Aware Detection

In later phases, the Detection Engine may consume Trust Graph context.

Examples:

- multiple agents sharing malicious infrastructure
- coordinated prompt attacks across services
- fraud rings using shared wallets
- organization-wide coordinated abuse

---

# 6. Detection Processing Stages

The engine processes events through several logical stages.

## 6.1 Event Intake

Incoming events are consumed from the ingestion pipeline or streaming queue.

## 6.2 Normalization

Fields are normalized into canonical internal representations.

Examples:

- standard event types
- normalized geo fields
- standardized infrastructure classifications
- normalized content signal names

## 6.3 Enrichment

The engine may enrich events with derived attributes.

Examples:

- IP reputation
- ASN classification
- infrastructure type
- baseline comparisons
- prior risk history
- recent organization behavior

## 6.4 Feature Aggregation

The engine computes rolling metrics over time windows.

Examples:

- requests per minute
- unique IP count per agent
- failed logins per session
- endpoint diversity per hour
- average task duration
- retry rate per workflow

## 6.5 Detection Evaluation

Rules, signatures, thresholds, and anomaly logic are executed.

## 6.6 Detection Emission

If a detection triggers, the engine emits a normalized detection record.

---

# 7. Detection Record Format

Each detection should be stored and emitted in a standard format.

Suggested structure:

detection_id  
detection_type  
rule_id  
rule_version  
severity  
confidence  
agent_id  
organization_id  
service_id  
event_ids  
detected_at  
window_start  
window_end  
status  
signals  
explanation  
recommended_scoring_impact

## Field Notes

### detection_id
Unique identifier for the detection.

### detection_type
Category such as:

- rule
- threshold
- temporal
- correlation
- signature
- anomaly

### rule_id
Identifier of the rule or detector that triggered.

### rule_version
Version of the detection logic for traceability.

### severity
Suggested severity such as:

- low
- medium
- high
- critical

### confidence
Confidence score for the detection, usually between 0 and 1.

### event_ids
One or more related event identifiers.

### signals
The specific telemetry signals that contributed to the detection.

### explanation
Human-readable description of why the detection triggered.

### recommended_scoring_impact
Suggested risk weight or scoring category input.

---

# 8. Detection Outputs

The Detection Engine produces three major outputs.

## 8.1 Risk Flags

Simple normalized flags used by scoring and policy systems.

Examples:

- high_velocity
- proxy_network
- prompt_injection
- credential_stuffing
- endpoint_enumeration
- trial_abuse
- model_exfiltration
- resource_abuse

## 8.2 Detection Events

Structured records that describe a triggered detection with full context.

These are used for:

- investigations
- analytics
- dashboards
- rule tuning
- auditability

## 8.3 Derived Scoring Inputs

Structured scoring inputs passed into the Risk Scoring Engine.

Examples:

- behavior risk +10
- network risk +15
- content risk +20
- economic risk +10

The scoring engine remains the source of truth for final risk scores.

---

# 9. Detection Categories

The Carapace Detection Engine should support at least the following detection families.

## 9.1 Network Abuse Detection

Examples:

- datacenter traffic abuse
- residential proxy usage
- Tor usage
- high IP rotation
- shared infrastructure clusters

## 9.2 Authentication Abuse Detection

Examples:

- repeated login failures
- token validation failures
- credential stuffing
- multi-account abuse
- unusual API key rotation

## 9.3 Request Behavior Detection

Examples:

- high request velocity
- burst traffic
- endpoint enumeration
- concurrent session flooding
- unusual API error patterns

## 9.4 Agent Execution Detection

Examples:

- execution loop detected
- instruction retry patterns
- abnormal task frequency
- suspicious parallel task execution
- behavioral cadence anomalies

## 9.5 Content Attack Detection

Examples:

- prompt injection patterns
- exploit payloads
- data exfiltration behavior
- training data extraction attempts
- token overflow attempts

## 9.6 Economic Abuse Detection

Examples:

- trial abuse
- wallet reuse abuse
- transaction velocity anomalies
- compute resource spikes
- chargeback-linked behavior

## 9.7 Organization and Coordination Detection

Examples:

- agent farm patterns
- organization-wide anomaly spikes
- coordinated attack campaigns
- shared fingerprint abuse
- cross-agent infrastructure reuse

---

# 10. Rule Format Requirements

The engine should support a structured rule format so official and community rule packs can be maintained consistently.

Each rule should define:

- rule_id
- title
- description
- category
- severity
- confidence
- required signals
- logic condition
- evaluation window
- scoring impact
- tags
- version
- author
- enabled state

Example rule categories:

- prompt injection detection
- credential abuse detection
- API abuse
- infrastructure abuse
- fraud detection
- coordinated behavior

This allows the `carapace-detection-rules` and `carapace-community-rules` repositories to plug directly into the engine.

---

# 11. Windowing and State

Many detections require rolling state.

The engine should support stateful evaluation windows such as:

- 1 minute
- 5 minutes
- 15 minutes
- 1 hour
- 24 hours
- 7 days

State may be maintained per:

- agent
- organization
- service
- IP / infrastructure node
- wallet
- session

Examples of stateful aggregates:

- requests per minute per agent
- unique IP count per day
- retry count per task
- failed logins per session
- shared wallet count across agents

---

# 12. Severity and Confidence

The Detection Engine should emit both severity and confidence.

## Severity

Represents the potential seriousness of the behavior.

Example mapping:

- low = weak suspicious signal
- medium = meaningful but non-critical behavior
- high = likely abusive activity
- critical = strong indicator of malicious behavior

## Confidence

Represents how certain the engine is that the detection is valid.

Example influences on confidence:

- number of corroborating signals
- signature quality
- detection history
- rule maturity
- false positive profile
- graph support

Severity and confidence should remain separate.

A detection can be high severity but medium confidence.

---

# 13. Explainability Requirements

Every detection should be explainable to operators and downstream systems.

Minimum explanation fields:

- title
- summary
- trigger conditions
- observed values
- time window
- related events
- affected entity
- rationale

Example:

Title: High Request Velocity  
Summary: Agent exceeded allowed request threshold.  
Observed Value: 87 requests per minute  
Threshold: 60 requests per minute  
Window: 1 minute  
Affected Agent: agt_29f93aa

Explainability is critical for trust, operator adoption, and policy tuning.

---

# 14. Integration with Risk Scoring

The Detection Engine does not assign final risk scores.

Instead, it contributes **weighted scoring inputs** and **risk flags** to the Risk Scoring Engine.

Example flow:

Detection: residential proxy detected  
↓  
Detection Category: network risk  
↓  
Suggested Impact: +15  
↓  
Scoring Engine applies final logic and caps

This preserves clean separation of responsibilities:

- Detection Engine finds patterns
- Risk Scoring Engine calculates score
- Policy Engine decides action

---

# 15. Integration with the Trust Graph

In later phases, detection outputs should also update graph entities and edges.

Examples:

- agent linked to malicious infrastructure
- organization linked to repeated abusive agents
- wallet linked to abuse patterns
- shared IP cluster marked high risk

This allows detections to contribute to reputation propagation and coordinated attack intelligence.

---

# 16. Storage Model

Detection outputs should be stored separately from raw events.

Recommended stores:

## Raw Event Store
Immutable source telemetry for audit and replay.

## Detection Store
Triggered detections, risk flags, explanation records, and evaluation metadata.

## Aggregate State Store
Rolling counters, windows, baselines, and correlation state.

Suggested technology options may include:

- Kafka or Redpanda for streaming
- Postgres for durable detection records
- ClickHouse for analytics
- Redis for short-lived rolling state
- object storage for raw event retention

---

# 17. Privacy and Data Handling

The Detection Engine should follow privacy-preserving design principles.

Principles:

- prefer derived signals over raw payload storage
- avoid retaining sensitive request content unless required
- allow local-only deployments
- support anonymized identifiers for federation
- preserve organization ownership of raw telemetry

When content inspection is required, the engine should favor:

- boolean indicators
- entropy scores
- signature matches
- pattern classifications

instead of storing full raw content.

---

# 18. Failure and Safety Considerations

The Detection Engine must be resilient and safe under failure.

Requirements:

- fail open or fail closed should be configurable
- rule evaluation failures should be logged
- malformed events should be quarantined
- rule versions must be traceable
- duplicate event handling should be supported
- replay should be possible from raw event history

The system should avoid making irreversible policy decisions based solely on non-explainable detections.

---

# 19. MVP Scope

The MVP Detection Engine should focus on a narrow, high-value subset.

## MVP Detection Methods

- rule-based detection
- threshold detection
- signature detection

## MVP Detection Categories

- high request velocity
- suspicious ASN / proxy network
- repeated authentication failures
- endpoint enumeration
- prompt injection patterns
- exploit payload indicators

## MVP Outputs

- risk flags
- severity
- confidence
- scoring inputs
- dashboard-visible explanations

This aligns with the MVP platform and roadmap phases already defined for Carapace.

---

# 20. Future Expansion

The Detection Engine should evolve over time.

Future capabilities may include:

- ML-based anomaly detection
- graph-native detections
- campaign detection
- automated rule generation
- organization-specific baselines
- adaptive thresholds
- federated intelligence ingestion
- simulation and replay testing
- benchmark-driven detector tuning

---

# Summary

The Detection Engine is the behavioral analysis core of the Carapace platform.

It transforms raw telemetry into structured detections by evaluating:

- rules
- thresholds
- temporal patterns
- correlation patterns
- signatures
- anomalies

Its outputs power:

- risk scoring
- trust graph intelligence
- investigation workflows
- policy enforcement
- dashboard visibility

The Detection Engine allows Carapace to convert standardized agent telemetry into actionable behavioral trust intelligence.