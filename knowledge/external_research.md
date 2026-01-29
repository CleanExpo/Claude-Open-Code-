# External Research: Claude Code & OpenCode Integration

This document outlines known challenges and research findings regarding the integration of Claude Code and OpenCode within the Unite-Hub ecosystem.

## Key Insights (2026-01-26)

### 1. Subscription & API Access
- **Billing Incompatibility**: Significant reports indicate that Anthropic has restricted the use of Claude Code Pro/Max subscriptions for third-party tools like OpenCode.
- **Pay-Per-Token**: Usage via OpenCode typically requires direct API access (paying per token), which can be more expensive than direct Claude Code subscriptions.
- **Credential Errors**: Users often encounter credential errors when attempting to bridge web-based subscriptions into local API-driven tools.

### 2. Workflow & Performance
- **Dead Time**: Users have reported "dead time" in OpenCode workflows where the agent remains inactive for stretches.
- **Context Management**: AI coding agents are stateless. Efficiency depends heavily on robust onboarding files (e.g., `CLAUDE.md`, `GEMINI.md`) and explicit multi-phase plans for complex tasks.
- **Statelessness**: Without proactive memory management, context window limitations often lead to a cascade of errors in large projects.

### 3. Tool Orchestration
- **Linear Integration**: Tools like Conductor provide tight orchestration between Claude Code and Linear issues, though they add setup complexity.
- **Stability**: Occasional performance glitches have been noted when Anthropic updates message compaction mechanisms, leading to temporary instability in agent workflows.
