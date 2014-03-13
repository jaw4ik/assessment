@ECHO off

color

SET DeploymentDirectory=%1
IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator"

ECHO "Cleaning ..."
RMDIR  /S /Q "%DeploymentDirectory%"

ECHO "Building ..."
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.Web\easygenerator.Web.csproj /p:outdir="%DeploymentDirectory%\bin";webprojectoutputdir="%DeploymentDirectory%";debugsymbols=false;debugtype=none;TreatWarningsAsErrors=true /t:Clean,Build,TransformWebConfig /p:Configuration=Release

IF NOT EXIST sources/easygenerator.Web/obj/Release/TransformWebConfig/transformed/Web.config GOTO ERROR

ECHO Creating "Download" directory ...
IF NOT EXIST "%DeploymentDirectory%\Download" MKDIR "%DeploymentDirectory%\Download"

ECHO "Building .Net unit tests"
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.DomainModel.Tests\easygenerator.DomainModel.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true /property:PreBuildEvent= /property:PostBuildEvent=
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.Web.Tests\easygenerator.Web.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true /property:PreBuildEvent= /property:PostBuildEvent=
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO Running .Net unit tests...

"%VS120COMNTOOLS%..\IDE\mstest.exe" /testcontainer:sources\easygenerator.DomainModel.Tests\bin\Debug\easygenerator.DomainModel.Tests.dll
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%VS120COMNTOOLS%..\IDE\mstest.exe" /testcontainer:sources\easygenerator.Web.Tests\bin\Debug\easygenerator.Web.Tests.dll 
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

echo Running Jasmine tests...
call "tools/grunt/node_modules/.bin/grunt" jasmine --gruntfile=tools/grunt/gruntfile.js
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO "Deploying to %DeploymentDirectory% ..."
xcopy "./sources/easygenerator.Web/App/main-built.js" "%DeploymentDirectory%\App\" /Y /F /I
xcopy "sources/easygenerator.Web/obj/Release/TransformWebConfig/transformed/Web.config" "%DeploymentDirectory%\" /Y /F /I

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
color A

GOTO END

:ERROR
color C
ECHO    ------------------------------- ERROR !!!!! -------------------------------
RMDIR  /S /Q "%DeploymentDirectory%"
EXIT /B 3

:END
EXIT /B 0