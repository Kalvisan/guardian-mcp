# Security Policy

## Supported Versions

GuardianMCP is actively maintained. We recommend always using the latest version for the best security and features.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Audit Status

### Latest Audit: 2025-01-26

✅ **No vulnerabilities found**

```bash
npm audit
found 0 vulnerabilities
```

### Dependencies Status

All dependencies are up-to-date and secure:

| Package | Current Version | Status |
|---------|----------------|--------|
| @modelcontextprotocol/sdk | 1.23.0 | ✅ Latest |
| node-fetch | 3.3.2 | ✅ Latest |
| @types/node | 22.19.1 | ✅ Latest (for Node 22) |
| typescript | 5.9.3 | ✅ Latest |

**Total dependencies audited:** 96 packages
**Vulnerabilities found:** 0
**Production dependencies:** 91
**Development dependencies:** 3

## Reporting a Vulnerability

If you discover a security vulnerability in GuardianMCP, please report it by:

1. **Email**: Create an issue at https://github.com/Kalvisan/guardian-mcp/issues
2. **Mark as security issue**: Label it as "security"
3. **Provide details**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### What to expect:

- **Response time**: We aim to respond within 48 hours
- **Fix timeline**: Critical vulnerabilities will be patched within 7 days
- **Disclosure**: We follow responsible disclosure practices

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version of GuardianMCP
   ```bash
   npm update -g guardian-mcp
   ```

2. **Docker Security**: When using Docker, regularly rebuild images
   ```bash
   docker pull node:22-alpine
   docker build -t guardian-mcp:latest .
   ```

3. **Review Results**: Always review vulnerability reports before taking action
4. **Test Updates**: Test dependency updates in development before production

### For Contributors

1. **Dependency Updates**: Run `npm audit` before submitting PRs
2. **No Sensitive Data**: Never commit API keys, tokens, or credentials
3. **Code Review**: All changes require review before merging
4. **Testing**: Ensure all tests pass and no new vulnerabilities are introduced

## Security Features

GuardianMCP implements several security measures:

- ✅ **Read-only operations**: Only reads dependency files, never modifies
- ✅ **No network access**: Only communicates with OSV.dev public API
- ✅ **No data collection**: Doesn't collect or transmit user data
- ✅ **Minimal dependencies**: Small dependency tree reduces attack surface
- ✅ **Docker isolation**: Can run in isolated container
- ✅ **Non-root user**: Docker container runs as non-root user

## Regular Maintenance

We perform regular security maintenance:

- **Weekly**: Automated dependency checks via GitHub Dependabot
- **Monthly**: Manual security audit review
- **Per release**: Full `npm audit` before publishing

## External Security Audits

GuardianMCP uses industry-standard security tools:

- **OSV.dev**: Open Source Vulnerabilities database
- **npm audit**: Built-in npm security auditing
- **GitHub Security Advisories**: Automated vulnerability alerts

## Node.js Version Support

GuardianMCP requires:
- **Minimum**: Node.js 20.0.0 (LTS)
- **Recommended**: Node.js 22.x (Latest)
- **npm**: 9.0.0 or higher

We follow the [Node.js Release Schedule](https://nodejs.org/en/about/releases/) and drop support for versions that reach end-of-life.

## License

This security policy is part of GuardianMCP and licensed under MIT.

---

**Last updated:** 2025-01-26
**Next scheduled review:** 2025-02-26
