@ECHO off

COLOR

SET DeploymentDirectory=%1
SET Transform=%2

SET CurrentDirectory=%~dp0

IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator"
IF "%2"=="" SET Transform="Release"

ECHO "Cleaning ..."
RMDIR  /S /Q "%DeploymentDirectory%"

ECHO "Building main project ..."
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.Web\easygenerator.Web.csproj /p:outdir="%DeploymentDirectory%\bin";webprojectoutputdir="%DeploymentDirectory%";debugsymbols=false;debugtype=none;TreatWarningsAsErrors=true /t:Clean,Build /p:Configuration=Release

ECHO "Applying Web.config transform - %Transform% ..."
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" tools/WebConfigTransform/Transform.proj /p:Instance=%Transform%
IF NOT EXIST tools/WebConfigTransform/%Transform%.config GOTO ERROR

ECHO "Building .Net unit tests"
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.DomainModel.Tests\easygenerator.DomainModel.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true /property:PreBuildEvent= /property:PostBuildEvent=
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.DataAccess.Tests\easygenerator.DataAccess.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true /property:PreBuildEvent= /property:PostBuildEvent=
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.Infrastructure.Tests\easygenerator.Infrastructure.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true /property:PreBuildEvent= /property:PostBuildEvent=
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%PROGRAMFILES(x86)%\MSBuild\12.0\Bin\msbuild" sources\easygenerator.Web.Tests\easygenerator.Web.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true /property:PreBuildEvent= /property:PostBuildEvent=
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO Running .Net unit tests...
"%MSTestPath%\mstest.exe" /testcontainer:sources\easygenerator.DomainModel.Tests\bin\Debug\easygenerator.DomainModel.Tests.dll
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%MSTestPath%\mstest.exe" /testcontainer:sources\easygenerator.DataAccess.Tests\bin\Debug\easygenerator.DataAccess.Tests.dll 
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%MSTestPath%\mstest.exe" /testcontainer:sources\easygenerator.Infrastructure.Tests\bin\easygenerator.Infrastructure.Tests.dll 
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%MSTestPath%\mstest.exe" /testcontainer:sources\easygenerator.Web.Tests\bin\Debug\easygenerator.Web.Tests.dll 
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

echo Running Jasmine tests...
call "tools/grunt/node_modules/.bin/grunt" jasmine --gruntfile=tools/grunt/gruntfile.js
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call npm install
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

call node node_modules/gulp/bin/gulp build
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO "Deploying to %DeploymentDirectory% ..."
IF NOT EXIST "%DeploymentDirectory%\Download" MKDIR "%DeploymentDirectory%\Download"

XCOPY "./sources/easygenerator.Web/Content/*.css" "%DeploymentDirectory%\Content\" /Y /F /I
XCOPY "./sources/easygenerator.Web/App/main-built.js" "%DeploymentDirectory%\App\" /Y /F /I
XCOPY "tools/WebConfigTransform/%Transform%.config" "%DeploymentDirectory%\Web.config" /Y /F /I
DEL "tools\WebConfigTransform\%Transform%.config"

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
DEL /S /Q /F "%DeploymentDirectory%\Content\*.less"
RMDIR /S /Q "%DeploymentDirectory%\Scripts\jasmine"

XCOPY "./sources/easygenerator.ConversionServer/package.json" "%DeploymentDirectory%\conversion\" /Y /F /I
XCOPY "./sources/easygenerator.ConversionServer/www.js" "%DeploymentDirectory%\conversion\" /Y /F /I
XCOPY "./sources/easygenerator.ConversionServer/server.js" "%DeploymentDirectory%\conversion\" /Y /F /I
XCOPY "./sources/easygenerator.ConversionServer/config.js" "%DeploymentDirectory%\conversion\" /Y /F /I
XCOPY "./sources/easygenerator.ConversionServer/converter/config.js" "%DeploymentDirectory%\conversion\converter\" /Y /F /I
XCOPY "./sources/easygenerator.ConversionServer/converter/index.js" "%DeploymentDirectory%\conversion\converter\" /Y /F /I
XCOPY "./sources/easygenerator.ConversionServer/audio_image.jpg" "%DeploymentDirectory%\conversion\" /Y /F /I
cd "%DeploymentDirectory%\conversion"
call npm install --production
cd "%CurrentDirectory%"

ECHO Success!!!
COLOR A

GOTO END

:ERROR
ECHO    ------------------------------- ERROR !!!!! -------------------------------
RMDIR  /S /Q "%DeploymentDirectory%"
EXIT /B 3

:END
EXIT /B 0