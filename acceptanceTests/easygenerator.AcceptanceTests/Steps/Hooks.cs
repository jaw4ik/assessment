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
            DriverProvider.Current().Stop();
            Process.Start("taskkill", "/IM iisexpress.exe");
        }
        [BeforeScenario]
        public void BeforeScenario()
        {
            PrepareLocalization();
            DriverProvider.Current().Driver.Manage().Window.Maximize();
        }

        private void PrepareLocalization()
        {
            if (!ScenarioContext.Current.ScenarioInfo.Tags.Contains("Localization_Test") &&
                !FeatureContext.Current.FeatureInfo.Tags.Contains("Localization_Test"))
                DriverProvider.Current().Localization = new EgLocalization[] { EgLocalization.En };
        }
        [AfterScenario]
        public void AfterScenario()
        {
            DriverProvider.Current().Driver.Navigate().GoToUrl("about:blank");
        }
        //
        // https://github.com/techtalk/SpecFlow/wiki/Hooks
        //
        //[BeforeFeature("ObjectivesList", "SomeOneMoreFeatureTag")]   The same could be done for [BeforeScenario] for example
        //public void BeforeFeature()
        //{
        //    blablabla();
        //}

    }
}
