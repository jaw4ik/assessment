#Before running this script be sure that you have needed execution policy:
#Get-ExecutionPolicy -Scope CurrentUser
#To set correct execution policy run this command:
#Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
$ErrorActionPreference = "Stop"

$title = "EG Start Live Script:"

echo "Stop Maintenance website"
C:\Windows\System32\inetsrv\appcmd.exe stop site /site.name:"live.easygenerator.com_maintenance_/"
C:\Windows\System32\inetsrv\appcmd.exe stop apppool live.easygenerator.com_maintenance_
echo "Stop Beta website"
C:\Windows\System32\inetsrv\appcmd.exe stop site /site.name:"beta.easygenerator.com/"
C:\Windows\System32\inetsrv\appcmd.exe stop apppool beta.easygenerator.com
echo "Start Live website"
C:\Windows\System32\inetsrv\appcmd.exe start site /site.name:"live.easygenerator.com/"
C:\Windows\System32\inetsrv\appcmd.exe start apppool live.easygenerator.com

write-host "Live website is started!" -foregroundcolor Green


