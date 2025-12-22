# @christianai/shared

Shared types and utilities for the christianai monorepo.

## Usage

### Types

```typescript
import type { APIResponse } from "@christianai/shared/types/api/response";
import type { User, WaitlistInsert } from "@christianai/shared/types/api/models";
```

### Utils

```typescript
import { validateEmail, isValidEmail } from "@christianai/shared/utils/index";
```

## Development

```bash
bun run typecheck
```