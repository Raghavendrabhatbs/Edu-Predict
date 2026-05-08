# Contributing to Edu-Predict

Thank you for your interest in contributing to Edu-Predict! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button on GitHub to create a copy of the repository in your account.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Edu-Predict.git
cd Edu-Predict
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-student-notes` for new features
- `bugfix/fix-login-issue` for bug fixes
- `docs/update-readme` for documentation

### 4. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 5. Commit Your Changes

```bash
git add .
git commit -m "Clear, descriptive commit message"
```

Commit message format:
- Use imperative mood ("add" not "added")
- First line should be concise (max 50 chars)
- Add detailed description if needed

Example:
```
Add mental health assessment feature

- Implement questionnaire form
- Add risk level calculation
- Create notifications for high risk
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill in the PR description:
   - What does this PR do?
   - Why is this change needed?
   - Any related issues?

## Development Guidelines

### TypeScript

- Use strict mode
- Add proper type annotations
- Avoid `any` type
- Use interfaces for object shapes

### React Components

- Use functional components with hooks
- Keep components focused and reusable
- Add PropTypes or TypeScript props
- Use meaningful component names

Example:
```typescript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

### Express Routes

- Group related routes together
- Use middleware for common operations
- Handle errors properly
- Validate input data

Example:
```typescript
router.post('/students/marks', authenticate, authorize(['professor']), async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

### Python Code

- Follow PEP 8 style guide
- Use type hints
- Add docstrings to functions
- Use meaningful variable names

### Testing

- Write tests for new features
- Run existing tests before submitting PR
- Aim for >70% code coverage

```bash
# Backend tests
npm test

# AI Engine tests
python -m pytest
```

### Documentation

- Update README.md for feature changes
- Add comments to complex code
- Update API documentation if adding endpoints
- Document new environment variables

## Issue Reporting

When reporting issues:

1. Check if the issue already exists
2. Use a clear, descriptive title
3. Include steps to reproduce
4. Provide expected vs actual behavior
5. Include system info (OS, Node version, etc.)
6. Attach screenshots if relevant

## Feature Requests

When requesting features:

1. Use a clear, descriptive title
2. Describe the use case
3. Explain the expected behavior
4. Suggest implementation if possible
5. Add mockups or examples

## Pull Request Process

1. Update documentation as needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Request review from maintainers
5. Address feedback and make changes
6. Maintainers will merge when approved

## Code Review Process

All contributions go through code review. Reviewers will check:

- Code quality and style
- Test coverage
- Documentation accuracy
- Security issues
- Performance implications
- Breaking changes

## Getting Help

- Check existing documentation
- Search for similar issues
- Ask in pull request comments
- Contact maintainers directly

## Project Structure

```
Edu-Predict/
├── backend/          # Express.js API
├── frontend/         # React application
├── ai-engine/        # Python ML service
├── database/         # PostgreSQL schemas
└── docs/             # Documentation
```

## Running Locally

See SETUP.md for detailed setup instructions.

## Commit Checklist

Before committing:

- [ ] Code follows project style
- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] Comments are clear
- [ ] No debug code left
- [ ] Documentation updated

## Reporting Security Issues

Do NOT open public issues for security vulnerabilities. Please email security details to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to ask in:
- GitHub Issues
- Pull Request comments
- Project discussions

Thank you for contributing to Edu-Predict!
