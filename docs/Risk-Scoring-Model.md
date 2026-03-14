# AI Agent Trust Layer

## Risk Scoring Model

This document defines the **risk scoring methodology** used to evaluate AI agent trustworthiness.

The goal is to produce a **risk score between 0 and 100** based on observed behavior.

---

# 1. Risk Score Overview

Risk Score Range:

0–30 → Low Risk
31–60 → Moderate Risk
61–80 → High Risk
81–100 → Critical Risk

Higher scores represent **greater likelihood of malicious behavior**.

---

# 2. Risk Score Formula

Risk Score =

Base Risk

* Network Risk
* Behavior Risk
* Content Risk
* Economic Risk
* Reputation Adjustment

Each component contributes weighted points.

---

# 3. Base Risk

Every new agent begins with a base score.

Default:

Base Risk = 10

Purpose:

Assume neutral behavior until data accumulates.

---

# 4. Network Risk

Signals from IP and network origin.

Examples:

Datacenter IP → +10
Residential Proxy → +15
Tor Exit Node → +25
High IP Rotation → +12

Maximum Network Risk Contribution:

30 points

---

# 5. Behavior Risk

Signals from request behavior.

Examples:

High Request Velocity → +10
Burst Traffic → +8
Endpoint Enumeration → +15
Session Flooding → +12

Maximum Behavior Risk Contribution:

30 points

---

# 6. Content Risk

Signals from request payloads.

Examples:

Prompt Injection Signature → +20
Exploit Payload → +25
Model Exfiltration Attempt → +30

Maximum Content Risk Contribution:

40 points

---

# 7. Economic Risk

Signals from payment or resource abuse.

Examples:

High Chargeback Rate → +20
Trial Abuse Pattern → +15
Compute Resource Spike → +10

Maximum Economic Risk Contribution:

25 points

---

# 8. Reputation Adjustment

Long-term history can reduce risk.

Examples:

Agent Age > 30 days → −5
Successful Transaction History → −10
Verified Organization → −15

Maximum Reputation Reduction:

−20 points

---

# 9. Risk Flags

In addition to the score, the system produces flags.

Examples:

high_velocity
proxy_network
prompt_injection
token_exfiltration
credential_stuffing
resource_abuse

These flags help organizations interpret the score.

---

# 10. Organization Risk Score

Organizations also receive an aggregate score.

Organization Risk Score =

Average Agent Risk

* Organization Behavior Risk

Purpose:

Detect coordinated agent activity.

---

# 11. Reputation Decay

Risk signals decay over time.

Example decay:

Network flags expire after 7 days
Behavior flags expire after 14 days
Content attack flags expire after 30 days

Purpose:

Allow agents to recover from past behavior.

---

# Summary

The Risk Scoring Model combines behavioral telemetry signals into a single trust score.

This score allows organizations to make automated decisions such as:

Allow
Challenge
Rate Limit
Block

The scoring system is designed to evolve from **rule-based detection to machine learning models** as data volume grows.
