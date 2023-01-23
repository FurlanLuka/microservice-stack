const { execSync } = require('child_process');
const core = require('@actions/core');

function getAffectedProjects() {
  const base = core.getInput('base');
  const printAffectedCommand = `npx nx affected:apps ${
    base ? `--base=${base}` : ''
  } --plain`;
  const affectedOutput = execSync(printAffectedCommand).toString().trim();

  return affectedOutput ? affectedOutput.split(' ') : [];
}

const run = () => {
  const affectedProjects = getAffectedProjects();

  core.setOutput('affectedProjects', affectedProjects);
  core.notice(`affectedProjects: ${affectedProjects}`);

  core.setOutput('isAffected', affectedProjects.length > 0);
  core.notice(`isAffected: ${affectedProjects.length > 0}`);
};

run();
