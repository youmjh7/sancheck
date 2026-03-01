@echo off
set GIT="C:\Program Files\Git\bin\git.exe"
%GIT% add -A
%GIT% commit -m "Fix: 기존 캐시 완전 무력화를 위해 아이콘 파일명 v4로 변경 배포"
%GIT% push
echo Done!
