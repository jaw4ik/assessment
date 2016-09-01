@echo off

set templates[0]=Simple course
set templates[1]=Personalized learning
set templates[2]=Assessment
set templates[3]=Reader
set templates[4]=Nielsen and ICEMD Simple course

for /F "tokens=2 delims=[=]" %%i in ('set templates[') do call easyresources generate --worksheetName "%%templates[%%i]%%" --outputPath "_templates/_%%templates[%%i]%%" --excludeLocalizations "ar"

pause