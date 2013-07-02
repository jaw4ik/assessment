using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TechTalk.SpecFlow;
using System.Diagnostics;

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
            DriverProveider.StopAll();
        }

        [AfterScenario]
        public void AfterScenario()
        {
            DriverProveider.Current().Navigate().GoToUrl("about:blank");
        }

    }
}
