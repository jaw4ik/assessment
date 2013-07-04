using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TechTalk.SpecFlow;
using System.Diagnostics;
using easygenerator.AcceptanceTests.Helpers;

namespace easygenerator.AcceptanceTests.Steps
{

    [Binding]
    public class Hooks
    {
        [BeforeTestRun]
        public static void InitTestRun()
        {
            Process.Start("StartServer.bat");
        }
        [AfterTestRun]
        public static void CleanTestRun()
        {
            DriverProvaider.StopCurrent();

            Process.Start("taskkill", "/IM iisexpress.exe");
        }

        [AfterScenario]
        public void AfterScenario()
        {
            DriverProvaider.Current().Navigate().GoToUrl("about:blank");
        }

    }
}
