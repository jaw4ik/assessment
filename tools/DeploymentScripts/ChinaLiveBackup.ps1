#Before running this script be sure that you have needed execution policy:
#Get-ExecutionPolicy -Scope CurrentUser
#To set correct execution policy run this command:
#Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
$ErrorActionPreference = "Stop"

$title = "EG Live Backup Script:"
$message = "Script will stop Live Website and start Maintenance Website.`nAre you sure that you want to run this script?"

$yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", `
    "Stop Live Website, start Maintenance Website and make all backups."

$no = New-Object System.Management.Automation.Host.ChoiceDescription "&No", `
    "Exit."

$options = [System.Management.Automation.Host.ChoiceDescription[]]($yes, $no)

$result = $host.ui.PromptForChoice($title, $message, $options, 1) 

switch ($result)
{
	1 {Exit}
}

echo "Stop Live website"
C:\Windows\System32\inetsrv\appcmd.exe stop site /site.name:"live.easygenerator.com.cn/"
echo "Start Maintenance website"
C:\Windows\System32\inetsrv\appcmd.exe start site /site.name:"live.easygenerator.com.cn(maintenance)/"

$date = Get-Date -UFormat "%d.%m.%Y"
$7zAdd ="cmd /C 'C:\Program Files\7-Zip\7z.exe' a "
$websiteBackupsFolder = "D:\Website_backups\"

echo "Creating database backup:"

$dbName = "china.easygenerator.com"
$dbBackupName = $dbName + "-" + $date + ".bak"
$dbBackupPath = "D:\SQL_Backup\" + $dbBackupName 
$query = "BACKUP DATABASE [" + $dbName + "] TO DISK='" + $dbBackupPath + "' WITH STATS"

SqlCmd -E -S . -Q $query

echo "Creating website backup:"

$sourcePath = "D:\Applications\live.easygenerator.com.cn\*"
$websiteBackupsPath = "'" + $websiteBackupsFolder + "live.easygenerator.com.cn-website-backup-" + $date + ".zip'"

$backupCommand = $7zAdd + $websiteBackupsPath + " " + $sourcePath

Invoke-Expression -command "$backupCommand"

echo "Creating filestorage backup:"

$sourcePath = "D:\Applications\live.easygenerator.com.cn``(FileStorage``)\*"
$filestorageBackupsPath = "'" + $websiteBackupsFolder + "live.easygenerator.com.cn-fileStorage-backup-" + $date + ".zip'"

$backupCommand = $7zAdd + $filestorageBackupsPath + " " + $sourcePath

Invoke-Expression -command "$backupCommand"

write-host "Backups are done!" -foregroundcolor Green
write-host "Database: $dbBackupPath" -foregroundcolor Yellow
write-host "Website: $websiteBackupsPath" -foregroundcolor Yellow
write-host "File Storage: $filestorageBackupsPath" -foregroundcolor Yellow
write-host "Warning: Live website is still stopped!" -foregroundcolor Red


