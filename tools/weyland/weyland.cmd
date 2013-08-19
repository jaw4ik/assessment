@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\weyland\bin\cli.js" %*
) ELSE (
  node  "%~dp0\node_modules\weyland\bin\cli.js" %*
)