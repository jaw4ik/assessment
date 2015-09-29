@ECHO off

COLOR

SET DeploymentDirectory=%1

IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator.Player"

call npm install
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call node node_modules/gulp/bin/gulp deploy-player --outputPlayer=%DeploymentDirectory%
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