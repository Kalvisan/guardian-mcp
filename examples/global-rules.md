# GuardianMCP - Global Security Scanning Rules

This is an example of user-wide global rules for GuardianMCP vulnerability scanning.
Place this content in your global rules file:

- **macOS/Linux:** `~/.claude/rules.md`
- **Windows:** `%USERPROFILE%\.claude\rules.md`

These rules will apply to ALL your projects where GuardianMCP is enabled.

---

## Universal Security Practices

For any project containing package.json or composer.json files:

### Automatic Security Scanning

#### Security Keyword Detection
When I mention security-related keywords in any language, automatically check for vulnerabilities:
- Keywords: security, vulnerability, CVE, exploit, audit, patch, malware
- Use scan_mode="critical-high-only"
- Report only if CRITICAL or HIGH issues are found

#### Post-Installation Scanning
After running package installation or update commands:
- npm install/update/ci
- yarn install/upgrade
- pnpm install/update
- composer install/update/require

Automatically scan for vulnerabilities using scan_mode="critical-high-only".
Notify me if CRITICAL or HIGH severity vulnerabilities are detected.

#### Pre-Commit Security Check
Before creating git commits, check for CRITICAL severity vulnerabilities.
If found:
- Show clear warning
- List the vulnerabilities
- Ask for confirmation to proceed

Use scan_mode="critical-high-only" to keep checks fast.

### Manual Scan Behavior

When I explicitly request security scans:
- "check for vulnerabilities" → scan_mode="critical-high-only"
- "full security audit" → scan_mode="full"
- "how many vulnerabilities" → scan_mode="summary"

### Output Preferences

- Keep automatic scan output concise (only CRITICAL/HIGH)
- Include package names and CVE IDs
- Provide update commands (npm update, composer update)
- Add links to vulnerability details
- Use emojis for severity: 🔴 CRITICAL, 🟠 HIGH

---

## Project Type Exceptions

### High-Security Projects
For projects in directories containing "production", "prod", "release", or "deploy":
- Use scan_mode="full" for all automatic scans
- Scan on project start automatically
- Block commits if ANY vulnerabilities exist (not just CRITICAL)

### Development/Test Projects
For projects in directories containing "test", "demo", "playground", or "sandbox":
- Only scan on explicit request
- Don't auto-scan on project start or package installation
- Use scan_mode="critical-high-only" when scanning

### Open Source Projects
For projects with README.md mentioning "open source" or containing CONTRIBUTING.md:
- Scan before suggesting any git push or release
- Use scan_mode="full" for comprehensive checks
- Suggest creating security policy (SECURITY.md) if missing

---

## Notification Preferences

### When to Stay Silent
Don't notify me if:
- No vulnerabilities found
- Only LOW severity issues (unless I ask for full scan)
- I'm in the middle of a different task (wait for appropriate moment)

### When to Notify
Always notify me if:
- CRITICAL vulnerabilities found
- Multiple HIGH severity issues (3+)
- After I run package installation commands
- I use security-related keywords

---

## Integration with Other Tools

### Git Workflow
- Check before commits (as configured above)
- Suggest scanning before pushing to main/master branches
- Remind about security before creating pull requests

### CI/CD Awareness
If I mention "CI", "CD", "pipeline", or "GitHub Actions":
- Suggest adding vulnerability scanning to CI pipeline
- Recommend scan_mode="summary" for pipeline output

### Dependency Management
When I ask about "updating dependencies" or "dependency maintenance":
- Run vulnerability scan first
- Prioritize updates for packages with CRITICAL vulnerabilities
- Show me which updates fix security issues

---

## Multi-Language Support

Detect security keywords in these languages:
- English: security, vulnerability, vulnerabilities, CVE, exploit, patch, audit
- Latvian: drošība, ievainojamība, drošības risks, ievainojamības
- French: sécurité, vulnérabilité, vulnérabilités
- Spanish: seguridad, vulnerabilidad, vulnerabilidades
- German: Sicherheit, Schwachstelle, Schwachstellen
- Russian: безопасность, уязвимость, уязвимости
- Italian: sicurezza, vulnerabilità
- Portuguese: segurança, vulnerabilidade
- Japanese: セキュリティ, 脆弱性
- Chinese: 安全, 漏洞

---

## Best Practices Reminders

### Regular Scanning
If more than 14 days have passed since the last scan in a project:
- Gently remind me to run a security check
- Don't be pushy, just mention it once

### Dependency Updates
When vulnerabilities are found:
- Explain the risk clearly
- Provide specific update commands
- Offer to help update if I ask

### Security Education
When I encounter vulnerabilities:
- Briefly explain what the vulnerability type means (if space permits)
- Link to resources for learning more
- Don't overwhelm with technical jargon

---

## Exclusions

**Don't scan these directories:**
- node_modules/
- vendor/
- .git/
- dist/
- build/
- Any directory starting with "archive-" or "backup-"

**Don't auto-scan these file types:**
- package-lock.json (only scan package.json)
- composer.lock (only scan composer.json)
- yarn.lock
- pnpm-lock.yaml

---

## Privacy & Performance

- Only scan when necessary (follow rules above)
- Cache results for 1 hour to avoid redundant API calls
- Don't scan on every message, only when triggered by rules
- Respect API rate limits

---

## Customization

These are global defaults. To override for specific projects:
1. Create `.claude/rules.md` in the project directory
2. Add project-specific rules
3. Project rules take precedence over global rules

---

## Testing These Rules

To verify these global rules are working:

1. **Open any project with package.json**
   - Mention "security" in your message
   - Claude should automatically scan

2. **Run `npm install`**
   - After completion, Claude should scan dependencies

3. **Try to commit**
   - Say "commit these changes"
   - Claude should check for CRITICAL vulnerabilities first

4. **Ask for full audit**
   - Say "run a full security audit"
   - Claude should use scan_mode="full"

---

## Notes

- These rules apply to all projects where Vulnerability Checker MCP is configured
- You can disable for specific projects by adding `# Disable global security rules` to that project's `.claude/rules.md`
- Adjust aggressiveness based on your comfort level with notifications
- Remember: security is important, but these rules should help, not hinder your workflow
