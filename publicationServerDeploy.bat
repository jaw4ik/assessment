@ECHO off

COLOR

SET DeploymentDirectory=%1
SET Instance=%2

SET CurrentDirectory=%~dp0

IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator.PublicationServer"
IF "%2"=="" SET Instance="Release"

call npm install
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call node node_modules/gulp/bin/gulp deploy-publication-server --output=%DeploymentDirectory% --instance=%Instance%
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