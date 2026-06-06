---
name: git-diff-workflow
description: Executes the Git difference analysis workflow, automatically pulls the latest code, compares differences with the gracetech_master branch, extracts modified files in the fishmeet directory, creates a new branch and commits changes. Trigger this skill when the user mentions "diff workflow", "create diff branch", "compare fishmeet file differences" or "sync code and commit to a new branch".
---

# Git Diff Workflow Skill

Executes a complete code difference analysis and branch creation process, following the steps below:

## Step 1: Pull the latest remote code
Execute the command:
```bash
git fetch
```
Retrieve the latest branch information of the remote repository.

## Step 2: Analyze file differences
Execute the command:
```bash
git diff --name-only HEAD origin/gracetech_master
```
Compare file differences between the current branch and the origin/gracetech_master branch.
- Only filter and record file paths prefixed with `fishmeet/`
- If no eligible file paths are found, prompt the user immediately and terminate the entire workflow.

## Step 3: Prepare the development environment and locate files
1. Perform core file synchronization, skipping the interactive menu of dev.sh:
   ```bash
   cp fishmeet/css/_*.scss css/
   rsync -r fishmeet/react/ react/
   ```
   Synchronize CSS and React files in the fishmeet directory to the corresponding directories of the project.
2. Process the file paths obtained in Step 2: remove the `/fishmeet` prefix from the paths
3. Search for the corresponding files starting from the project root directory:
   - If the search fails (file does not exist), prompt the user immediately and terminate the entire workflow
   - Record all successfully located file paths

## Step 4: Create a branch and commit changes
1. Get the current branch name, and create a new branch with the suffix `_for-diff`:
   - If a branch with the same name already exists, append a sequential number to the suffix (e.g. `_for-diff-2`, `_for-diff-3`, etc.) to ensure the uniqueness of the branch name
2. Switch to the newly created branch
3. Add all successfully located modified files from Step 3 to the Git staging area
4. Execute the `git commit` command to commit changes, with the commit message format: `feat: sync fishmeet changes from [original branch name]`

## Notes
- All commands must be executed in the current working directory (the root directory of the Git repository)
- Terminate immediately upon any error and report detailed error information to the user
- Report the completion status to the user after executing all steps, including the new branch name and the list of committed files
