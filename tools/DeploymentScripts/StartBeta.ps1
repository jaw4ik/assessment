#Before running this script be sure that you have needed execution policy:
#Get-ExecutionPolicy -Scope CurrentUser
#To set correct execution policy run this command:
#Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
$ErrorActionPreference = "Stop"

$title = "EG Start Beta Script:"

echo "Start Beta website"
C:\Windows\System32\inetsrv\appcmd.exe start apppool beta.easygenerator.com
C:\Windows\System32\inetsrv\appcmd.exe start site /site.name:"beta.easygenerator.com/"

write-host "Beta website is started and ready for testing!" -foregroundcolor Green
write-host "Warning: Live website is still stopped!" -foregroundcolor Yellow
