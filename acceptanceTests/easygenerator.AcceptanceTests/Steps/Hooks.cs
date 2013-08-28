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

            //TestExperienceBuilder builder = new TestExperienceBuilder();
            //System.Threading.Thread.Sleep(6000);
            //string result = builder.BuildExperience("testdata.json", @"http://localhost:5656/experience/build");
            //if (System.IO.Directory.Exists(@"easygenerator.Web\Templates\TestPackage"))
            //{
            //    System.IO.Directory.Delete(@"easygenerator.Web\Templates\TestPackage", true);
            //}
            //System.IO.Compression.ZipFile.ExtractToDirectory(@"easygenerator.Web\Download\7.zip", @"easygenerator.Web\Templates\TestPackage");
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
                !FeatureContext.Current.FeatureInfo.Tags.Contains("Localization_Test") &&
                DriverProvider.Current().Localization.Length != 1)
                DriverProvider.Current().Localization = Constants.En;
            //if (!ScenarioContext.Current.ScenarioInfo.Tags.Contains("Localization_Test") &&
            //    !FeatureContext.Current.FeatureInfo.Tags.Contains("Localization_Test") &&
            //    DriverProvider.Current().Localization.Length != 1 &&
            //    DriverProvider.Current().Localization != Constants.En)
            //    DriverProvider.Current().Localization = Constants.En;
        }
        [AfterScenario]
        public void AfterScenario()
        {
            //DriverProvider.Current().Driver.Navigate().GoToUrl("about:blank");            
        }
        [BeforeStep]
        public void BeforeStep()
        {
            System.Threading.Thread.Sleep(100);
        }
        [AfterStep]
        public void AfterStep()
        {
            System.Threading.Thread.Sleep(100);
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
