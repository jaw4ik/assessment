﻿using easygenerator.AcceptanceTests.Steps;
using OpenQA.Selenium.Remote;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace easygenerator.AcceptanceTests.Helpers
{
    public class DataSetter
    {
        const string dataContextFilePath = @"easygenerator.Web\data.js";

        public void AddObjectivesToDatabase(Objective[] objectives)
        {
            UpdateDataContext((dataContext) =>
            {
                dataContext.Objectives.Clear();
                foreach (var obj in objectives)
                {
                    dataContext.Objectives.Add(obj);
                }
            });
        }

        public void AddObjectivesToDatabase(string expTitle, Objective[] objectives)
        {
            UpdateDataContext((dataContext) =>
            {
                var experience = dataContext.Experiences.First(obj => obj.Title == expTitle);
                experience.Objectives.Clear();
                dataContext.Objectives.Clear();
                foreach (var objective in objectives)
                {
                    experience.Objectives.Add(objective.Id);
                    dataContext.Objectives.Add(objective);
                }
            });
        }

        public void AddPublicationsToDatabase(Experience[] experiences)
        {
            UpdateDataContext((dataContext) =>
            {
                dataContext.Experiences.Clear();
                foreach (var obj in experiences)
                {
                    dataContext.Experiences.Add(obj);
                }
            });
        }
        public void AddQuestionsToDatabase(string objTitle, Question[] questions)
        {
            UpdateDataContext((dataContext) =>
            {
                var objective = dataContext.Objectives.First(obj => obj.Title == objTitle);
                objective.Questions.Clear();
                foreach (var question in questions)
                {
                    objective.Questions.Add(question);
                }
            });
        }
        public void AddAnswerOptionsToDatabase(string objTitle, string questionTitle, AnswerOption[] answers)
        {
            UpdateDataContext((dataContext) =>
            {
                var objective = dataContext.Objectives.First(obj => obj.Title == objTitle);
                var question = objective.Questions.First(quest => quest.Title == questionTitle);
                question.AnswerOptions.Clear();
                foreach (var answer in answers)
                {
                    question.AnswerOptions.Add(answer);
                }
            });
        }

        public void AddExplanationsToDatabase(string objTitle, string questionTitle, Explanation[] explanations)
        {
            UpdateDataContext((dataContext) =>
            {
                var objective = dataContext.Objectives.First(obj => obj.Title == objTitle);
                var question = objective.Questions.First(quest => quest.Title == questionTitle);
                question.Explanations.Clear();
                foreach (var explanation in explanations)
                {
                    question.Explanations.Add(explanation);
                }
            });
        }

        private void UpdateDataContext(Action<Root> update)
        {
            var dataContextString = FsHelper.Read(dataContextFilePath);
            var dataContext = JsonConvert.DeserializeObject<Root>(dataContextString);
            update(dataContext);
            FsHelper.Write(dataContextFilePath, JsonConvert.SerializeObject(dataContext));
        }
    }
}
