using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using Newtonsoft.Json;

namespace easygenerator.DomainModel.Entities
{
    public class CourseQuestionShortIdsInfo
    {
        public const string NextAvailableIndex = "next_available_index";
        public CourseQuestionShortIdsInfo()
        {
        }
        public CourseQuestionShortIdsInfo(Course course, string questionShortIds = null)
        {
            ArgumentValidation.ThrowIfNull(course, nameof(course));

            Course_Id = course.Id;
            Course = course;
            QuestionShortIds = questionShortIds;
        }

        public Guid Course_Id { get; private set; }
        public virtual Course Course { get; protected internal set; }

        public string QuestionShortIds { get; private set; }

        public Dictionary<string, int> GetShortIds()
        {
            return QuestionShortIds != null ? JsonConvert.DeserializeObject<Dictionary<string, int>>(QuestionShortIds) : new Dictionary<string, int>();
        }

        public void Refresh()
        {
            var savedShortIds = GetShortIds();
            int index = savedShortIds.ContainsKey(NextAvailableIndex) ? savedShortIds[NextAvailableIndex] : 0;

            var shortIds = Course.RelatedSections.SelectMany(section => section.Questions)
                .Where(question => !(question is IValidatable) || ((IValidatable) question).IsValid())
                .Select(question => question.Id.ToString("N"))
                .ToDictionary(key => key, key => savedShortIds.Keys.Contains(key) ? savedShortIds[key] : index++);

            shortIds.Add(NextAvailableIndex, index);

            QuestionShortIds = JsonConvert.SerializeObject(shortIds);
        }
    }
}
