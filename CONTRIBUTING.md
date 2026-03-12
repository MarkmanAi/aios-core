# Contributing to MarkmanAi AIOS

> **PROPRIETARY SOFTWARE — Yahweh Group**

This repository contains proprietary and confidential software owned exclusively by **Yahweh Group**.

## External Contributions

**External contributions are not accepted.**

This is not an open-source project. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited without the express written permission of Yahweh Group.

See [LICENSE](LICENSE) for full terms.

## Internal Development

This section is for authorized Yahweh Group personnel only.

### Development Workflow

Internal development follows the AIOS Story-Driven workflow:

```
@po *create-story → @dev implements → @qa reviews → @devops push
```

### Commit Conventions

Conventional Commits format:

```
feat: add feature [Story X.Y]
fix: resolve bug [Story X.Y]
chore: maintenance task
docs: documentation update
```

### Quality Gates

All changes must pass before push:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

### Internal Contact

For development questions, contact the Yahweh Group engineering team directly.

---

*Yahweh Group — All Rights Reserved*
