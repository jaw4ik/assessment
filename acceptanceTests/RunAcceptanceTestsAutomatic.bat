@echo off
set outFile="%~dp0TestsResults\MyResult.html"
set webSiteDir=%~dp0easygenerator.AcceptanceTests\bin\Release\
set testsProject=%~dp0easygenerator.AcceptanceTests\easygenerator.AcceptanceTests.csproj

if "%Browser%"=="FF" (set excluded="NotFirefox")
if "%Browser%"=="Chrome" (set excluded="NotChrome")
if "%Browser%"=="IE" (set excluded="NotIE")

if "%Feature%"=="All" (set excludedfeatures="Errors")
if "%Feature%"=="AnswerOptions" (set excludedfeatures="Errors,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="BuildExperience" (set excludedfeatures="Errors,AnswerOptions,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="CUDExperience" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="CUDObjective" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDQuestion,CUDExperience,RelateObjectiveToExperience")
if "%Feature%"=="CUDQuestion" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,RelateObjectiveToExperience")
if "%Feature%"=="Experience" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="Explanations" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="ListOfObjectives" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="ListOfExperiences" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="ListOfQuestions" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="Localization" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="PackageListOfObjectives" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,Question,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="Question" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,CUDExperience,CUDObjective,CUDQuestion,RelateObjectiveToExperience")
if "%Feature%"=="RelateObjectiveToExperience" (set excludedfeatures="Errors,AnswerOptions,BuildExperience,Experience,Explanations,ListOfObjectives,ListOfExperiences,ListOfQuestions,Localization,PackageListOfObjectives,Question,CUDExperience,CUDObjective,CUDQuestion")



if exist %outFile% del %outFile%
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild %~dp0..\sources\easygenerator.Web\easygenerator.Web.csproj /verbosity:q /nologo /p:TreatWarningsAsErrors=true /t:Clean,Build,TransformWebConfig /p:Configuration=AutoTests
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\msbuild "%testsProject%" /t:Clean,Build /verbosity:q /nologo /property:TreatWarningsAsErrors=true /p:Configuration=Release

xcopy "%~dp0..\sources\easygenerator.Web\obj\AutoTests\TransformWebConfig\transformed\Web.config" "%webSiteDir%\easygenerator.Web\" /Y /F /I
xcopy "%~dp0..\acceptanceTests\easygenerator.AcceptanceTests.dll.config" /Y /F "%webSiteDir%\easygenerator.AcceptanceTests.dll.config"

if not %errorlevel% ==0 (
echo Cannot execute or build tests
exit /B 1)
"%~dp0packages\NUnit.Runners.2.6.2\tools\nunit-console.exe" /exclude=%excluded%,%excludedfeatures% /labels /out="%~dp0TestsResults\TestResult.txt" /xml="%~dp0TestsResults\TestResult.xml" "%webSiteDir%easygenerator.AcceptanceTests.dll"
set errorCode=%errorLevel%
"%~dp0packages\SpecFlow.1.9.0\tools\specflow.exe" nunitexecutionreport "%testsProject%" /out:%outFile% /testOutput:"%~dp0TestsResults\TestResult.txt" /xmlTestResult:"%~dp0TestsResults\TestResult.xml"  
exit /B %errorCode%