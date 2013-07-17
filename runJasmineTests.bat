@echo off

set oldDir=%CD%
set testHome=%~dp0

cd "%testHome%"

"tools/phantomjs/phantomjs.exe" tools/phantomjs/run-jasmine.js sources/easygenerator.Web/App/specs.html

IF NOT %ERRORLEVEL% == 0 GOTO ERROR

echo Success!!!
color A
GOTO END

:ERROR
color C
echo    ------------------------------- ERROR !!!!! -------------------------------
cd "%oldDir%"
exit /B 3

:END
cd "%oldDir%"
exit /B 0