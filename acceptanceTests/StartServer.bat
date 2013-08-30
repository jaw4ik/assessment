set testSite=TestSite
FOR /F %%i IN ("%~dp0easygenerator.Web") DO set path=%%~fi
"%programfiles(x86)%\IIS Express\APPCMD.exe" delete site %testSite%
"%programfiles(x86)%\IIS Express\APPCMD.exe" add site /name:%testSite% /bindings:"http/*:5656:" /physicalPath:"%path%"
"%programfiles(x86)%\IIS Express\iisexpress.exe" /systray:false /site:%testSite%