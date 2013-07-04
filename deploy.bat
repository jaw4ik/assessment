@ECHO off

SET DeploymentDirectory=%1
IF "%1"=="" SET DeploymentDirectory="D:\Applications\easygenerator"

ECHO "Cleaning ..."
RMDIR  /S /Q "%DeploymentDirectory%"

ECHO "Building ..."
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild sources\easygenerator.Web\easygenerator.Web.csproj /p:outdir="%DeploymentDirectory%\bin";webprojectoutputdir="%DeploymentDirectory%";debugsymbols=false;debugtype=none;TreatWarningsAsErrors=true /t:Clean,Build,TransformWebConfig /p:Configuration=Release

ECHO "Building .Net unit tests"
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild sources\easygenerator.DomainModel.Tests\easygenerator.DomainModel.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild sources\easygenerator.Tests\easygenerator.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild sources\easygenerator.Web.Tests\easygenerator.Web.Tests.csproj /verbosity:n /nologo /property:TreatWarningsAsErrors=true
IF NOT %ERRORLEVEL% == 0 GOTO ERROR

ECHO Running .Net unit tests...

"%VS110COMNTOOLS%..\IDE\mstest.exe" /testcontainer:sources\easygenerator.DomainModel.Tests\bin\Debug\easygenerator.DomainModel.Tests.dll
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%VS110COMNTOOLS%..\IDE\mstest.exe" /testcontainer:sources\easygenerator.Tests\bin\Debug\easygenerator.Tests.dll
IF NOT %ERRORLEVEL% == 0 GOTO ERROR
"%VS110COMNTOOLS%..\IDE\mstest.exe" /testcontainer:sources\easygenerator.Web.Tests\bin\Debug\easygenerator.Web.Tests.dll 
IF NOT %ERRORLEVEL% == 0 GOTO ERROR


ECHO "Deploying to %DeploymentDirectory% ..."
xcopy "./sources/easygenerator.Web/App/main-built.js" "%DeploymentDirectory%\App\" /Y /F /I
xcopy "sources/easygenerator.Web/obj/Release/TransformWebConfig/transformed/Web.config" "%DeploymentDirectory%\" /Y /F /I

DEL /S /Q /F "%DeploymentDirectory%\*.debug.config"
DEL /S /Q /F "%DeploymentDirectory%\*.release.config"
DEL /S /Q /F "%DeploymentDirectory%\packages.config"
DEL /S /Q /F "%DeploymentDirectory%\bin\*.config"
DEL /S /Q /F "%DeploymentDirectory%\bin\*.xml"

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