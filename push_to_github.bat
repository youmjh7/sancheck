@echo off
set GIT="C:\Program Files\Git\bin\git.exe"
%GIT% add public/ src/components/LandingPage.jsx push_to_github.bat scripts/
%GIT% commit -m "UI: 새로운 강아지 이미지로 앱 로고 및 PWA 아이콘 전면 교체"
%GIT% push
echo Done!
