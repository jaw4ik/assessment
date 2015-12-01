@ECHO off

COLOR

SET DeploymentDirectory=%1
SET Instance=%2

SET CurrentDirectory=%~dp0

IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator.StorageServer"
IF "%2"=="" SET Instance="Release"

call npm install
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call node node_modules/gulp/bin/gulp deploy-storage-server --output=%DeploymentDirectory% --instance=%Instance%
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO Success!!!
COLOR A

GOTO END

:ERROR
COLOR C
ECHO    ------------------------------- ERROR !!!!! -------------------------------
RMDIR  /S /Q "%DeploymentDirectory%"
EXIT /B 3
COLOR

:END
EXIT /B 0
COLOR