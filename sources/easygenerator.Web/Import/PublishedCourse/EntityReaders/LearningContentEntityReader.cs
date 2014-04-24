using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;

namespace easygenerator.Web.Import.PublishedCourse.EntityReaders
{
    public class LearningContentEntityReader
    {
        public LearningContentEntityReader(ImportContentReader importContentReader, IEntityFactory entityFactory)
        {
            _importContentReader = importContentReader;
            _entityFactory = entityFactory;
        }

        private readonly ImportContentReader _importContentReader;
        private readonly IEntityFactory _entityFactory;

        public virtual LearningContent ReadLearningContent(Guid learningContentId, string publishedPackagePath, string createdBy, JObject courseData)
        {
            var question = courseData["objectives"]
               .Values("questions")
               .Children()
               .Single(q =>
                   q["learningContents"].Any(lc =>
                       lc.Value<string>("id") == learningContentId.ToString("N").ToLower()));

            var objective = courseData["objectives"]
                .Single(o =>
                    o["questions"].Any(q =>
                        q["learningContents"].Any(lc =>
                            lc.Value<string>("id") == learningContentId.ToString("N").ToLower())));


            var objectiveId = Guid.Parse(objective.Value<string>("id"));
            var questionId = Guid.Parse(question.Value<string>("id"));

            var learningContentPath = Path.Combine(publishedPackagePath, "content", objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower(), learningContentId.ToString("N").ToLower() + ".html");

            var learningContentText = _importContentReader.ReadContent(learningContentPath);

            return _entityFactory.LearningContent(learningContentText, createdBy);
        }

    }
}