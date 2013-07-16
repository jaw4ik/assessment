using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers.DriverInitializators
{
    public abstract class DriverInitializer
    {
        protected Dictionary<EgLocalization, string> localizationStringsIE = new Dictionary<EgLocalization, string>()
        {
            {EgLocalization.En,"en-En"},
            {EgLocalization.nlNl,"nl-Nl"},
            {EgLocalization.nlBe,"nl-Be"},
            {EgLocalization.Nl,"nl"},
            {EgLocalization.deDe,"de-De"},
            {EgLocalization.De,"de"},
            {EgLocalization.sl,"sl"}
        };
        protected Dictionary<EgLocalization, string> localizationStringsChrome = new Dictionary<EgLocalization, string>()
        {
            {EgLocalization.En,"en"},
            {EgLocalization.nlNl,"nl"},
            {EgLocalization.deDe,"de"},
            {EgLocalization.nlBe,"nl"},
            {EgLocalization.Nl,"nl"},
            {EgLocalization.De,"de"},
            {EgLocalization.sl,"sl"}
        };
        public abstract void SetNoCashe();
        public abstract void SetCulture(EgLocalization[] culture);
        public abstract RemoteWebDriver InitDriver();
    }
}
