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
        public abstract void SetNoCashe();
        public abstract void SetCulture(string culture);
        public abstract RemoteWebDriver InitDriver();
    }
}
