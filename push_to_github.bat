@echo off
set GIT="C:\Program Files\Git\bin\git.exe"
%GIT% add index.html src/index.css src/App.css src/components/LandingPage.css src/components/DogInfo.css src/components/DogInfo.jsx src/components/WalkMap.jsx push_to_github.bat
%GIT% commit -m "UI: 모던 글래스모피즘 & 부드러운 그라데이션으로 전체 테마 개편"
%GIT% push
echo Done!
