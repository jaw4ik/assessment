using easygenerator.AcceptanceTests.Steps;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public class DataSetter
    {
        public void AddObjectivesToDatabase(ObjectiveData[] objectives)
        {
            foreach (var obj in objectives)
            {
                if (obj.Id != null) obj.Id = "0";
                ExcecuteTestScript(String.Format("test.AddNewObjective('{0}','{1}')", obj.Id, obj.Title));
            }
            RebuildView();
        }
        public void AddPublicationsToDatabase(PublicationData[] publications)
        {
            foreach (var pub in publications)
            {
                if (pub.Id != null) pub.Id = "0";
                ExcecuteTestScript(String.Format("test.AddNewPublication('{0}','{1}')", pub.Id, pub.Title));
            }
        }
        public void AddQuestionsToDatabase(string objTitle, QuestionData[] questions)
        {
            foreach (var quest in questions)
            {
                if (quest.Id != null) quest.Id = "0";
                ExcecuteTestScript(String.Format("test.AddQuestionsToObjective('{0}','{1}','2')", objTitle, quest.Id, quest.Title));
            }
        }
        public void EmptyQuestionsListOfObjective(string objTitle)
        {
            ExcecuteTestScript(String.Format("test.EmptyQuestionsOfObjective('{0}')", objTitle));
            RebuildView();
        }
        public void EmptyObjectivesList()
        {
            ExcecuteTestScript("test.EmptyObjectivesList()");
            RebuildView();
        }
        public void EmptyPublicationsList()
        {
            ExcecuteTestScript("test.EmptyPublicationsList()");
        }
        private void RebuildView()
        {
            DriverProvider.Current().ExecuteScript("require('viewmodels/objectives/objectives').activate()");
        }
        private void InitObjectivesEnvironment()
        {
            string scripts = DataReader.Read(@"JS\SetObjectivesScripts.js");
            AddTestScriptsToHtml(scripts);
        }
        private string ExcecuteTestScript(string script)
        {
            bool areScriptsPresent = (bool)DriverProvider.Current().ExecuteScript("return typeof Test !== 'undefined'");

            WaitForDataContextLoaded();
            if (!areScriptsPresent)
                InitObjectivesEnvironment();

            return (string)DriverProvider.Current().ExecuteScript(script);
        }

        private static void WaitForDataContextLoaded()
        {
            bool isDataContextLoaded = false;
            int i = 0;
            do
            {
                i++;
                System.Threading.Thread.Sleep(100);
                isDataContextLoaded = (bool)DriverProvider.Current().ExecuteScript("return document.getElementById('content')!==null");
                if (i > 50)
                    throw new TimeoutException("Content data is not reachable");

            } while (!isDataContextLoaded);
        }
        private static void AddTestScriptsToHtml(string scripts)
        {
            var text = String.Format("var head = document.getElementsByTagName('head')[0];var s = document.createElement('script');var t=document.createTextNode(\"{0}\");s.setAttribute('type','text/javascript');s.appendChild(t);head.appendChild(s);", scripts);
            DriverProvider.Current().ExecuteScript(text);
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
