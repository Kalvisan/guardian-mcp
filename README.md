# GuardianMCP 🛡️

Your vigilant security companion that automatically guards your projects against vulnerabilities.

GuardianMCP is an MCP (Model Context Protocol) server that scans project dependencies for known security vulnerabilities using the OSV.dev database. Works with **Cursor**, **VS Code**, **Claude Desktop**, and other MCP-compatible IDEs.

## Features

- 🛡️ **Automatic vulnerability scanning** for npm and Composer dependencies
- 🚨 **Real-time alerts** for CRITICAL and HIGH severity issues
- 🎯 **Three scan modes**: full, summary, critical-high-only
- 🔄 **Auto-trigger support** via IDE rules (on install, commit, build)
- 🌍 **Multi-language keyword detection** (English, Latvian, French, Spanish, German, Russian, etc.)
- 🐳 **Docker support** for containerized deployment
- 📊 **Detailed reports** with remediation guidance and CVE links
- ⚡ **Fast & lightweight** using OSV.dev API
- 🔒 **Secure by design** - 0 vulnerabilities, minimal dependencies

## Security Status

![npm audit](https://img.shields.io/badge/npm%20audit-0%20vulnerabilities-brightgreen)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)

✅ **Latest security audit:** All dependencies scanned, 0 vulnerabilities found
✅ **Node.js:** Latest LTS (22.x) with security updates
✅ **Regular updates:** Weekly dependency checks and monthly security reviews

See [SECURITY.md](SECURITY.md) for our security policy and audit details.

## Quick Start

Choose your preferred method:

### Option 1: npm (Recommended for most users)

```bash
npm install -g guardian-mcp
```

### Option 2: From Source

```bash
git clone https://github.com/Kalvisan/guardian-mcp.git
cd guardian-mcp
npm install
npm run build
```

### Option 3: Docker

```bash
docker pull guardian-mcp:latest
# or
docker-compose up -d
```

---

## IDE Setup Instructions

Click on your IDE to see setup instructions:

<details>
<summary><b>🎯 Cursor Editor (Recommended)</b></summary>

### Cursor Setup

Cursor has native MCP support. Follow these steps:

#### 1. Install GuardianMCP

```bash
npm install -g guardian-mcp
# or use local installation (see Quick Start)
```

#### 2. Configure Cursor

Open Cursor settings:
- **macOS/Linux**: `~/.cursor/config.json` or `Cursor Settings > Features > MCP Servers`
- **Windows**: `%APPDATA%\Cursor\config.json`

Add GuardianMCP configuration:

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "npx",
      "args": ["guardian-mcp"]
    }
  }
}
```

**Or if installed locally:**

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/guardian-mcp/dist/index.js"]
    }
  }
}
```

#### 3. Enable Auto-Scanning (Optional)

Create `.cursor/rules.md` in your project:

```markdown
# Security Rules

When working in this project:
- Check for CRITICAL/HIGH vulnerabilities on project start
- Scan after npm install or composer update
- Verify no critical issues before git commits

Use check_vulnerabilities tool with scan_mode="critical-high-only".
```

#### 4. Restart Cursor

Completely restart Cursor to load GuardianMCP.

#### 5. Test It

Open Cursor's AI chat and type:
```
Check my project for security vulnerabilities
```

GuardianMCP will automatically scan your dependencies!

</details>

<details>
<summary><b>💻 Visual Studio Code</b></summary>

### VS Code Setup

VS Code can use MCP servers through extensions or configuration.

#### Method 1: Using Continue.dev Extension

1. Install [Continue.dev](https://marketplace.visualstudio.com/items?itemName=Continue.continue) extension
2. Open Continue settings (`.continue/config.json`)
3. Add MCP server configuration:

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "npx",
      "args": ["guardian-mcp"]
    }
  }
}
```

#### Method 2: Direct Configuration

1. Install GuardianMCP: `npm install -g guardian-mcp`
2. Add to VS Code settings (`.vscode/settings.json`):

```json
{
  "mcp.servers": {
    "guardian-mcp": {
      "command": "npx",
      "args": ["guardian-mcp"]
    }
  }
}
```

#### 3. Enable Auto-Scanning

Create `.vscode/rules.md`:

```markdown
Automatically check for vulnerabilities when:
- Opening the project
- After running npm install/composer update
- Before creating commits
```

#### 4. Restart VS Code

Reload window: `Cmd/Ctrl + Shift + P` → "Reload Window"

</details>

<details>
<summary><b>🤖 Claude Desktop</b></summary>

### Claude Desktop Setup

Claude Desktop has built-in MCP support.

#### 1. Install GuardianMCP

```bash
npm install -g guardian-mcp
```

#### 2. Configure Claude Desktop

Open configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Add GuardianMCP:

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "npx",
      "args": ["guardian-mcp"]
    }
  }
}
```

**Or for local installation:**

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "node",
      "args": ["/Users/you/path/to/guardian-mcp/dist/index.js"]
    }
  }
}
```

#### 3. Configure Auto-Scanning

Add to `~/.claude/rules.md` (global) or project's `.claude/rules.md`:

```markdown
# GuardianMCP Rules

Automatically scan for vulnerabilities when:
1. User mentions: security, vulnerability, CVE, audit
2. After package installations
3. Before git commits

Use scan_mode="critical-high-only" for auto-scans.
```

#### 4. Restart Claude Desktop

Completely quit and reopen Claude Desktop.

</details>

<details>
<summary><b>🌊 Windsurf Editor</b></summary>

### Windsurf Setup

Windsurf supports MCP servers similar to Cursor.

#### 1. Install GuardianMCP

```bash
npm install -g guardian-mcp
```

#### 2. Configure Windsurf

Open Windsurf configuration:
- **Location**: `~/.windsurf/config.json`

Add MCP server:

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "npx",
      "args": ["guardian-mcp"]
    }
  }
}
```

#### 3. Create Project Rules

Add `.windsurf/rules.md` to your project:

```markdown
Auto-scan dependencies for vulnerabilities on:
- Project initialization
- npm/composer commands
- Pre-commit checks
```

#### 4. Restart Windsurf

Reload the editor to activate GuardianMCP.

</details>

<details>
<summary><b>⚡ Zed Editor</b></summary>

### Zed Setup

Zed is adding MCP support. Check current status:

#### 1. Install GuardianMCP

```bash
npm install -g guardian-mcp
```

#### 2. Configure Zed

Open Zed settings:
- **macOS**: `~/.config/zed/settings.json`
- **Linux**: `~/.config/zed/settings.json`

Add configuration:

```json
{
  "assistant": {
    "mcp_servers": {
      "guardian-mcp": {
        "command": "npx",
        "args": ["guardian-mcp"]
      }
    }
  }
}
```

#### 3. Restart Zed

Reload the editor.

**Note**: MCP support in Zed may be experimental. Check [Zed documentation](https://zed.dev/docs) for latest status.

</details>

<details>
<summary><b>🐳 Docker Setup (Any IDE)</b></summary>

### Docker Setup

Run GuardianMCP in a Docker container and connect from any IDE.

#### Method 1: Using Docker Compose (Recommended)

1. **Clone the repository:**

```bash
git clone https://github.com/Kalvisan/guardian-mcp.git
cd guardian-mcp
```

2. **Build and run:**

```bash
docker-compose up -d
```

3. **Configure your IDE:**

In your IDE's MCP configuration, use:

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "docker",
      "args": ["exec", "-i", "guardian-mcp", "node", "dist/index.js"]
    }
  }
}
```

#### Method 2: Docker Run

1. **Build the image:**

```bash
docker build -t guardian-mcp:latest .
```

2. **Run the container:**

```bash
docker run -d --name guardian-mcp \
  -v /path/to/your/projects:/projects:ro \
  guardian-mcp:latest
```

3. **Configure your IDE:**

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "docker",
      "args": ["exec", "-i", "guardian-mcp", "node", "dist/index.js"]
    }
  }
}
```

#### For Cursor with Docker:

Edit `~/.cursor/config.json`:

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "docker",
      "args": ["exec", "-i", "guardian-mcp", "node", "dist/index.js"]
    }
  }
}
```

#### Volume Mounting

To scan projects outside the container:

```bash
docker run -d --name guardian-mcp \
  -v /Users/you/projects:/projects:ro \
  -v /Users/you/work:/work:ro \
  guardian-mcp:latest
```

Then scan with:
```
Scan /projects/my-app for vulnerabilities
```

#### Docker Health Check

```bash
docker ps --filter name=guardian-mcp
# Should show "healthy" status
```

#### Stopping the Container

```bash
docker-compose down
# or
docker stop guardian-mcp && docker rm guardian-mcp
```

</details>

<details>
<summary><b>🔧 Other IDEs / Custom Setup</b></summary>

### Generic MCP Setup

For any IDE that supports Model Context Protocol:

#### 1. Install GuardianMCP

```bash
npm install -g guardian-mcp
```

#### 2. Find Your IDE's MCP Configuration

Common locations:
- `~/.config/[IDE_NAME]/config.json`
- `~/.config/[IDE_NAME]/settings.json`
- `~/.[IDE_NAME]/mcp.json`

#### 3. Add GuardianMCP

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "npx",
      "args": ["guardian-mcp"]
    }
  }
}
```

Or with full path:

```json
{
  "mcpServers": {
    "guardian-mcp": {
      "command": "node",
      "args": ["/full/path/to/guardian-mcp/dist/index.js"]
    }
  }
}
```

#### 4. Verify Setup

Test by asking your IDE's AI assistant:
```
Use the check_vulnerabilities tool to scan my project
```

</details>

---

## Usage

Once GuardianMCP is installed in your IDE, you can:

### Manual Scanning

Simply ask your AI assistant:

```
Check my project for security vulnerabilities
```

```
Scan package.json for critical issues only
```

```
Give me a full security audit
```

### Automatic Scanning

Configure rules in your IDE's rules file (`.cursor/rules.md`, `.claude/rules.md`, etc.):

```markdown
# Security Automation

When I mention: security, vulnerability, CVE, audit, or exploit
→ Run check_vulnerabilities with scan_mode="critical-high-only"

After running: npm install, npm update, composer install, composer update
→ Automatically scan for new vulnerabilities

Before creating git commits:
→ Check for CRITICAL vulnerabilities and warn if found
```

## Tool Parameters

GuardianMCP provides the `check_vulnerabilities` tool with these parameters:

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| `project_path` | string | any path | current dir | Path to project directory |
| `file_type` | string | `package.json`, `composer.json`, `both` | `both` | Which files to scan |
| `scan_mode` | string | `full`, `summary`, `critical-high-only` | `full` | Output detail level |

### Examples

**Full scan:**
```
Check vulnerabilities with scan_mode="full"
```

**Quick summary:**
```
How many vulnerabilities are in my project? (uses scan_mode="summary")
```

**Auto-scan mode (recommended):**
```
Scan for critical vulnerabilities only (scan_mode="critical-high-only")
```

## Scan Modes Explained

### 🔍 `full` Mode
**Best for:** Manual security audits, comprehensive reviews

Shows ALL vulnerabilities with complete details:
- CRITICAL, HIGH, MODERATE, and LOW severity
- Detailed descriptions and remediation steps
- Reference links and CVE IDs
- Update commands for each package

**Example output:**
```markdown
## 🔴 express@4.17.1
**Vulnerability ID:** GHSA-rv95-896h-c2vc
**Severity:** CRITICAL

### ⚠️ CRITICAL RISK!
**Description:** Express.js accepts requests with malformed URL encoding

**IMMEDIATE ACTION REQUIRED:**
1. Update package: npm update express
2. Verify no vulnerable functionality is used
...
```

### 📊 `summary` Mode
**Best for:** Quick health checks, CI/CD dashboards

Shows only vulnerability counts:
- Fast overview
- No detailed descriptions
- Total counts by severity

**Example output:**
```markdown
## 📊 Summary
- 🔴 Critical: 2
- 🟠 High: 5
- 🟡 Moderate: 12
- 🟢 Low: 3

**Total: 22 vulnerabilities**
Run with scan_mode="full" for details.
```

### 🎯 `critical-high-only` Mode
**Best for:** Auto-scans, automated monitoring (RECOMMENDED for rules)

Shows detailed info for CRITICAL/HIGH, counts others:
- Reduces noise
- Highlights actionable issues
- Perfect for automatic scans
- Hides moderate/low details

**Example output:**
```markdown
## 🔴 lodash@4.17.20
**Severity:** HIGH
**Issue:** Prototype pollution vulnerability
**Recommendation:** npm update lodash

---

## 📊 Summary
- 🔴 Critical: 1
- 🟠 High: 2

_Also found 8 moderate/low issues (hidden)._
_Run with scan_mode="full" to see all._
```

## Severity Levels

| Level | Icon | Action | Examples |
|-------|------|--------|----------|
| **CRITICAL** | 🔴 | Update IMMEDIATELY | RCE, Auth bypass, Privilege escalation |
| **HIGH** | 🟠 | Update ASAP | SQL injection, XSS, CSRF |
| **MODERATE** | 🟡 | Plan update | DoS, Information disclosure |
| **LOW** | 🟢 | Consider updating | Deprecated packages, Minor issues |

## Example Rules Files

See [`examples/`](examples/) for ready-to-use templates:

- **`claude-rules.md`** - Comprehensive template with all scenarios
- **`project-rules.md`** - Project-specific configuration example
- **`global-rules.md`** - User-wide configuration for all projects

Copy these to:
- Cursor: `.cursor/rules.md`
- Claude Desktop: `.claude/rules.md`
- VS Code: `.vscode/rules.md` (with Continue.dev)

## Supported Ecosystems

| Ecosystem | File | Status |
|-----------|------|--------|
| **npm** (Node.js) | `package.json` | ✅ Supported |
| **Composer** (PHP) | `composer.json` | ✅ Supported |
| PyPI (Python) | `requirements.txt` | 🔄 Planned |
| Go Modules | `go.mod` | 🔄 Planned |
| Maven (Java) | `pom.xml` | 🔄 Planned |
| NuGet (.NET) | `*.csproj` | 🔄 Planned |
| RubyGems | `Gemfile` | 🔄 Planned |
| Cargo (Rust) | `Cargo.toml` | 🔄 Planned |

## Troubleshooting

<details>
<summary><b>GuardianMCP not showing up in IDE</b></summary>

1. **Verify installation:**
   ```bash
   npx guardian-mcp --version
   # or
   which guardian-mcp
   ```

2. **Check config file path is absolute:**
   - ❌ `"args": ["dist/index.js"]`
   - ✅ `"args": ["/Users/you/guardian-mcp/dist/index.js"]`

3. **Restart IDE completely** (don't just reload window)

4. **Check IDE logs:**
   - Cursor: Open DevTools (Help > Toggle Developer Tools)
   - VS Code: Output panel > Extension Host
   - Claude Desktop: View > Developer > Toggle Developer Tools

5. **Test manually:**
   ```bash
   node /path/to/guardian-mcp/dist/index.js
   # Should not crash
   ```

</details>

<details>
<summary><b>Auto-scanning not working</b></summary>

1. **Verify rules file exists:**
   ```bash
   cat .cursor/rules.md
   # or
   cat .claude/rules.md
   ```

2. **Check rules mention tool name:**
   - Must reference `check_vulnerabilities`
   - Use `scan_mode="critical-high-only"` for auto-scans

3. **Test with keywords:**
   - Try saying "security" or "vulnerability"
   - Should trigger automatic scan

4. **Check IDE supports rules:**
   - Cursor: ✅ Built-in support
   - Claude Desktop: ✅ Built-in support
   - VS Code: Depends on extension

</details>

<details>
<summary><b>Docker container not starting</b></summary>

1. **Check logs:**
   ```bash
   docker logs guardian-mcp
   ```

2. **Verify build succeeded:**
   ```bash
   docker build -t guardian-mcp:latest .
   ```

3. **Test manually:**
   ```bash
   docker run -it guardian-mcp:latest
   ```

4. **Check health:**
   ```bash
   docker ps --filter name=guardian-mcp
   # Status should be "healthy"
   ```

</details>

<details>
<summary><b>OSV.dev API errors</b></summary>

1. **Check internet connection**

2. **Verify API is accessible:**
   ```bash
   curl https://api.osv.dev/v1/query
   ```

3. **Rate limiting:** OSV.dev has rate limits
   - Wait a few minutes
   - Reduce scan frequency

4. **Firewall:** Ensure outbound HTTPS is allowed

</details>

## Development

### Local Development

```bash
git clone https://github.com/Kalvisan/guardian-mcp.git
cd guardian-mcp
npm install
npm run watch  # Auto-recompile on changes
```

### Testing Changes

```bash
npm run build
node dist/index.js  # Test locally
```

### Adding New Ecosystems

1. Create `checkXXXJson()` function in `src/index.ts`
2. Follow pattern of `checkPackageJson()` or `checkComposerJson()`
3. Update `file_type` enum and descriptions
4. Use appropriate OSV.dev ecosystem name

## Contributing

Contributions are welcome! Areas for improvement:

- 🌍 Additional ecosystem support (Python, Go, Rust, etc.)
- 🔧 Better version range parsing
- ⚡ Caching to reduce API calls
- 📱 IDE-specific optimizations
- 🧪 Test coverage
- 📚 Documentation improvements

## License

MIT - See [LICENSE](LICENSE) file

## Resources

- 🔗 [OSV.dev Database](https://osv.dev/)
- 📖 [OSV.dev API Docs](https://osv.dev/docs/)
- 🛠️ [Model Context Protocol](https://modelcontextprotocol.io/)
- 📦 [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- 📝 [Cursor Documentation](https://cursor.sh/docs)
- 💻 [VS Code MCP Guide](https://code.visualstudio.com/)

## Security Note

GuardianMCP helps identify known vulnerabilities but is **not a substitute for**:
- ✅ Comprehensive security audits
- ✅ Penetration testing
- ✅ Secure coding practices
- ✅ Regular dependency updates
- ✅ Security training

**Always review and test dependency updates before deploying to production.**

---

<p align="center">
Made with 🛡️ by the GuardianMCP team
</p>

<p align="center">
<a href="https://github.com/Kalvisan/guardian-mcp/issues">Report Bug</a> ·
<a href="https://github.com/Kalvisan/guardian-mcp/issues">Request Feature</a> ·
<a href="https://github.com/Kalvisan/guardian-mcp">Star on GitHub</a>
</p>
