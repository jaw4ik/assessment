@echo off
set outFile="%~dp0TestsResults\MyResult.html"
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild "%~dp0easygenerator.AcceptanceTests.sln" /verbosity:q /nologo /property:TreatWarningsAsErrors=true
if not %errorlevel% ==0 (
echo Cannot execute or build tests
exit /B 1)
"%~dp0packages\NUnit.Runners.2.6.2\tools\nunit-console.exe" /labels /out="%~dp0TestsResults\TestResult.txt" /xml="%~dp0TestsResults\TestResult.xml" "%~dp0easygenerator.AcceptanceTests\bin\Debug\easygenerator.AcceptanceTests.dll"
set errorCode=%errorLevel%
"%~dp0packages\SpecFlow.1.9.0\tools\specflow.exe" nunitexecutionreport "%~dp0easygenerator.AcceptanceTests\easygenerator.AcceptanceTests.csproj" /out:%outFile% /testOutput:"%~dp0TestsResults\TestResult.txt" /xmlTestResult:"%~dp0TestsResults\TestResult.xml"  
exit /B %errorCode%