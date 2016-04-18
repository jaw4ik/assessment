@echo off

set templates[0]=Simple course
set templates[1]=Personalized learning
set templates[2]=Assessment
set templates[3]=Reader

for /F "tokens=2 delims=[=]" %%i in ('set templates[') do call easyresources generate template --worksheetName "%%templates[%%i]%%" --outputPath "_templates/_%%templates[%%i]%%" --excludeLocalizations "ar"

pause