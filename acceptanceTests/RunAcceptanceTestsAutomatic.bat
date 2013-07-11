@echo off
for /f %%t  in ('date/t') do set dateStamp=%%t
for /f "tokens=1-2 delims=:" %%d in ('time/t')do set timeStamp=%%d.%%e
set outFile="%~dp0TestsResults\MyResult_%dateStamp%_%timeStamp%.html"

%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild "%~dp0easygenerator.AcceptanceTests.sln" /verbosity:q /nologo /property:TreatWarningsAsErrors=true
if %errorlevel% ==0 (
"%~dp0packages\NUnit.Runners.2.6.2\tools\nunit-console.exe" /include=ObjectivesList,ExperiencesList /labels /out="%~dp0TestsResults\TestResult.txt" /xml="%~dp0TestsResults\TestResult.xml" "%~dp0easygenerator.AcceptanceTests\bin\Debug\easygenerator.AcceptanceTests.dll"
"%~dp0packages\SpecFlow.1.9.0\tools\specflow.exe" nunitexecutionreport "%~dp0easygenerator.AcceptanceTests\easygenerator.AcceptanceTests.csproj" /out:%outFile% /testOutput:"%~dp0TestsResults\TestResult.txt" /xmlTestResult:"%~dp0TestsResults\TestResult.xml"  

goto :exit)
echo Cannot execute or build tests
:exit
set exitCode=0
if NOT %errorlevel% ==0 %exitCode%=1
echo %errorlevel%
echo %exitCode%
exit /B %exitCode%