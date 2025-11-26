# GuardianMCP - Comprehensive Rules Template

This file contains comprehensive auto-trigger rules for GuardianMCP.
Copy the sections you need to your project's `.claude/rules.md` or global `~/.claude/rules.md`.

## Basic Auto-Scan Configuration

When working in this project, automatically check for CRITICAL and HIGH severity
vulnerabilities in the following scenarios:

1. **Project Start**: When first opening this project, scan dependencies
2. **Security Keywords**: When I mention: security, vulnerability, CVE, audit, exploit, patch
3. **After Package Changes**: After running npm install, npm update, composer install, or composer update
4. **Before Commits**: Before creating git commits, verify no CRITICAL vulnerabilities exist

Use the check_vulnerabilities tool with scan_mode="critical-high-only" for automatic scans.
Only report CRITICAL and HIGH severity issues unless I explicitly ask for full details.

---

## Detailed Rules (Pick and Choose)

### 1. Project Initialization Auto-Scan

When starting work in a project directory that contains package.json or composer.json,
automatically run the check_vulnerabilities tool with scan_mode="critical-high-only".

Only report findings if CRITICAL or HIGH severity vulnerabilities are detected.
Stay silent if no serious vulnerabilities are found.

### 2. Multi-Language Security Keyword Detection

When the user mentions any security-related keywords in any language, automatically
check for vulnerabilities using scan_mode="critical-high-only".

Supported keywords:
- English: security, vulnerability, vulnerabilities, CVE, exploit, patch, audit, malware
- Latvian: drošība, ievainojamība, drošības risks, ievainojamības
- French: sécurité, vulnérabilité, vulnérabilités
- Spanish: seguridad, vulnerabilidad, vulnerabilidades
- German: Sicherheit, Schwachstelle, Schwachstellen
- Russian: безопасность, уязвимость, уязвимости
- Italian: sicurezza, vulnerabilità
- Portuguese: segurança, vulnerabilidade

Report findings clearly with severity levels highlighted.

### 3. Post-Installation Dependency Scanning

After successfully running any of these package management commands:
- npm install / npm i
- npm update
- npm ci
- yarn install / yarn
- yarn upgrade
- pnpm install
- pnpm update
- composer install
- composer update
- composer require

Automatically scan the dependencies for vulnerabilities using scan_mode="critical-high-only".

If CRITICAL or HIGH vulnerabilities are found, notify the user with:
- Number of vulnerabilities
- Package names affected
- Recommended immediate actions

### 4. Pre-Commit Security Gate

Before creating a git commit (when user asks to commit changes, create a commit, or run git commit),
automatically check for CRITICAL severity vulnerabilities.

If CRITICAL vulnerabilities are found:
1. Display a clear warning with ⚠️ emoji
2. List the critical vulnerabilities
3. Ask the user: "Critical security vulnerabilities detected. Do you want to proceed with the commit anyway?"
4. Wait for user confirmation before proceeding

Use scan_mode="critical-high-only" for this check to keep it fast.

### 5. Build-Time Security Check

Before running build commands:
- npm run build
- npm run production
- yarn build
- composer build
- make build

Check for CRITICAL vulnerabilities and warn the user if any are found.
Don't block the build, but make the warning very visible.

Use scan_mode="critical-high-only".

### 6. Periodic Security Reminders

At the start of each new day (first message of the day in a project),
if more than 7 days have passed since the last dependency update,
remind the user to run a security scan:

"It's been a while since the last dependency check. Would you like me to scan for vulnerabilities?"

If user agrees, run check_vulnerabilities with scan_mode="critical-high-only".

### 7. When User Adds New Dependencies

If you observe the user manually adding a new package to package.json or composer.json
(by editing the file directly), suggest running a vulnerability check after they save.

For example: "I noticed you added a new dependency. Would you like me to check it for known vulnerabilities?"

### 8. Full Audit on Request

When the user explicitly asks for a "full security audit", "complete vulnerability scan",
or "detailed security report", use scan_mode="full" to show ALL vulnerabilities
including MODERATE and LOW severity issues.

---

## Scan Mode Selection Guide

**Use scan_mode="critical-high-only" for:**
- Auto-scans (project start, post-install, pre-commit)
- Background monitoring
- Routine checks
- When you want to minimize noise

**Use scan_mode="summary" for:**
- Quick status checks
- Dashboard views
- When user asks "how many vulnerabilities"
- CI/CD pipelines

**Use scan_mode="full" for:**
- Comprehensive security audits
- When user explicitly asks for "all vulnerabilities"
- Before major releases
- Compliance reviews

---

## Customization Tips

1. **Adjust aggressiveness**: If auto-scans are too noisy, only trigger on CRITICAL (not HIGH)
2. **Project-specific**: For high-security projects, use scan_mode="full" on all auto-scans
3. **CI/CD integration**: Use scan_mode="summary" for pipeline status checks
4. **Time-based**: Only auto-scan during business hours to avoid notification fatigue
5. **Selective scanning**: Only scan package.json OR composer.json if your project uses one

---

## Example Usage

Once these rules are active, the following interactions will trigger automatic scans:

**User:** "Let me commit these changes"
**Claude:** *Automatically runs vulnerability check before commit*

**User:** "npm install express"
**Claude:** *Waits for command completion, then scans for vulnerabilities*

**User:** "Is our app secure?"
**Claude:** *Detects "secure" keyword, runs vulnerability scan*

**User:** "Check for security issues"
**Claude:** *Runs full vulnerability scan*

---

## Testing Your Rules

To verify rules are working:

1. Mention the word "security" in a message
2. Run `npm install` or `composer install`
3. Try to create a git commit
4. Ask "scan my project for vulnerabilities"

Claude should automatically use the check_vulnerabilities tool in these scenarios.

---

## Notes

- These rules work with both project-level (`.claude/rules.md`) and global (`~/.claude/rules.md`) rules files
- More specific project rules take precedence over global rules
- You can combine multiple rules - Claude will follow all applicable ones
- Adjust language keywords based on your team's primary languages
