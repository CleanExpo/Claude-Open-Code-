# Unite-Hub Linear Workspace Mapping

This document provides a technical mapping of Linear.app team and project identifiers for the Unite-Hub ecosystem.

## Team Information
- **Name**: Unite-Hub
- **ID**: `ab9c7810-4dd6-4ce2-8e8f-e1fc94c6b88b`
- **Identifier Prefix**: `UNI`

## Project Mapping

| Project Name | Linear ID | Description/Context |
|--------------|-----------|----------------------|
| **Claude Code-OpenCode** | `58fff77a-eebd-4e17-b7cc-0a6c4feaa92c` | Main development project for the current repository. |
| **Synthex** | `3125c6e4-b729-48d4-a718-400a2b83ddc5` | Social swarm orchestration. |
| **Restore Assist** | `6f2a5c24-77fb-44e5-848f-aad3f5e347c7` | Operational restoration and safety protocols. |
| **CCW-ERP/CRM** | `40c7dc3d-35ff-4e2c-ac1e-f903c1f5c856` | Enterprise planning and CRM tools. |
| **DR - NRPG** | `61b77d0d-ecbb-4399-afd8-f3153d2ec4db` | Strategic blueprints and narrative engine. |
| **ATO** | `20bb0ca6-0176-46c4-be4c-cd34ac89767d` | (Context pending) |
| **Unite-Hub** | `b62d9b14-9d9c-46c7-a3f4-05fbd49550ff` | Central ecosystem management. |

## Key Issues Discovered (Claude Code Context)
The following issues were identified as relevant to the "Claude Code" development path:

- **UNI-82**: [UH-PROD] Resolve remaining 26 TODO/FIXME comments
- **UNI-77**: [UH-P5] Add Code Execution + Files API + Tool Search
- **UNI-65**: [UH-P1] Update Anthropic client with new features
- **UNI-59**: [RA-V3] AI Report Enhancement (Photo Analysis)
- **UNI-40**: [RA-V1.5] Performance Audit (LCP, bundle size)
- **UNI-12**: [RA-V1.1] Visual moisture mapping (floor plan overlay)

## Operational Usage
When interacting with Linear via MCP tools:
1. **Team ID**: Use `ab9c7810-4dd6-4ce2-8e8f-e1fc94c6b88b` for team-wide queries.
2. **Project Filtering Issue**: Filtering issues by the specific Project ID for **Claude Code-OpenCode** (`58fff77a-eebd-4e17-b7cc-0a6c4feaa92c`) currently returns an empty list.
3. **Recommended Search Strategy**: To retrieve issues for this repository, query by the keyword `Claude` or the team prefix `[UH-`. Relevant issues are identified with the `UNI-` identifier.
4. **Issue Verification**: As of 2026-01-26, no `UNI-` identifiers were found within the local repository's source code, suggesting manual lookup is required.
