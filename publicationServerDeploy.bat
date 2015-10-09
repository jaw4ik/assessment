@ECHO off

COLOR

SET DeploymentDirectory=%1
SET Transform=%2

IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator.PublicationServer"
IF "%2"=="" SET Transform="Release"

ECHO "Cleaning ..."
RMDIR  /S /Q "%DeploymentDirectory%"

ECHO "Building main project ..."
"%PROGRAMFILES(x86)%\MSBuild\14.0\Bin\msbuild" sources\easygenerator.PublicationServer.Web\easygenerator.PublicationServer.Web.csproj /p:outdir="%DeploymentDirectory%\bin";webprojectoutputdir="%DeploymentDirectory%";debugsymbols=false;debugtype=none;TreatWarningsAsErrors=true /t:Clean,Build /p:Configuration=Release

ECHO "Building .Net unit tests"
"%PROGRAMFILES(x86)%\MSBuild\14.0\Bin\msbuild" sources\easygenerator.PublicationServer.Tests\easygenerator.PublicationServer.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true /property:PreBuildEvent= /property:PostBuildEvent=
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO Running .Net unit tests...
"%MSTestPath%\mstest.exe" /testcontainer:sources\easygenerator.PublicationServer.Tests\bin\Debug\easygenerator.PublicationServer.Tests.dll
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO "Deploying to %DeploymentDirectory% ..."
IF NOT EXIST "%DeploymentDirectory%\courses" MKDIR "%DeploymentDirectory%\courses"

ECHO "Deploying to %DeploymentDirectory% ..."
IF NOT EXIST "%DeploymentDirectory%\UploadedPackages" MKDIR "%DeploymentDirectory%\UploadedPackages"

DEL /S /Q /F "%DeploymentDirectory%\*.debug.config"
DEL /S /Q /F "%DeploymentDirectory%\*.release.config"
DEL /S /Q /F "%DeploymentDirectory%\packages.config"
DEL /S /Q /F "%DeploymentDirectory%\bin\*.config"
DEL /S /Q /F "%DeploymentDirectory%\bin\*.xml"
DEL /S /Q /F "%DeploymentDirectory%\*.pdb"
DEL /S /Q /F "%DeploymentDirectory%\*.spec.js"
DEL /S /Q /F "%DeploymentDirectory%\apple-touch-icon*"
DEL /S /Q /F "%DeploymentDirectory%\Scripts\*.map"
DEL /Q /F "%DeploymentDirectory%\humans.txt"
RMDIR /S /Q "%DeploymentDirectory%\Scripts\jasmine"

ECHO Success!!!
COLOR A

GOTO END

:ERROR
COLOR C
ECHO    ------------------------------- ERROR !!!!! -------------------------------
RMDIR  /S /Q "%DeploymentDirectory%"
EXIT /B 3

:END
EXIT /B 0