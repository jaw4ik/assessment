using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class SurveyQuestionObjectMother
    {
        private const string Title = "Question title";
        private const string CreatedBy = "username@easygenerator.com";
        private const bool IsSurvey = false;

        public static SurveyQuestion CreateWithTitle(string title)
        {
            return Create(title: title);
        }
        public static SurveyQuestion CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static SurveyQuestion CreateWithIsSurvey(bool isSurvey)
        {
            return Create(isSurvey: isSurvey);
        }

        public static SurveyQuestion Create(string title = Title, string createdBy = CreatedBy, bool isSurvey = IsSurvey)
        {
            return new SurveyQuestion(title, createdBy, isSurvey);
        }
    }
}
