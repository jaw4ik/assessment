@echo off

SET DeploymentDirectory="D:\Applications\easygenerator"

ECHO "Cleaning ..."
RMDIR  /S /Q "%DeploymentDirectory%"

ECHO "Building ..."
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild "./sources/easygenerator.Web/easygenerator.Web.csproj" /p:outdir="%DeploymentDirectory%\bin";webprojectoutputdir="%DeploymentDirectory%";debugsymbols=false;debugtype=none

xcopy "./sources/easygenerator.Web/App/main-built.js" "%DeploymentDirectory%/App" /Y /F /I

DEL /S /Q /F "%DeploymentDirectory%\*.debug.config"
DEL /S /Q /F "%DeploymentDirectory%\*.release.config"
DEL /S /Q /F "%DeploymentDirectory%\packages.config"
DEL /S /Q /F "%DeploymentDirectory%\bin\*.config"
DEL /S /Q /F "%DeploymentDirectory%\bin\*.xml"