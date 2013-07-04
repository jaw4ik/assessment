using easygenerator.AcceptanceTests.Steps;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public class ObjectivesDataSetter
    {
        public void AddObjectiveToDatabase(string id, string title)
        {
            ExcecuteTestScript(String.Format("Test.AddNewObjective('{0}','{1}')", id, title));
            RebuildView();
        }
        public void EmptyObjectivesList()
        {
            ExcecuteTestScript("Test.EmptyObjectivesList()");
            RebuildView();
        }
        private void RebuildView()
        {
            DriverProvaider.Current().ExecuteScript("require('viewmodels/objectives/objectives').activate()");
        }
        private void InitObjectivesEnvironment()
        {
            string scripts = DataReader.Read(@"JS\SetObjectivesScripts.js");
            AddTestScriptsToHtml(scripts);
        }
        private string ExcecuteTestScript(string script)
        {
            bool areScriptsPresent = (bool)DriverProvaider.Current().ExecuteScript("return typeof Test !== 'undefined'");

            WaitForDataContextLoaded();
            if (!areScriptsPresent)
                InitObjectivesEnvironment();

            return (string)DriverProvaider.Current().ExecuteScript(script);
        }

        private static void WaitForDataContextLoaded()
        {
            bool isDataContextLoaded = false;
            int i = 0;
            do
            {
                i++;
                System.Threading.Thread.Sleep(100);
                isDataContextLoaded = (bool)DriverProvaider.Current().ExecuteScript("return document.getElementById('content')!==null");
                if (i > 50)
                    throw new TimeoutException("Content data is not reachable");

            } while (!isDataContextLoaded);
        }
        private static void AddTestScriptsToHtml(string scripts)
        {
            var text = String.Format("var head = document.getElementsByTagName('head')[0];var s = document.createElement('script');var t=document.createTextNode(\"{0}\");s.setAttribute('type','text/javascript');s.appendChild(t);head.appendChild(s);", scripts);
            DriverProvaider.Current().ExecuteScript(text);
        }
    }
    public class DataReader
    {
        public static string Read(string fileName)
        {
            var path = System.IO.Path.Combine(Environment.CurrentDirectory, fileName);
            var lines = System.IO.File.ReadAllLines(path);
            return String.Concat(lines);
        }
    }
}
