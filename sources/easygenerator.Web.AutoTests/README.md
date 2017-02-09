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

###Useful links:
1. http://wiki.qatools.ru/display/AL/Allure+Commandline
2. http://webdriver.io
3. https://github.com/nodejs/node-gyp
4. http://www.ecma-international.org/ecma-262/6.0/
5. https://jasmine.github.io/pages/getting_started.html
