#!/usr/bin/env node

/**
 * analyze-dependencies.js
 *
 * Analyzes an asset file from a source repository and maps all its dependencies.
 * Used by the /import-asset skill to build the dependency tree.
 *
 * Usage:
 *   node analyze-dependencies.js <source-repo-path> <asset-path> [target-repo-path]
 *
 * Output: JSON report with dependency tree, file statuses, and risk assessment.
 */

const fs = require('fs');
const path = require('path');

// --- Helpers ---

function findCoreDir(repoPath) {
  const candidates = ['.aios-core', '.aiox-core'];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(repoPath, dir))) return dir;
  }
  return null;
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function extractYamlBlock(content) {
  const yamlMatch = content.match(/```yaml\n([\s\S]*?)```/);
  return yamlMatch ? yamlMatch[1] : null;
}

function parseDependenciesFromYaml(yamlContent) {
  const deps = {
    tasks: [],
    templates: [],
    checklists: [],
    scripts: [],
    utils: [],
    workflows: [],
    tools: [],
    data: [],
  };

  let inDependencies = false;
  let depsIndent = -1;
  let currentSection = null;

  for (const line of yamlContent.split('\n')) {
    const trimmed = line.trim();
    const indent = line.search(/\S/);

    // Detect dependencies: block entry
    if (trimmed === 'dependencies:') {
      inDependencies = true;
      depsIndent = indent;
      currentSection = null;
      continue;
    }

    // Detect exit from dependencies block (same or lower indent, non-empty)
    if (inDependencies && indent !== -1 && indent <= depsIndent && trimmed && !trimmed.startsWith('#')) {
      inDependencies = false;
      currentSection = null;
      continue;
    }

    if (!inDependencies) continue;

    // Detect section headers under dependencies:
    const sectionMatch = trimmed.match(/^(tasks|templates|checklists|scripts|utils|workflows|tools|data):$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }

    // Detect list items
    if (currentSection && trimmed.startsWith('- ')) {
      let value = trimmed.slice(2).trim();
      // Remove comments
      value = value.split('#')[0].trim();
      // Remove quotes
      value = value.replace(/^['"]|['"]$/g, '');
      if (value) {
        deps[currentSection].push(value);
      }
      continue;
    }

    // If we hit a non-list, non-empty line that's not a comment, check if it's a new key
    if (currentSection && trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('#')) {
      // A new key at the same indent as dependency sections resets the section
      if (trimmed.endsWith(':') && !sectionMatch) {
        currentSection = null;
      }
    }
  }

  return deps;
}

function resolveDepPath(coreDir, type, name) {
  const typeMap = {
    tasks: 'development/tasks',
    templates: 'development/templates',
    checklists: 'development/checklists',
    scripts: 'development/scripts',
    utils: 'development/utils',
    workflows: 'development/workflows',
    data: 'development/data',
  };
  const subdir = typeMap[type];
  if (!subdir) return null;
  return path.join(coreDir, subdir, name);
}

function checkFileStatus(sourcePath, targetPath) {
  const sourceExists = fs.existsSync(sourcePath);
  const targetExists = targetPath ? fs.existsSync(targetPath) : false;

  if (!sourceExists) return 'SOURCE_MISSING';
  if (!targetExists) return 'NEW';

  // Compare content
  const sourceContent = readFileContent(sourcePath);
  const targetContent = readFileContent(targetPath);
  if (sourceContent === targetContent) return 'IDENTICAL';
  return 'DIFFERENT';
}

function parseImportsFromJS(content) {
  const imports = [];
  const patterns = [
    /require\(['"]([^'"]+)['"]\)/g,
    /from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      imports.push(match[1]);
    }
  }

  return imports;
}

function parseSkillResources(skillDir) {
  const resources = [];
  const subdirs = ['scripts', 'references', 'assets'];

  for (const sub of subdirs) {
    const dir = path.join(skillDir, sub);
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      const files = fs.readdirSync(dir, { recursive: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.toString());
        if (fs.statSync(fullPath).isFile()) {
          resources.push({ type: sub, relativePath: path.join(sub, file.toString()), fullPath });
        }
      }
    }
  }

  return resources;
}

function detectAssetType(assetPath) {
  const basename = path.basename(assetPath);

  if (basename === 'SKILL.md') return 'skill';

  const content = readFileContent(assetPath);
  if (!content) return 'unknown';

  if (content.includes('```yaml') && content.includes('dependencies:')) {
    if (content.includes('persona:') || content.includes('agent:')) return 'agent';
    return 'config';
  }

  if (assetPath.endsWith('.js') || assetPath.endsWith('.ts')) return 'code';
  if (assetPath.endsWith('.md')) return 'document';
  if (assetPath.endsWith('.yaml') || assetPath.endsWith('.yml')) return 'config';

  return 'unknown';
}

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function addFileToTransfer(report, entry) {
  entry.source = normalizePath(entry.source);
  entry.target = normalizePath(entry.target);
  const exists = report.filesToTransfer.some(f => f.source === entry.source);
  if (!exists) {
    report.filesToTransfer.push(entry);
  }
}

// --- Main Analysis ---

function analyzeAsset(sourceRepoPath, assetRelPath, targetRepoPath) {
  const sourceCoreDir = findCoreDir(sourceRepoPath);
  const targetCoreDir = targetRepoPath ? findCoreDir(targetRepoPath) : null;

  const fullAssetPath = path.join(sourceRepoPath, assetRelPath);
  const assetType = detectAssetType(fullAssetPath);

  const report = {
    asset: {
      name: path.basename(assetRelPath, path.extname(assetRelPath)),
      type: assetType,
      sourcePath: assetRelPath,
      fullSourcePath: fullAssetPath,
    },
    source: {
      repoPath: sourceRepoPath,
      coreDir: sourceCoreDir,
    },
    target: {
      repoPath: targetRepoPath || '(current directory)',
      coreDir: targetCoreDir,
    },
    pathRewriting: sourceCoreDir !== targetCoreDir && sourceCoreDir && targetCoreDir
      ? { from: sourceCoreDir, to: targetCoreDir }
      : null,
    dependencies: {},
    filesToTransfer: [],
    npmPackages: [],
    externalTools: [],
    risks: { critical: [], warning: [], info: [] },
  };

  // Add primary file
  const targetAssetPath = targetRepoPath
    ? path.join(targetRepoPath, report.pathRewriting
      ? assetRelPath.replace(sourceCoreDir, targetCoreDir)
      : assetRelPath)
    : null;

  addFileToTransfer(report, {
    source: assetRelPath,
    target: targetAssetPath ? path.relative(targetRepoPath, targetAssetPath) : assetRelPath,
    status: checkFileStatus(fullAssetPath, targetAssetPath),
  });

  const content = readFileContent(fullAssetPath);
  if (!content) {
    report.risks.critical.push(`Primary file not found: ${fullAssetPath}`);
    return report;
  }

  // --- Type-specific analysis ---

  if (assetType === 'agent') {
    const yaml = extractYamlBlock(content);
    if (yaml) {
      const deps = parseDependenciesFromYaml(yaml);
      report.dependencies = deps;

      for (const [type, items] of Object.entries(deps)) {
        if (type === 'tools') {
          for (const tool of items) {
            report.externalTools.push({ name: tool, requiredBy: report.asset.name });
          }
          continue;
        }

        for (const item of items) {
          if (!sourceCoreDir) continue;
          const sourceDep = resolveDepPath(path.join(sourceRepoPath, sourceCoreDir), type, item);
          const targetDep = targetRepoPath && targetCoreDir
            ? resolveDepPath(path.join(targetRepoPath, targetCoreDir), type, item)
            : null;

          const status = checkFileStatus(sourceDep, targetDep);

          addFileToTransfer(report, {
            source: sourceDep ? path.relative(sourceRepoPath, sourceDep) : `${sourceCoreDir}/development/${type}/${item}`,
            target: targetDep ? path.relative(targetRepoPath, targetDep) : `${targetCoreDir || '.aios-core'}/development/${type}/${item}`,
            status,
            depType: type,
          });

          if (status === 'SOURCE_MISSING') {
            report.risks.warning.push(`Dependency listed but not found in source: ${type}/${item}`);
          }
        }
      }
    }
  }

  if (assetType === 'skill') {
    const skillDir = path.dirname(fullAssetPath);
    const resources = parseSkillResources(skillDir);

    const skillRelDir = path.relative(sourceRepoPath, skillDir);
    for (const res of resources) {
      const sourceRel = path.relative(sourceRepoPath, res.fullPath);
      const targetRel = path.join(skillRelDir, res.relativePath);
      const targetFullPath = targetRepoPath ? path.join(targetRepoPath, targetRel) : null;

      addFileToTransfer(report, {
        source: sourceRel,
        target: targetRel,
        status: checkFileStatus(res.fullPath, targetFullPath),
        depType: res.type,
      });
    }
  }

  if (assetType === 'code') {
    const imports = parseImportsFromJS(content);
    for (const imp of imports) {
      if (imp.startsWith('.') || imp.startsWith('/')) {
        // Local import
        const resolved = path.resolve(path.dirname(fullAssetPath), imp);
        const extensions = ['', '.js', '.ts', '.jsx', '.tsx', '/index.js', '/index.ts'];
        let found = false;
        for (const ext of extensions) {
          if (fs.existsSync(resolved + ext)) {
            const sourceRelPath = path.relative(sourceRepoPath, resolved + ext);
            const targetFullPath = targetRepoPath ? path.join(targetRepoPath, sourceRelPath) : null;

            addFileToTransfer(report, {
              source: sourceRelPath,
              target: sourceRelPath,
              status: checkFileStatus(resolved + ext, targetFullPath),
              depType: 'local-import',
            });
            found = true;
            break;
          }
        }
        if (!found) {
          report.risks.warning.push(`Local import not resolved: ${imp}`);
        }
      } else if (!imp.startsWith('node:') && !['fs', 'path', 'os', 'util', 'child_process', 'crypto', 'http', 'https', 'url', 'stream', 'events', 'buffer', 'querystring', 'readline', 'assert'].includes(imp.split('/')[0])) {
        // npm package
        report.npmPackages.push({ name: imp.split('/')[0], requiredBy: report.asset.name });
      }
    }
  }

  // --- Risk assessment ---

  if (report.pathRewriting) {
    report.risks.warning.push(
      `Path rewriting needed: ${report.pathRewriting.from} → ${report.pathRewriting.to}`,
    );
  }

  const newFiles = report.filesToTransfer.filter(f => f.status === 'NEW').length;
  const differentFiles = report.filesToTransfer.filter(f => f.status === 'DIFFERENT').length;
  const missingFiles = report.filesToTransfer.filter(f => f.status === 'SOURCE_MISSING').length;

  if (missingFiles > 0) {
    report.risks.critical.push(`${missingFiles} dependency file(s) missing in source`);
  }
  if (differentFiles > 0) {
    report.risks.warning.push(`${differentFiles} file(s) already exist in target with different content`);
  }
  report.risks.info.push(`${newFiles} new file(s) to transfer`);

  // Verdict
  if (report.risks.critical.length > 0) {
    report.verdict = 'BLOCKED';
  } else if (report.risks.warning.length > 0) {
    report.verdict = 'NEEDS_REVIEW';
  } else {
    report.verdict = 'READY_TO_IMPORT';
  }

  return report;
}

// --- CLI Entry Point ---

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node analyze-dependencies.js <source-repo-path> <asset-relative-path> [target-repo-path]');
  process.exit(1);
}

const [sourceRepo, assetPath, targetRepo] = args;
const report = analyzeAsset(sourceRepo, assetPath, targetRepo || process.cwd());

console.log(JSON.stringify(report, null, 2));
