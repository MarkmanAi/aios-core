'use strict';

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const {
  loadProjectStatus,
} = require('../../../.aios-core/infrastructure/scripts/project-status-loader');

const AGENT_NAMES = {
  '@dev': 'Dex',
  '@qa': 'Quinn',
  '@architect': 'Aria',
  '@devops': 'Gage',
  '@pm': 'Morgan',
  '@po': 'Pax',
  '@sm': 'River',
};

function timeAgo(isoTimestamp) {
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin === 1) return '1 minute ago';
  return `${diffMin} minutes ago`;
}

function readBobStatus() {
  const bobStatusPath = path.join(process.cwd(), '.aios', 'dashboard', 'bob-status.json');
  try {
    return JSON.parse(fs.readFileSync(bobStatusPath, 'utf8'));
  } catch {
    return null;
  }
}

function getAgentName(bobStatus) {
  if (!bobStatus || !bobStatus.current_agent || !bobStatus.current_agent.id) return null;
  return (
    bobStatus.current_agent.name ||
    AGENT_NAMES[bobStatus.current_agent.id] ||
    bobStatus.current_agent.id
  );
}

function formatConcise(projectStatus, bobStatus) {
  const currentStory =
    projectStatus.currentStory ||
    (bobStatus && bobStatus.orchestration && bobStatus.orchestration.current_story) ||
    null;
  const agentName = getAgentName(bobStatus);
  const agentTask = (bobStatus && bobStatus.current_agent && bobStatus.current_agent.task) || null;
  const lastActivity = bobStatus && bobStatus.timestamp ? timeAgo(bobStatus.timestamp) : null;

  const projectName = path.basename(process.cwd());
  const projectState = projectStatus.isGitRepo
    ? 'Existing project with docs'
    : 'Project not yet initialized';

  const lines = ["Bob here. Here's where we are:", ''];
  lines.push(`Project:  ${projectName} (${projectState})`);

  if (currentStory) {
    lines.push(`Story:    ${currentStory}`);
  } else {
    lines.push('Story:    No active story');
  }

  if (agentName && agentTask) {
    lines.push(`Agent:    ${agentName} is working on ${agentTask}`);
  } else if (agentName) {
    lines.push(`Agent:    ${agentName} is active`);
  } else {
    lines.push('Agent:    No agent active');
  }

  if (lastActivity) {
    lines.push(`Activity: ${lastActivity}`);
  }

  return lines.join('\n');
}

function formatEducational(projectStatus, bobStatus) {
  const currentStory =
    projectStatus.currentStory ||
    (bobStatus && bobStatus.orchestration && bobStatus.orchestration.current_story) ||
    null;
  const agentName = getAgentName(bobStatus);
  const agentId = (bobStatus && bobStatus.current_agent && bobStatus.current_agent.id) || null;
  const agentTask = (bobStatus && bobStatus.current_agent && bobStatus.current_agent.task) || null;
  const storyProgress =
    (bobStatus && bobStatus.pipeline && bobStatus.pipeline.story_progress) || null;
  const lastActivity = bobStatus && bobStatus.timestamp ? timeAgo(bobStatus.timestamp) : null;

  const projectName = path.basename(process.cwd());
  const projectState = projectStatus.isGitRepo
    ? 'Existing project with docs'
    : 'Project not yet initialized';

  const lines = ["Bob here. Here's where we are:", ''];
  lines.push(`Project:  ${projectName}`);
  lines.push(`State:    ${projectState}`);
  if (projectStatus.isGitRepo) {
    lines.push('          (Your project has AIOS configured and docs are ready for development)');
  }
  lines.push('');

  if (currentStory) {
    lines.push(`Story:    ${currentStory} (In Progress)`);
    if (storyProgress) {
      lines.push(`          Tasks completed: ${storyProgress}`);
    }
  } else {
    lines.push('Story:    No active story');
  }
  lines.push('');

  if (agentName && agentTask) {
    const agentLabel = agentId ? `${agentName} (${agentId})` : agentName;
    lines.push(`Agent:    ${agentLabel} is working on ${agentTask}`);
    lines.push(
      `          ${agentName} is the implementation agent — writes code, runs tests, marks tasks done`,
    );
  } else if (agentName) {
    lines.push(`Agent:    ${agentName} is active`);
  } else {
    lines.push('Agent:    No agent active');
  }
  lines.push('');

  if (lastActivity) {
    lines.push(`Activity: ${lastActivity}`);
  }
  if (currentStory && agentTask && agentName) {
    lines.push(`Next:     ${agentName} will complete current task and continue`);
  }

  return lines.join('\n');
}

function formatOutput(projectStatus, bobStatus) {
  const educationalMode =
    bobStatus && bobStatus.educational && bobStatus.educational.enabled;
  const currentStory =
    projectStatus.currentStory ||
    (bobStatus && bobStatus.orchestration && bobStatus.orchestration.current_story) ||
    null;
  const agentName = getAgentName(bobStatus);

  if (!currentStory && !agentName) {
    return "Bob here. Nothing's running right now.\n\nReady when you are. Run: aios bob do \"<your request>\"";
  }

  if (educationalMode) {
    return formatEducational(projectStatus, bobStatus);
  }

  return formatConcise(projectStatus, bobStatus);
}

const statusCommand = new Command('status').description(
  "Show current project status in Bob's voice",
);

statusCommand.action(async () => {
  try {
    const projectStatus = await loadProjectStatus();
    const bobStatus = readBobStatus();
    console.log(formatOutput(projectStatus, bobStatus));
  } catch (error) {
    console.error(`Bob encountered an error: ${error.message}`);
    process.exit(1);
  }
});

module.exports = statusCommand;
module.exports.timeAgo = timeAgo;
module.exports.readBobStatus = readBobStatus;
module.exports.formatOutput = formatOutput;
