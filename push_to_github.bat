@echo off
set GIT="C:\Program Files\Git\bin\git.exe"
%GIT% add index.html vite.config.js push_to_github.bat
%GIT% commit -m "Feat: 모바일 PWA 완벽 지원 (Manifest 및 iOS 홈 화면 아이콘 설정)"
%GIT% push
echo Done!
