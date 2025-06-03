# Contributing to Harvest Quote Connect

Thank you for your interest in contributing to Harvest Quote Connect! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Provide detailed information about the issue
- Include steps to reproduce the problem
- Add screenshots if applicable

### Suggesting Features
- Open an issue with the "feature request" label
- Describe the feature and its benefits
- Explain the use case and expected behavior

### Code Contributions

#### 1. Fork and Clone
```bash
git clone https://github.com/YOUR_USERNAME/harvest-quote-connect.git
cd harvest-quote-connect
```

#### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

#### 3. Make Changes
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

#### 4. Test Your Changes
```bash
npm install
npm run dev
npm run lint
npm run build
```

#### 5. Commit and Push
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

#### 6. Create Pull Request
- Open a pull request against the main branch
- Provide a clear description of changes
- Link related issues

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop types

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design

### File Organization
```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── admin/           # Admin-specific components
│   └── auth/            # Authentication components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── lib/                 # Utility functions
└── types/               # TypeScript definitions
```

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
- Add tests for new features
- Test both happy path and edge cases
- Use descriptive test names

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Update README.md for new features

### API Documentation
- Document new API endpoints
- Include request/response examples
- Update Supabase schema documentation

## 🔒 Security

### Reporting Security Issues
- Do not open public issues for security vulnerabilities
- Email security concerns to: veascom.telecom.systems@gmail.com
- Provide detailed information about the vulnerability

### Security Guidelines
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Follow secure coding practices

## 📋 Pull Request Checklist

Before submitting a pull request, ensure:

- [ ] Code follows the project style guidelines
- [ ] Tests pass locally
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] No sensitive data is included
- [ ] Changes are backwards compatible (if applicable)

## 🏷️ Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add email verification
fix(cart): resolve quantity update issue
docs(readme): update installation instructions
```

## 🌟 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

## 📞 Getting Help

- Join our discussions in GitHub Discussions
- Ask questions in issues with the "question" label
- Contact maintainers: veascom.telecom.systems@gmail.com

## 📄 License

By contributing to Harvest Quote Connect, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Harvest Quote Connect! 🌾
