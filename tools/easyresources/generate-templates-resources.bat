@echo off

set templates[0]=Simple course
set templates[1]=Personalized learning
set templates[2]=Exam
set templates[3]=Assessment
set templates[4]=Reader
set templates[5]=Quiz for Learni
set templates[6]=Simple course PDF

for /F "tokens=2 delims=[=]" %%i in ('set templates[') do call easyresources generate template -w "%%templates[%%i]%%" -o "_templates/_%%templates[%%i]%%" 

pause