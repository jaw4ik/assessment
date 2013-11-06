using easygenerator.AcceptanceTests;
using easygenerator.AcceptanceTests.Steps;
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
        public void AddTestUserToDatabase()
        {
            using (var entities = new Entities())
            {
                var user = new User()
                {
                    Id = new Guid("FFCDCF89-0BF4-47CF-8CE5-C8B6CAFF8C43"),
                    Email = "vr.danylchuk@ism-ukraine.com",
                    //password - Easy123!
                    PasswordHash = "41e9d2260d35618daa20020fd7217872",
                    CreatedBy = "vr.danylchuk@ism-ukraine.com",
                    CreatedOn = DateTime.Now,
                    ModifiedBy = "vr.danylchuk@ism-ukraine.com",
                    ModifiedOn = DateTime.Now,
                    Country = "not defined",
                    Phone = "not defined",
                    FullName = "easygenerator user",
                    Organization = "not defined"
                };
                entities.Users.Add(user);
                entities.SaveChanges();
            }
        }
           
        //const string dataContextFilePath = @"easygenerator.Web\data.js";

        public void AddObjectivesToDatabase(Objective[] objectives)
        {
            using (var entities = new Entities())
            {
                foreach (var obj in entities.Objectives)
                {
                    entities.Objectives.Remove(obj);
                }

                foreach (var obj in objectives)
                {
                    entities.Objectives.Add(obj);
                }
                entities.SaveChanges();
            }
            //UpdateDataContext((dataContext) =>
            //{
            //    dataContext.Objectives.Clear();
            //    foreach (var obj in objectives)
            //    {
            //        dataContext.Objectives.Add(obj);
            //    }
            //});
        }

        public void AddObjectivesToExperiance(string expTitle, Objective[] objectives)
        {
            using (var entities = new Entities())
            {
                var exp = entities.Experiences.First(item => item.Title == expTitle);
                exp.Objectives.Clear();

                foreach (var obj in objectives)
                {
                    exp.Objectives.Add(entities.Objectives.First(item => item.Id == obj.Id));
                }
                entities.SaveChanges();
            }

            //UpdateDataContext((dataContext) =>
            //{
            //    var experience = dataContext.Experiences.First(obj => obj.Title == expTitle);
            //    experience.Objectives.Clear();
            //    //dataContext.Objectives.Clear();
            //    foreach (var objective in objectives)
            //    {
            //        experience.Objectives.Add(objective.Id);
            //        //dataContext.Objectives.Add(objective);
            //    }
            //});
        }

        public void AddPublicationsToDatabase(Experience[] experiences)
        {
            using (var entities = new Entities())
            {
                var template_id = entities.Templates.First(tmpl => tmpl.Name == "Freestyle learning").Id;
                foreach (var exp in entities.Experiences)
                {
                    entities.Experiences.Remove(exp);
                }

                foreach (var exp in experiences)
                {
                    exp.Template_Id = template_id;
                    entities.Experiences.Add(exp);
                }
                entities.SaveChanges();
            }

            //UpdateDataContext((dataContext) =>
            //{
            //    dataContext.Experiences.Clear();
            //    foreach (var obj in experiences)
            //    {
            //        dataContext.Experiences.Add(obj);
            //    }
            //});
        }
        public void AddQuestionsToDatabase(string objTitle, Question[] questions)
        {
            using (var entities = new Entities())
            {
                var objective = entities.Objectives.First(obj => obj.Title == objTitle);
                
                foreach (var quest in entities.Questions.Where(item => item.Objective_Id == objective.Id))
                {                    
                    entities.Questions.Remove(quest);
                }

                foreach (var quest in questions)
                {
                    quest.Objective_Id = objective.Id;
                    entities.Questions.Add(quest);
                }
                entities.SaveChanges();

            }

            //UpdateDataContext((dataContext) =>
            //{
            //    var objective = dataContext.Objectives.First(obj => obj.Title == objTitle);
            //    objective.Questions.Clear();
            //    foreach (var question in questions)
            //    {
            //        objective.Questions.Add(question);
            //    }
            //});
        }
        public void AddAnswerOptionsToDatabase(string objTitle, string questionTitle, Answer[] answers)
        {
            using (var entities = new Entities())
            {
                var objective = entities.Objectives.First(obj => obj.Title == objTitle);
                var question = entities.Questions.Where(item => item.Objective_Id == objective.Id).First(q => q.Title == questionTitle);

                foreach (var answer in entities.Answers.Where(item => item.Question_Id == question.Id))
                {
                    entities.Answers.Remove(answer);
                }

                foreach (var answer in answers)
                {
                    answer.Question_Id = question.Id;
                    entities.Answers.Add(answer);
                }
                entities.SaveChanges();
            }

            //UpdateDataContext((dataContext) =>
            //{
            //    var objective = dataContext.Objectives.First(obj => obj.Title == objTitle);
            //    var question = objective.Questions.First(quest => quest.Title == questionTitle);
            //    question.AnswerOptions.Clear();
            //    foreach (var answer in answers)
            //    {
            //        question.AnswerOptions.Add(answer);
            //    }
            //});
        }

        public void AddExplanationsToDatabase(string objTitle, string questionTitle, LearningContent[] explanations)
        {
            using (var entities = new Entities())
            {
                var objective = entities.Objectives.First(obj => obj.Title == objTitle);
                var question = entities.Questions.Where(item => item.Objective_Id == objective.Id).First(q => q.Title == questionTitle);

                foreach (var expl in entities.LearningContents.Where(item => item.Question_Id == question.Id))
                {
                    entities.LearningContents.Remove(expl);
                }

                foreach (var expl in explanations)
                {
                    expl.Question_Id = question.Id;
                    entities.LearningContents.Add(expl);
                }
                entities.SaveChanges();
            }

            //UpdateDataContext((dataContext) =>
            //{
            //    var objective = dataContext.Objectives.First(obj => obj.Title == objTitle);
            //    var question = objective.Questions.First(quest => quest.Title == questionTitle);
            //    question.Explanations.Clear();
            //    foreach (var explanation in explanations)
            //    {
            //        question.Explanations.Add(explanation);
            //    }
            //});
        }

        public void ClearDataContext()
        {
            using (var entities = new Entities())
            {
                entities.Database.ExecuteSqlCommand("DELETE FROM LearningContents");
                entities.Database.ExecuteSqlCommand("DELETE FROM Answers");
                entities.Database.ExecuteSqlCommand("DELETE FROM Questions");
                entities.Database.ExecuteSqlCommand("DELETE FROM Objectives");
                entities.Database.ExecuteSqlCommand("DELETE FROM ExperienceObjectives");
                entities.Database.ExecuteSqlCommand("DELETE FROM Experiences");
                entities.Database.ExecuteSqlCommand("DELETE FROM Users");
                AddTestUserToDatabase();
            }

            

            //UpdateDataContext((dataContext) =>
            //{
            //    dataContext.Objectives.Clear();
            //    dataContext.Experiences.Clear();
            //});

        }

        //private void UpdateDataContext(Action<Root> update)
        //{
        //    var dataContextString = FsHelper.Read(dataContextFilePath);
        //    var dataContext = JsonConvert.DeserializeObject<Root>(dataContextString);
        //    update(dataContext);
        //    FsHelper.Write(dataContextFilePath, JsonConvert.SerializeObject(dataContext));
        //}
    
    }

}
