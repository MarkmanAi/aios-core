'use strict';

const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', '.aios-core', 'core', 'orchestration');

const fileReplacements = {
  'data-lifecycle-manager.js': [
    ['Story 12.5: Session State Integration with Bob (AC8-11)', 'Story 13.2: Data Lifecycle Manager'],
  ],
  'bob-status-writer.js': [
    ['Story 12.6: Observability Panel Integration + Dashboard Bridge', 'Story 13.3: BobStatusWriter — Dashboard Bridge'],
    ['Story 12.6 - AC9: Single source of truth', 'Story 13.3 - AC2: Schema Validation'],
  ],
  'message-formatter.js': [
    ['Story 12.7: Modo Educativo (Opt-in)', 'Story 13.4: Educational Mode'],
  ],
  'brownfield-handler.js': [
    ['Brownfield Handler - Story 12.8', 'Brownfield Handler - Story 13.5'],
    ['Epic 12: Bob Full Integration', 'Epic 13: Bob Full Integration'],
  ],
  'greenfield-handler.js': [
    ['Greenfield Handler - Story 12.13', 'Greenfield Handler - Story 13.6'],
    ['Epic 12: Bob Full Integration', 'Epic 13: Bob Full Integration'],
  ],
  'bob-orchestrator.js': [
    ['Story 12.3: Bob Orchestration Logic (Decision Tree)', 'Story 13.1: Bob Orchestrator — Decision Tree Entry Point'],
    ['Story 12.8: Brownfield Handler', 'Story 13.5: Brownfield Handler'],
    ['Story 12.13: Greenfield Handler', 'Story 13.6: Greenfield Handler'],
    ['Story 12.6: Observability Panel Integration + Dashboard Bridge', 'Story 13.3: Dashboard Bridge'],
    ['Story 12.7: Educational Mode', 'Story 13.4: Educational Mode'],
    ['Story 12.5: Data Lifecycle Manager', 'Story 13.2: Data Lifecycle Manager'],
    ['Story 12.7: Panel mode based on educational mode (AC2, AC7)', 'Story 13.4: Panel mode based on educational mode'],
    ['Story 12.6: Dashboard Bridge (AC6-11)', 'Story 13.3: Dashboard Bridge'],
    ['Story 12.6: Wire up callbacks (AC1, AC2)', 'Story 13.3: Wire up callbacks'],
    ['Story 12.6 - AC1, AC2, AC6-11', 'Story 13.3'],
    ['Story 12.13: Greenfield handler observability callbacks (AC10)', 'Story 13.6: Greenfield handler observability callbacks'],
    ['Story 12.7 - AC1, AC2', 'Story 13.4'],
    ['Story 12.7 - AC5)', 'Story 13.4 - AC5)'],
    ['Story 12.7 - AC5, AC6)', 'Story 13.4 - AC5, AC6)'],
    ['Story 12.7 - AC6)', 'Story 13.4 - AC6)'],
    ['Story 12.7: Detect', 'Story 13.4: Detect'],
    ['Story 12.7: Refresh', 'Story 13.4: Refresh'],
    ['Story 12.6: Start', 'Story 13.3: Start'],
    ['Story 12.6: Initialize', 'Story 13.3: Initialize'],
    ['Story 12.5: Run data lifecycle', 'Story 13.2: Run data lifecycle'],
    ['Story 12.5: Check for existing', 'Story 13.2: Check for existing'],
    ['Story 12.6: Stop panel', 'Story 13.3: Stop panel'],
    ['Story 12.6: Stop observability', 'Story 13.3: Stop observability'],
    ['Story 12.5 - AC1, AC2, AC4)', 'Story 13.2)'],
    ['Story 12.5 - AC3, AC7)', 'Story 13.2)'],
    ['Story 12.8: Delegates', 'Story 13.5: Delegates'],
    ['Story 12.8 - Task 3.6)', 'Story 13.5)'],
    ['Story 12.8 - AC2:', 'Story 13.5 - AC2:'],
    ['Story 12.8 - AC3 Task 3.5:', 'Story 13.5 - AC3:'],
    ['Story 12.8 - AC5:', 'Story 13.5 - AC5:'],
    ['Story 12.13: Greenfield Workflow', 'Story 13.6: Greenfield Workflow'],
    ['Story 12.13)', 'Story 13.6)'],
    ['Story 12.13 - AC11-14:', 'Story 13.6 - AC2-5:'],
    ['Story 12.13 - AC15:', 'Story 13.6 - AC6:'],
    ['Story 12.5 AC5: Updates session state at each phase transition.', 'Story 13.2: Updates session state at each phase transition.'],
    ['Story 12.5 AC5: Track', 'Story 13.2: Track'],
    ['Story 12.5 - AC5)', 'Story 13.2)'],
    ['Story 12.6: Observability Panel Integration (AC1-5)', 'Story 13.3: Dashboard Bridge'],
    ['Story 12.5:', 'Story 13.2:'],
    ['Story 12.6:', 'Story 13.3:'],
    ['Story 12.7:', 'Story 13.4:'],
    ['Story 12.8:', 'Story 13.5:'],
    ['Story 12.13:', 'Story 13.6:'],
  ],
};

let totalUpdates = 0;
for (const [file, reps] of Object.entries(fileReplacements)) {
  const filePath = path.join(base, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileUpdates = 0;
  for (const [from, to] of reps) {
    const before = content;
    content = content.split(from).join(to);
    if (content !== before) fileUpdates++;
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}: ${fileUpdates} replacements`);
  totalUpdates += fileUpdates;
}
console.log(`\nTotal: ${totalUpdates} replacements across ${Object.keys(fileReplacements).length} files`);
