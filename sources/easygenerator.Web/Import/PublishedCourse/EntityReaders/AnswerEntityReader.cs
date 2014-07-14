using System;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities.Questions;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.Import.PublishedCourse.EntityReaders
{
    public class AnswerEntityReader
    {
        public AnswerEntityReader(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        private readonly IEntityFactory _entityFactory;

        public virtual Answer ReadAnswer(Guid answerId, string createdBy, JObject courseData)
        {
            var answer = courseData["objectives"]
                .Values("questions")
                .Children()
                .Values("answers")
                .Children()
                .Single(a => a.Value<string>("id") == answerId.ToString("N").ToLower());

            var answerText = answer.Value<string>("text");
            var answerCorrectness = answer.Value<bool>("isCorrect");
            var answerGroup = Guid.Parse(answer.Value<string>("group"));

            return _entityFactory.Answer(answerText, answerCorrectness, answerGroup, createdBy);
        }

        public virtual Dropspot ReadDropspot(Guid dropspotId, string createdBy, JObject courseData)
        {
            var answer = courseData["objectives"]
                .Values("questions")
                .Children()
                .Values("dropspots")
                .Children()
                .Single(a => a.Value<string>("id") == dropspotId.ToString("N").ToLower());

            var text = answer.Value<string>("text");
            var x = answer.Value<int>("x");
            var y = answer.Value<int>("y");

            return _entityFactory.Dropspot(text, x, y, createdBy);
        }

    }
}