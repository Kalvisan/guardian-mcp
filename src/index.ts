#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";
import fetch from "node-fetch";

interface Vulnerability {
  id: string;
  summary: string;
  severity: string;
  references: { url: string }[];
  package_name: string;
  affected_versions: string[];
}

interface OSVResponse {
  vulns?: Array<{
    id: string;
    summary: string;
    database_specific?: {
      severity?: string;
    };
    severity?: Array<{
      type: string;
      score: string;
    }>;
    references?: Array<{
      url: string;
    }>;
  }>;
}

type ScanMode = "full" | "summary" | "critical-high-only";

// Create MCP server
const server = new Server(
  {
    name: "guardian-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Function to fetch security vulnerabilities from OSV.dev API
async function checkVulnerability(
  packageName: string,
  version: string,
  ecosystem: string
): Promise<Vulnerability[]> {
  try {
    const response = await fetch("https://api.osv.dev/v1/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        package: {
          name: packageName,
          ecosystem: ecosystem,
        },
        version: version,
      }),
    });

    if (!response.ok) {
      throw new Error(`OSV API error: ${response.statusText}`);
    }

    const data = (await response.json()) as OSVResponse;

    if (!data.vulns || data.vulns.length === 0) {
      return [];
    }

    return data.vulns.map((vuln) => {
      let severity = "UNKNOWN";

      // Try to get severity from different sources
      if (vuln.database_specific?.severity) {
        severity = vuln.database_specific.severity;
      } else if (vuln.severity && vuln.severity.length > 0) {
        // CVSS score parsing
        const cvss = vuln.severity.find((s) => s.type === "CVSS_V3");
        if (cvss) {
          const score = parseFloat(cvss.score.split("/")[0] || "0");
          if (score >= 9.0) severity = "CRITICAL";
          else if (score >= 7.0) severity = "HIGH";
          else if (score >= 4.0) severity = "MODERATE";
          else severity = "LOW";
        }
      }

      return {
        id: vuln.id,
        summary: vuln.summary || "No description available",
        severity: severity,
        references: vuln.references || [],
        package_name: packageName,
        affected_versions: [version],
      };
    });
  } catch (error) {
    console.error(`Error checking ${packageName}:`, error);
    return [];
  }
}

// Function to format vulnerabilities based on scan mode
function formatVulnerabilities(
  vulnerabilities: Vulnerability[],
  packageName: string,
  version: string,
  mode: ScanMode
): string {
  if (vulnerabilities.length === 0) {
    return "";
  }

  let result = "";

  for (const vuln of vulnerabilities) {
    const severity = vuln.severity.toUpperCase();
    const isCriticalOrHigh =
      severity.includes("CRITICAL") || severity.includes("HIGH");

    // In critical-high-only mode, skip moderate and low
    if (mode === "critical-high-only" && !isCriticalOrHigh) {
      continue;
    }

    result += `\n## 🔴 ${packageName}@${version}\n`;
    result += `**Vulnerability ID:** ${vuln.id}\n`;
    result += `**Severity:** ${vuln.severity}\n\n`;

    if (severity.includes("CRITICAL")) {
      result += `### ⚠️ CRITICAL RISK!\n\n`;
      result += `**Description:**\n${vuln.summary}\n\n`;
      result += `**IMMEDIATE ACTION REQUIRED:**\n`;
      result += `1. Update the package to a safe version:\n`;
      result += `   \`\`\`bash\n   npm update ${packageName}\n   \`\`\`\n`;
      result += `2. If update doesn't help, find alternatives or pin version manually\n`;
      result += `3. Check if your code uses the vulnerable functionality\n\n`;
    } else if (severity.includes("HIGH")) {
      result += `**Issue:** ${vuln.summary}\n\n`;
      result += `**Recommendation:** Update package as soon as possible:\n`;
      result += `\`\`\`bash\nnpm update ${packageName}\n\`\`\`\n\n`;
    } else if (mode === "full") {
      // Only show moderate/low details in full mode
      result += `**Issue:** ${vuln.summary}\n\n`;
      result += `**Recommendation:** Consider updating when possible.\n\n`;
    }

    if (vuln.references.length > 0) {
      result += `**More information:**\n`;
      vuln.references.slice(0, 3).forEach((ref) => {
        result += `- ${ref.url}\n`;
      });
      result += "\n";
    }

    result += "---\n";
  }

  return result;
}

// Function to read and parse package.json
async function checkPackageJson(
  projectPath: string,
  mode: ScanMode
): Promise<string> {
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    const content = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(content);

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    let results = "# Security Scan Results (package.json)\n\n";
    let criticalCount = 0;
    let highCount = 0;
    let moderateCount = 0;
    let lowCount = 0;

    const allVulnerabilities: Array<{
      packageName: string;
      version: string;
      vulnerabilities: Vulnerability[];
    }> = [];

    for (const [packageName, versionRange] of Object.entries(allDeps)) {
      // Extract version from range (simplified - remove ^~>=< symbols)
      const version = (versionRange as string).replace(/[\^~>=<]/g, "");

      const vulnerabilities = await checkVulnerability(
        packageName,
        version,
        "npm"
      );

      if (vulnerabilities.length > 0) {
        allVulnerabilities.push({ packageName, version, vulnerabilities });

        for (const vuln of vulnerabilities) {
          const severity = vuln.severity.toUpperCase();
          if (severity.includes("CRITICAL")) criticalCount++;
          else if (severity.includes("HIGH")) highCount++;
          else if (severity.includes("MODERATE")) moderateCount++;
          else lowCount++;
        }
      }
    }

    // Summary mode: just show counts
    if (mode === "summary") {
      const total = criticalCount + highCount + moderateCount + lowCount;
      if (total === 0) {
        results += "\n✅ **No known security vulnerabilities found!**\n";
      } else {
        results += `## 📊 Summary\n`;
        results += `- 🔴 Critical: ${criticalCount}\n`;
        results += `- 🟠 High: ${highCount}\n`;
        results += `- 🟡 Moderate: ${moderateCount}\n`;
        results += `- 🟢 Low: ${lowCount}\n`;
        results += `\n**Total vulnerabilities found: ${total}**\n\n`;
        results += `Run with scan_mode="full" for detailed information.\n`;
      }
      return results;
    }

    // Full or critical-high-only mode: show details
    for (const { packageName, version, vulnerabilities } of allVulnerabilities) {
      results += formatVulnerabilities(
        vulnerabilities,
        packageName,
        version,
        mode
      );
    }

    // Summary section
    const total = criticalCount + highCount + moderateCount + lowCount;
    if (total === 0) {
      results += "\n✅ **No known security vulnerabilities found!**\n";
    } else {
      results += `\n## 📊 Summary\n`;
      if (mode === "critical-high-only") {
        results += `- 🔴 Critical: ${criticalCount}\n`;
        results += `- 🟠 High: ${highCount}\n`;
        if (moderateCount + lowCount > 0) {
          results += `\n_Also found ${moderateCount + lowCount} moderate/low severity issues (hidden in this mode)._\n`;
          results += `_Run with scan_mode="full" to see all vulnerabilities._\n`;
        }
      } else {
        results += `- 🔴 Critical: ${criticalCount}\n`;
        results += `- 🟠 High: ${highCount}\n`;
        results += `- 🟡 Moderate: ${moderateCount}\n`;
        results += `- 🟢 Low: ${lowCount}\n`;
        results += `\n**Total vulnerabilities found: ${total}**\n`;
      }
    }

    return results;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return "❌ package.json file not found in this directory.";
    }
    throw error;
  }
}

// Function to read and parse composer.json
async function checkComposerJson(
  projectPath: string,
  mode: ScanMode
): Promise<string> {
  try {
    const composerJsonPath = path.join(projectPath, "composer.json");
    const content = await fs.readFile(composerJsonPath, "utf-8");
    const composerJson = JSON.parse(content);

    const allDeps = {
      ...composerJson.require,
      ...composerJson["require-dev"],
    };

    let results = "# Security Scan Results (composer.json)\n\n";
    let criticalCount = 0;
    let highCount = 0;
    let moderateCount = 0;
    let lowCount = 0;

    const allVulnerabilities: Array<{
      packageName: string;
      version: string;
      vulnerabilities: Vulnerability[];
    }> = [];

    for (const [packageName, versionRange] of Object.entries(allDeps)) {
      // Skip php version and extensions
      if (packageName.startsWith("php") || packageName.startsWith("ext-")) {
        continue;
      }

      const version = (versionRange as string).replace(/[\^~>=<]/g, "");

      const vulnerabilities = await checkVulnerability(
        packageName,
        version,
        "Packagist"
      );

      if (vulnerabilities.length > 0) {
        allVulnerabilities.push({ packageName, version, vulnerabilities });

        for (const vuln of vulnerabilities) {
          const severity = vuln.severity.toUpperCase();
          if (severity.includes("CRITICAL")) criticalCount++;
          else if (severity.includes("HIGH")) highCount++;
          else if (severity.includes("MODERATE")) moderateCount++;
          else lowCount++;
        }
      }
    }

    // Summary mode: just show counts
    if (mode === "summary") {
      const total = criticalCount + highCount + moderateCount + lowCount;
      if (total === 0) {
        results += "\n✅ **No known security vulnerabilities found!**\n";
      } else {
        results += `## 📊 Summary\n`;
        results += `- 🔴 Critical: ${criticalCount}\n`;
        results += `- 🟠 High: ${highCount}\n`;
        results += `- 🟡 Moderate: ${moderateCount}\n`;
        results += `- 🟢 Low: ${lowCount}\n`;
        results += `\n**Total vulnerabilities found: ${total}**\n\n`;
        results += `Run with scan_mode="full" for detailed information.\n`;
      }
      return results;
    }

    // Full or critical-high-only mode: show details
    for (const { packageName, version, vulnerabilities } of allVulnerabilities) {
      const formattedResult = formatVulnerabilities(
        vulnerabilities,
        packageName,
        version,
        mode
      );

      // For composer, update npm commands to composer commands
      const composerResult = formattedResult
        .replace(/npm update/g, "composer update")
        .replace(/npm install/g, "composer install");

      results += composerResult;
    }

    const total = criticalCount + highCount + moderateCount + lowCount;
    if (total === 0) {
      results += "\n✅ **No known security vulnerabilities found!**\n";
    } else {
      results += `\n## 📊 Summary\n`;
      if (mode === "critical-high-only") {
        results += `- 🔴 Critical: ${criticalCount}\n`;
        results += `- 🟠 High: ${highCount}\n`;
        if (moderateCount + lowCount > 0) {
          results += `\n_Also found ${moderateCount + lowCount} moderate/low severity issues (hidden in this mode)._\n`;
          results += `_Run with scan_mode="full" to see all vulnerabilities._\n`;
        }
      } else {
        results += `- 🔴 Critical: ${criticalCount}\n`;
        results += `- 🟠 High: ${highCount}\n`;
        results += `- 🟡 Moderate: ${moderateCount}\n`;
        results += `- 🟢 Low: ${lowCount}\n`;
        results += `\n**Total vulnerabilities found: ${total}**\n`;
      }
    }

    return results;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return "❌ composer.json file not found in this directory.";
    }
    throw error;
  }
}

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_vulnerabilities",
        description:
          "Scans project dependencies (package.json, composer.json) for known security vulnerabilities using the OSV.dev database. " +
          "Supports multiple scan modes: 'full' for detailed reports, 'summary' for quick overview, 'critical-high-only' for auto-scans showing only actionable issues. " +
          "Use this tool when: user asks about security/vulnerabilities, after package installations (npm install, composer update), " +
          "before commits/builds, or when starting work in a new project with dependency files.",
        inputSchema: {
          type: "object",
          properties: {
            project_path: {
              type: "string",
              description:
                "Path to project directory (default: current directory)",
            },
            file_type: {
              type: "string",
              enum: ["package.json", "composer.json", "both"],
              description: "Which file(s) to check (default: both)",
            },
            scan_mode: {
              type: "string",
              enum: ["full", "summary", "critical-high-only"],
              description:
                "Output detail level: 'full' shows all vulnerabilities with details, " +
                "'summary' shows only counts, 'critical-high-only' shows detailed info for CRITICAL/HIGH only (default: full)",
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "check_vulnerabilities") {
    const projectPath =
      (request.params.arguments?.project_path as string) || process.cwd();
    const fileType =
      (request.params.arguments?.file_type as string) || "both";
    const scanMode =
      (request.params.arguments?.scan_mode as ScanMode) || "full";

    let result = "";

    if (fileType === "package.json" || fileType === "both") {
      result += await checkPackageJson(projectPath, scanMode);
      result += "\n\n";
    }

    if (fileType === "composer.json" || fileType === "both") {
      result += await checkComposerJson(projectPath, scanMode);
    }

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GuardianMCP server is running!");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
