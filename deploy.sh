#!/bin/bash
# Deploy dist/ to gh-pages from an ISOLATED worktree.
#
# GUARD FIRST. This folder is not yet its own git repo. Every per-build deploy.sh works
# through `git -C "$REPO"`, and if $REPO is not a repository root git walks UP and
# resolves to ~/Documents/Website redesign mockups, whose origin is the PRIVATE
# sndr-workspace-docs. A force-push of gh-pages onto that repo is not recoverable by
# re-running anything. The workspace .gitignore hides new build folders from git status,
# so nothing else warns you. See memory: deploy-base-url-two-hosts, rule 6.
#
# Before the first deploy:
#   cd kaktus && git init -b main && git add -A && git commit -m "Kaktus prototype"
#   gh repo create SindriMar02/kaktus-preview --public --source=. --remote=origin
#   bash deploy.sh
# Then read the real Pages URL rather than guessing it:
#   gh api repos/SindriMar02/kaktus-preview/pages --jq .html_url
set -e
REPO="$(cd "$(dirname "$0")" && pwd)"

TOP="$(git -C "$REPO" rev-parse --show-toplevel 2>/dev/null || echo none)"
if [ "$TOP" != "$REPO" ]; then
  echo "REFUSING TO DEPLOY: $REPO is not its own git repository (resolves to: $TOP)."
  echo "Running would force-push gh-pages onto the workspace repo. Create the repo first."
  exit 1
fi
if git -C "$REPO" remote -v | grep -q 'sndr-workspace-docs'; then
  echo "REFUSING TO DEPLOY: origin is the private workspace repo."
  exit 1
fi
if [ -z "$PREVIEW_ORIGIN" ]; then
  echo "REFUSING TO DEPLOY: set PREVIEW_ORIGIN to the REAL Pages URL."
  echo "Read it, never derive it from a folder name:"
  echo "  gh api repos/SindriMar02/kaktus-preview/pages --jq .html_url"
  exit 1
fi
ORIGIN="$PREVIEW_ORIGIN"

PREVIEW_ORIGIN="$ORIGIN" node "$REPO/src/build.mjs"

WT="$(mktemp -d)/kaktus-pages"
git -C "$REPO" worktree add --detach -q "$WT"
cd "$WT"
git branch -D gh-pages >/dev/null 2>&1 || true
git checkout -q --orphan gh-pages
git rm -rq --cached . >/dev/null 2>&1 || true
# clear the tree, never top it up: retired assets otherwise stay live
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$REPO/dist/." .
touch .nojekyll

# GATE 1 - check the STAGED tree, byte for byte what gets published. A preview without a
# usable favicon shows another origin's icon in the client's tab.
node "$REPO"/../_tools/favicon-guard.mjs "$WT"

git add -A
git -c user.email=sindri@klubbr.is -c user.name="Sindri Már" commit -q -m "Deploy $(git -C "$REPO" rev-parse --short HEAD) (noindex)"
git push -q -f origin gh-pages
cd "$REPO"
git worktree remove --force "$WT"
echo "deployed $(ls "$REPO/dist" | wc -l | tr -d ' ') top-level entries to gh-pages"

# GATE 2 - on-disk correct is not proof the client sees an icon. Check the DEPLOYED url.
node "$REPO"/../_tools/favicon-verify-live.mjs "$ORIGIN/"
