using Microsoft.Win32;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers.DriverInitializators
{
    public class IEInitializer : DriverInitializer
    {
        InternetExplorerOptions pref = new InternetExplorerOptions();
        public override void SetNoCashe()
        {
            var path = Path.Combine(Environment.GetEnvironmentVariable("WINDIR"), "system32\\RunDll32.exe");
            System.Diagnostics.Process.Start(path, "InetCpl.cpl,ClearMyTracksByProcess 8");
        }

        public override void SetCulture(string culture)
        {
            RegistryKey myKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Internet Explorer\International", true);
            if (myKey == null)
                myKey = Registry.Users.OpenSubKey(@".Default\Software\Microsoft", true).CreateSubKey("Internet Explorer").CreateSubKey("International");
            myKey.SetValue("AcceptLanguage", culture, RegistryValueKind.String);
        }

        public override RemoteWebDriver InitDriver()
        {
            return new InternetExplorerDriver(pref);
        }
    }
}
