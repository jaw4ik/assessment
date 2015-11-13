@ECHO off

COLOR

SET DeploymentDirectory=%1
SET Instance=%2
SET Version=%3
SET CreateTags=%4

SET CurrentDirectory=%~dp0

IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator"
IF "%2"=="" SET Instance="Release"
IF "%3"=="" SET Version="1.0.0"
IF "%4"=="" SET CreateTags="0"
IF "%4"=="false" SET CreateTags="0"
IF "%4"=="true" SET CreateTags="1"

call npm install
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call node node_modules/jspm/jspm install
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call node node_modules/gulp/bin/gulp deploy --output=%DeploymentDirectory% --instance=%Instance% --version=%Version% --createTags=%CreateTags%
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO Success!!!
COLOR A

GOTO END

:ERROR
ECHO    ------------------------------- ERROR !!!!! -------------------------------
RMDIR  /S /Q "%DeploymentDirectory%"
EXIT /B 3

:END
EXIT /B 0