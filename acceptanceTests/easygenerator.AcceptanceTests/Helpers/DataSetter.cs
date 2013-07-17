﻿using easygenerator.AcceptanceTests.Steps;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.Helpers
{
    public class DataSetter
    {
        public void AddObjectivesToDatabase(ObjectiveData[] objectives)
        {
            foreach (var obj in objectives)
            {
                if (obj.Id == null) obj.Id = "0";
                ExcecuteTestScript("test.AddNewObjective('{0}','{1}')", obj.Id, obj.Title);
            }
            RebuildView();
        }
        public void AddPublicationsToDatabase(PublicationData[] publications)
        {
            foreach (var pub in publications)
            {
                if (pub.Id == null) pub.Id = "0";
                ExcecuteTestScript("test.AddNewPublication('{0}','{1}')", pub.Id, pub.Title);
            }
        }
        public void AddQuestionsToDatabase(string objTitle, QuestionData[] questions)
        {
            foreach (var quest in questions)
            {
                if (quest.Id == null) quest.Id = "0";
                ExcecuteTestScript("test.AddQuestionsToObjective('{0}','{1}','{2}')", objTitle, quest.Id, quest.Title);
            }
        }
        public void AddAnswerOptionsToDatabase(string objTitle, string questionTitle, AnswerData[] answers)
        {
            foreach (var answer in answers)
            {
                if (String.IsNullOrEmpty(answer.Text)) answer.Text = "NoTitle";
                ExcecuteTestScript("test.AddAnswerOptionsToQuestion('{0}','{1}','{2}',{3})", objTitle, questionTitle, answer.Text, answer.IsCorrect.ToString());
            }
        }

        public void AddExplanationsToDatabase(string objTitle, string questionTitle, ExplanationData[] explanations)
        {
            foreach (var expl in explanations)
            {
                if (String.IsNullOrEmpty(expl.ToString())) expl.Explanation = "NoTitle";
                ExcecuteTestScript("test.AddExplanationsToQuestion('{0}','{1}','{2}')", objTitle, questionTitle, expl.Explanation);
            }
        }

        public void EmptyAnswerOptionsOfQuestion(string objTitle, string questionTitle)
        {
            ExcecuteTestScript("test.EmptyAnswerOptionsOfQuestion('{0}','{1}')", objTitle, questionTitle);
            RebuildView();
        }

        public void EmptyExplanationsOfQuestion(string objTitle, string questionTitle)
        {
            ExcecuteTestScript("test.EmptyExplanationsOfQuestion('{0}','{1}')", objTitle, questionTitle);
            RebuildView();
        }

        public void EmptyQuestionsListOfObjective(string objTitle)
        {
            ExcecuteTestScript("test.EmptyQuestionsOfObjective('{0}')", objTitle);
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
            DriverProvider.Current().Driver.ExecuteScript("test.RebuildObjectivesListView()");
        }
        private void InitObjectivesEnvironment()
        {
            string scripts = DataReader.Read(@"JS\TestScripts.js");
            AddTestScriptsToHtml(scripts);
        }
        private string ExcecuteTestScript(string scriptFormat, params string[] args)
        {
            string script = String.Format(scriptFormat,EscapeJavascriptSpecialSymbols( args));
            bool areScriptsPresent = (bool)DriverProvider.Current().Driver.ExecuteScript("return typeof Test !== 'undefined'");

            WaitForDataContextLoaded();
            if (!areScriptsPresent)
                InitObjectivesEnvironment();

            return (string)DriverProvider.Current().Driver.ExecuteScript(script);
        }
        private string[] EscapeJavascriptSpecialSymbols(string[] values)
        {
            return values.Select(val=>val
                .Replace(@"\", @"\\")
                .Replace("\"", "\\\"")
                .Replace("'",@"\'")).ToArray();
        }
        public static void WaitForDataContextLoaded()
        {
            bool isDataContextLoaded = false;
            int i = 0;
            while (!isDataContextLoaded)
            {
                if (i > 50)
                    throw new TimeoutException("Content data is not reachable");
                Thread.Sleep(200);
                i++;
                isDataContextLoaded = (bool)DriverProvider.Current().Driver.ExecuteScript("return document.getElementById('content')!==null");

            };
        }
        private static void AddTestScriptsToHtml(string scripts)
        {
            var text = String.Format("var head = document.getElementsByTagName('head')[0];var s = document.createElement('script');var t=document.createTextNode(\"{0}\");s.setAttribute('type','text/javascript');s.appendChild(t);head.appendChild(s);", scripts);
            DriverProvider.Current().Driver.ExecuteScript(text);
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
