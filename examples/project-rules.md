# Project Security Rules

This is an example of project-specific rules for vulnerability scanning.
Place this content in `.claude/rules.md` in your project root.

---

## Security Scanning Configuration

### Automatic Vulnerability Checks

This project uses GuardianMCP for proactive security monitoring.
Automatically run security scans in the following situations:

#### 1. When I first start working in this project
Run check_vulnerabilities with scan_mode="critical-high-only" to check for critical issues.
Only alert me if CRITICAL or HIGH severity vulnerabilities are found.

#### 2. When I mention security-related keywords
If I say words like: security, vulnerability, CVE, exploit, patch, or audit,
automatically check for vulnerabilities using scan_mode="critical-high-only".

#### 3. After installing or updating packages
After running npm install, npm update, composer install, or composer update,
scan dependencies for new vulnerabilities. Use scan_mode="critical-high-only".

#### 4. Before creating git commits
Before I commit code, verify there are no CRITICAL severity vulnerabilities.
If critical issues are found, warn me and ask if I want to proceed.

### Manual Scan Requests

When I explicitly ask for a "full security audit" or "complete scan",
use scan_mode="full" to show all vulnerabilities including moderate and low severity.

### Output Preferences

- For automatic scans: Only show CRITICAL and HIGH severity issues
- For manual requests: Show appropriate detail based on my question
- Include actionable remediation steps for all critical vulnerabilities
- Provide links to vulnerability details when available

---

## Project-Specific Context

This is a [description of your project - e.g., "production web application" or "internal tool"].

Security priority level: [High/Medium/Low]

Dependencies we're particularly concerned about:
- [List key dependencies if any, e.g., "express", "react", "symfony"]

Known acceptable risks:
- [List any vulnerabilities you've assessed and accepted, if any]

---

## Examples

**Scenario:** I run `npm install lodash`
**Expected behavior:** After installation completes, automatically scan for vulnerabilities in lodash and dependencies

**Scenario:** I say "Are there any security issues?"
**Expected behavior:** Run vulnerability scan with scan_mode="critical-high-only" and report findings

**Scenario:** I ask "Give me a full security report"
**Expected behavior:** Run vulnerability scan with scan_mode="full" showing all severity levels

---

## Customization Notes

Adjust these rules based on your project needs:

- **High-security projects**: Change all auto-scans to scan_mode="full"
- **Rapid development**: Only scan on explicit requests
- **Legacy projects**: Add exceptions for known/accepted vulnerabilities
- **Monorepos**: Specify which package.json files to scan

---

## Rule Activation

These rules are active for this project only. To apply similar rules to all your projects,
add them to your global rules file at `~/.claude/rules.md` instead.
