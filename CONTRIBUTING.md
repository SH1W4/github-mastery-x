# Contributing to GitFlow AI 🤝

First off, thank you for considering contributing to GitFlow AI! It's people like you that make GitFlow AI such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/gitflow-ai.git`
3. Add upstream remote: `git remote add upstream https://github.com/NEO-SH1W4/gitflow-ai.git`
4. Create a branch: `git checkout -b feature/amazing-feature`

---

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues. When you create a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **System information**

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Your First Code Contribution 🎉

Unsure where to begin? Look for these labels:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

---

## Development Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run tests
npm test

# Start development server
npm run dev
```

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- GitHub account

---

## Style Guidelines

### TypeScript Style Guide

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public APIs

```typescript
/**
 * Process GitHub webhook events
 * @param event - The webhook event payload
 * @returns Processed event result
 */
export async function processWebhook(event: WebhookEvent): Promise<ProcessedEvent> {
  // Implementation
}
```

### Python Style Guide

- Follow PEP 8
- Use type hints
- Write docstrings for all functions

```python
def analyze_commit(commit_hash: str) -> AnalysisResult:
    """
    Analyze a git commit for patterns and suggestions.
    
    Args:
        commit_hash: The SHA of the commit to analyze
        
    Returns:
        AnalysisResult containing insights and suggestions
    """
    # Implementation
```

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```
feat(analytics): add commit frequency chart

Add a new chart showing commit frequency over time to help users
understand their development patterns.

Closes #123
```

```
fix(auth): resolve OAuth token refresh issue

The token refresh was failing due to incorrect timestamp comparison.
This fix ensures tokens are refreshed before expiration.

Fixes #456
```

---

## Pull Request Process

1. **Update documentation** for any changed functionality
2. **Add tests** for new features
3. **Ensure all tests pass**: `npm test`
4. **Update CHANGELOG.md** following Keep a Changelog format
5. **Request review** from maintainers

### PR Title Format

Follow the same convention as commit messages:
- `feat: add GitHub Actions integration`
- `fix: resolve memory leak in webhook processor`
- `docs: update API documentation`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

---

## Community

### Communication Channels

- **GitHub Discussions**: General discussions and questions
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions

### Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Special badges for significant contributions

---

## Development Tips

### Running Specific Tests

```bash
# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

### Debugging

```bash
# Enable debug logging
DEBUG=gitflow:* npm run dev

# Run with inspector
node --inspect npm run dev
```

### Building

```bash
# Build for production
npm run build

# Build and analyze bundle
npm run build:analyze
```

---

## Questions?

Feel free to ask questions in:
- [GitHub Discussions](https://github.com/NEO-SH1W4/gitflow-ai/discussions)
- Create an issue with the `question` label

---

<div align="center">
  <p>
    <strong>Thank you for contributing to GitFlow AI!</strong>
  </p>
  <p>
    Together, we're building the future of GitHub automation 🚀
  </p>
</div>
