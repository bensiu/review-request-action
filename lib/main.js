const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');

const run = async () => {
  try {
    const
      repoToken = core.getInput('repo-token', { required: true }),
      issue = { owner, repo, number } = context.issue;

    if (context.payload.action !== 'opened') {
      console.log('No pull request was opened, skipping');
      return;
    }

    const client = new GitHub(repoToken);

    const reviewers = core.getInput('reviewers').split(',').map(a => a.trim());
    const teamReviewers = core.getInput('team-reviewers').split(',').map(a => a.trim());
    console.log('context : ', context);
    console.log('context.issue : ', context.issue);
    core.debug(JSON.stringify(context));
    core.debug(GitHub.actor);

    await client.pulls.createReviewRequest(
      {
        owner: issue.owner,
        repo: issue.repo,
        pull_number: issue.number,
        reviewers: reviewers,
        team_reviewers: teamReviewers
      }
    );

  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}

run();
