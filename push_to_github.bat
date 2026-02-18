@echo off
set GIT="C:\Program Files\Git\bin\git.exe"
%GIT% init
%GIT% config user.email "youmjh7@github.com"
%GIT% config user.name "youmjh7"
%GIT% add .
%GIT% commit -m "Initial commit: 산책하니? app"
%GIT% branch -M main
%GIT% remote remove origin 2>nul
%GIT% remote add origin https://github.com/youmjh7/sancheck.git
%GIT% push -u origin main
echo Done!
