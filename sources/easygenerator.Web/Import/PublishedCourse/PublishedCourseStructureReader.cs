using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.Import.PublishedCourse
{
    public class PublishedCourseStructureReader
    {
        public virtual IEnumerable<Guid> GetObjectives(JObject dataFile)
        {
            return dataFile["objectives"]
                .Values<string>("id")
                .Select(Guid.Parse)
                .AsEnumerable();
        }

        public virtual IEnumerable<Guid> GetQuestions(Guid objectiveId, JObject dataFile)
        {
            return dataFile["objectives"]
                .Where(o => o.Value<string>("id") == objectiveId.ToString("N").ToLower())
                .Values("questions")
                .SelectMany(q => q.Values<string>("id"))
                .Select(Guid.Parse)
                .AsEnumerable();
        }

        public virtual IEnumerable<Guid> GetLearningContents(Guid questionId, JObject dataFile)
        {
            return dataFile["objectives"]
                .Values("questions").Children()
                .Where(q => q.Value<string>("id") == questionId.ToString("N").ToLower())
                .Values("learningContents")
                .SelectMany(a => a.Values<string>("id"))
                .Select(Guid.Parse)
                .AsEnumerable();
        }

        public virtual IEnumerable<Guid> GetAnswers(Guid questionId, JObject dataFile)
        {
            return dataFile["objectives"]
                .Values("questions").Children()
                .Where(q => q.Value<string>("id") == questionId.ToString("N").ToLower())
                .Values("answers")
                .SelectMany(a => a.Values<string>("id"))
                .Select(Guid.Parse)
                .AsEnumerable();
        }

    }
}