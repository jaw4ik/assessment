#easygenerator.Web.AutoTests

##Configuration:
1. Make sure you have installed `nodejs >= 6.0`, `java > 7`,  `Visual C++ Build Tools`.
2. Make sure you have installed `node-gyp` and set of utils for it. You can find all info here: https://github.com/nodejs/node-gyp
3. Install `7-Zip` if not installed yet, add to PATH.
4. Install `Allure commandline` into your PC for building Allure reports. Download latest release and unpack it into your dest folder. Add it to path env variable.
5. Open `easygenerator.Web.Autotests` folder and run `npm install` command.
6. Make sure you have `IE11`, latest `Chrome`, `Firefox <= 45` installed on your PC.
7. Make sure you have enabled protected mode for all security zones in `IE11`. Go to `options` -> `internet options` -> `security`, then select `Enable Protected Mode` for all zones.
8. Open `wdio.conf.js` file in the autotests project root and configure all needed settings.
9. Open `data/config.js` file and configure databases settings (databases will be restored using backups with test data from `data/backups`).
10. To run tests execute `node app.js` command in the autotests project root or execute `gulp run-autotests` in the solution root.
11. To run tests and build allure report execute `gulp autotests` in the solution root.
12. Use `start-server` command defined in `launch.json` to run `easygenerator` services. Change config settings in services or use predefined configs located in `webConfigs/[service_name]/Web.config`.
13. Use `restore-from-backups` and `update-backups` commands to restore or update data in backups.
14. Use `launch-tests` command to launch tests and `connect-wdio` command to debug child process used for tests running.

##Enviroment variables: 

If you have some specific configuration (ex. MS SQL Server instance name) you can create .env file in the root of autotests and specify your variables.

###Supported variables:
1. `continue`=true || false -- stop proccess after tests finished (default: false)
2. `debug`=true || false -- enable/disable spec debugging (default: false)
3. `specs`={{array}} -- specify test files (default: ['./test/specs/**/*.js'])
4. `exclude`={{array}} -- specify test files for exclude (default: [])
5. `maxInstances`={{int}} -- define how many instances (default: 1)
6. `browserName`={{array}} -- define browser name and maxInstances for it (default: ['phantomjs'])
7. `baseUrl`={{string}} -- base app url (default: 'http://localhost:666')
8. `SERVER_NAME`={{string}} -- mssql server instance name (default: 'localhost/SQLEXPRESS')
9. `SERVER_PORT`={{int}} -- mssql TCP port (default: 1433)
10. `DB_DATA_PATH`={{string}} -- path to mssql data (default: 'C:/Program Files/Microsoft SQL Server/MSSQL12.SQLEXPRESS/MSSQL/DATA/')
11. `DB_LOG_PATH`={{string}} -- path to mssql logs (default: 'C:/Program Files/Microsoft SQL Server/MSSQL12.SQLEXPRESS/MSSQL/DATA/')
12. `DB_USERNAME`={{string}} -- mssql user (default: 'easygenerator')
13. `DB_PASSWORD`={{string}} -- mssql user password (default: 'abcABC123')

*Note: do not push your .env file into repository*

###Useful links:
1. http://wiki.qatools.ru/display/AL/Allure+Commandline
2. http://webdriver.io
3. https://github.com/nodejs/node-gyp
4. http://www.ecma-international.org/ecma-262/6.0/
5. https://jasmine.github.io/pages/getting_started.html
