'use strict';

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

const { BobOrchestrator } = require('../../../.aios-core/core/orchestration/bob-orchestrator');

/**
 * Prints completion summary in Bob's voice.
 * @param {import('../../../.aios-core/core/orchestration/bob-orchestrator').OrchestrationResult} result
 */
function printCompletionSummary(result) {
  if (!result.success) {
    console.error(chalk.red(`Bob: ${result.error || 'Something went wrong'}`));
    return;
  }
  console.log(chalk.green('\nBob here. Done.'));
  console.log(`What happened: ${result.action}`);
  console.log('Next: Run \'aios bob status\' to see where things stand');
}

/**
 * Shows delegation message after routing (AC-3).
 * @param {import('../../../.aios-core/core/orchestration/bob-orchestrator').OrchestrationResult} result
 */
function showDelegationMessage(result) {
  if (result.data && result.data.agentName && result.data.agentId) {
    console.log(
      chalk.blue(
        `Bob delegated to ${result.data.agentName} (${result.data.agentId}) — implementing your request`,
      ),
    );
  }
}

/**
 * Core execution logic — separated for testability.
 * @param {string} userInput
 * @param {Object} options
 * @param {boolean} options.dryRun
 */
async function runBobDo(userInput, options) {
  const spinner = ora('Bob is thinking...').start();

  // AC-6: Dry-run — use detectProjectState, never call orchestrate()
  if (options.dryRun) {
    const orchestrator = new BobOrchestrator(process.cwd());
    const state = orchestrator.detectProjectState();
    const actionMap = {
      NO_CONFIG: 'run aios onboarding',
      EXISTING_NO_DOCS: 'run brownfield discovery (4-8h)',
      EXISTING_WITH_DOCS: 'ask for your objective (feature/bug/refactor/debt)',
      GREENFIELD: 'bootstrap new project (4 phases)',
    };
    spinner.stop();
    console.log(`[DRY-RUN] Bob would handle: ${state} — next: ${actionMap[state] || state}`);
    return;
  }

  try {
    const orchestrator = new BobOrchestrator(process.cwd());
    const result = await orchestrator.orchestrate({ userGoal: userInput });
    spinner.stop();

    showDelegationMessage(result);

    switch (result.action) {
      case 'lock_failed':
        console.error(chalk.red('Bob is already running. Check .aios/locks/ or wait.'));
        process.exit(1);
        break;

      case 'onboarding':
        console.log('Bob requires AIOS setup. Run: npx @synkra/aios-install');
        break;

      case 'educational_mode_toggle': {
        const { enable } = result.data;
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'persistence',
            message: result.data.persistencePrompt,
            choices: ['session', 'permanent'],
          },
        ]);
        await orchestrator.handleEducationalModeToggle(enable, answer.persistence);
        console.log(chalk.green(`Educational mode ${enable ? 'ON' : 'OFF'} (${answer.persistence})`));
        break;
      }

      case 'resume_prompt': {
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'option',
            message: result.data.formattedMessage,
            choices: ['continue', 'review', 'restart', 'discard'],
          },
        ]);
        const resumeResult = await orchestrator.handleSessionResume(answer.option);
        printCompletionSummary(resumeResult);
        break;
      }

      case 'ask_objective': {
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'objective',
            message: 'What do you want to do?',
            choices: result.data.options || ['feature', 'bug', 'refactor', 'debt'],
          },
        ]);
        console.log(chalk.blue(`Bob will handle: ${answer.objective}`));
        break;
      }

      case 'story_executed':
        printCompletionSummary(result);
        break;

      default:
        if (!result.success) {
          console.error(chalk.red(`Bob: ${result.error || 'Unknown error'}`));
          process.exit(1);
        }
        printCompletionSummary(result);
    }
  } catch (err) {
    spinner.fail(`Bob encountered an error: ${err.message}`);
    process.exit(1);
  }
}

const doCommand = new Command('do')
  .description('Delegate a natural language task to Bob')
  .argument('[request]', 'What you want Bob to do')
  .option('--request <text>', 'Alternative: pass request as flag')
  .option('--dry-run', 'Preview routing without executing');

doCommand.action(async (request, options) => {
  const userInput = request || options.request;

  // AC-1: Missing request → usage error
  if (!userInput) {
    console.error('Usage: aios bob do "<your request>"');
    process.exit(1);
  }

  await runBobDo(userInput, { dryRun: !!options.dryRun });
});

module.exports = doCommand;
module.exports.runBobDo = runBobDo;
module.exports.printCompletionSummary = printCompletionSummary;
module.exports.showDelegationMessage = showDelegationMessage;
