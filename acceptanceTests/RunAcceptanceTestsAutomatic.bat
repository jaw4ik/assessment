@echo off
set outFile="%~dp0TestsResults\MyResult.html"
set webSiteDir=%~dp0easygenerator.AcceptanceTests\bin\Release\
set testsProject=%~dp0easygenerator.AcceptanceTests\easygenerator.AcceptanceTests.csproj

if exist %outFile% del %outFile%
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild %~dp0..\sources\easygenerator.Web\easygenerator.Web.csproj /verbosity:q /nologo /p:TreatWarningsAsErrors=true /t:Clean,Build,TransformWebConfig /p:Configuration=AutoTests
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild "%testsProject%" /t:Clean,Build /verbosity:q /nologo /property:TreatWarningsAsErrors=true /p:Configuration=Release

xcopy "%~dp0..\sources\easygenerator.Web\obj\AutoTests\TransformWebConfig\transformed\Web.config" "%webSiteDir%\easygenerator.Web\" /Y /F /I

if not %errorlevel% ==0 (
echo Cannot execute or build tests
exit /B 1)
"%~dp0packages\NUnit.Runners.2.6.2\tools\nunit-console.exe" /exclude=Errors,Question /labels /out="%~dp0TestsResults\TestResult.txt" /xml="%~dp0TestsResults\TestResult.xml" "%webSiteDir%easygenerator.AcceptanceTests.dll"
set errorCode=%errorLevel%
"%~dp0packages\SpecFlow.1.9.0\tools\specflow.exe" nunitexecutionreport "%testsProject%" /out:%outFile% /testOutput:"%~dp0TestsResults\TestResult.txt" /xmlTestResult:"%~dp0TestsResults\TestResult.xml"  
exit /B %errorCode%