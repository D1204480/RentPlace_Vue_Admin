#!/usr/bin/env sh

# 當發生錯誤時終止腳本
set -e

# 建構
npm run build

# 進入輸出產物資料夾
cd dist

# 如果你要部署到自定義網域
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -