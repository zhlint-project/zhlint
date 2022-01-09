#!/usr/bin/env sh

# build
pnpm run docs:build

# navigate into the build output directory
cd docs/.vitepress/dist

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Jinjiang/zhlint.git master:gh-pages

cd -
