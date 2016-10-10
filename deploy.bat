@ECHO off

COLOR

SET DeploymentDirectory=%1
SET Instance=%2
SET Version=%3
SET CreateTags=%4
SET SurveyOriginUrl=%5 
SET SurveyPageUrl=%6
SET SurveyVersion=%7
SET SurveyDaysUntilShowUp=%8

SET CurrentDirectory=%~dp0

IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator"
IF "%2"=="" SET Instance="Release"
IF "%3"=="" SET Version="1.0.0"
IF "%4"=="" SET CreateTags="0"
IF "%4"=="false" SET CreateTags="0"
IF "%4"=="true" SET CreateTags="1"
IF "%5"=="" SET SurveyOriginUrl=""
IF "%6"=="" SET SurveyPageUrl=""
IF "%7"=="" SET SurveyVersion="1"
IF "%8"=="" SET SurveyDaysUntilShowUp="1"

call npm update
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

:: First attempt to install jspm modules
call node node_modules/jspm/jspm update

:: If jspm modules not installed -> install through proxy (for eg-d-web07)
IF %ERRORLEVEL% NEQ 0 (
	call SET HTTPS_PROXY=http://10.0.100.2:3128&node node_modules/jspm/jspm update
)
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call node node_modules/gulp/bin/gulp deploy --output=%DeploymentDirectory% --instance=%Instance% --version=%Version% --createTags=%CreateTags% --surveyOriginUrl=%SurveyOriginUrl% --surveyPageUrl=%SurveyPageUrl% --surveyVersion=%SurveyVersion% --surveyDaysUntilShowUp=%SurveyDaysUntilShowUp%
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