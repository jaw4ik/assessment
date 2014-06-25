﻿using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;

namespace easygenerator.Web.Import.PublishedCourse.EntityReaders
{
    public class QuestionEntityReader
    {
        public QuestionEntityReader(ImportContentReader importContentReader, IEntityFactory entityFactory)
        {
            _importContentReader = importContentReader;
            _entityFactory = entityFactory;
        }

        private readonly ImportContentReader _importContentReader;
        private readonly IEntityFactory _entityFactory;

        public virtual Multipleselect ReadQuestion(Guid questionId, string publishedPackagePath, string createdBy, JObject courseData)
        {
            var question = courseData["objectives"]
                .Values("questions")
                .Children()
                .Single(q => q.Value<string>("id") == questionId.ToString("N").ToLower());

            var title = question.Value<string>("title");

            Multipleselect questionEntity = _entityFactory.MultipleselectQuestion(title, createdBy);

            var hasContent = question.Value<bool>("hasContent");
            questionEntity.UpdateContent(hasContent ? ReadQuestionContent(questionId, publishedPackagePath, courseData) : String.Empty, createdBy);

            return questionEntity;
        }

        private string ReadQuestionContent(Guid questionId, string publishedPackagePath, JObject courseData)
        {
            var objective = courseData["objectives"]
                    .Single(o => o["questions"]
                        .Any(q => q.Value<string>("id") == questionId.ToString("N").ToLower()));

            var objectiveId = Guid.Parse(objective.Value<string>("id"));
            var contentPath = Path.Combine(publishedPackagePath, "content", objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower(), "content.html");

            return _importContentReader.ReadContent(contentPath);
        }

    }
}