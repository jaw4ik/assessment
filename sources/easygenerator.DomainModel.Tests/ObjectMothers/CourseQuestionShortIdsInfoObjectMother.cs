using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    internal static class CourseQuestionShortIdsInfoObjectMother
    {
        private const string ShortIds = "{}";
        internal static CourseQuestionShortIdsInfo Create(Course course, string questionShortIds = ShortIds)
        {
            return new CourseQuestionShortIdsInfo(course, questionShortIds);
        }
    }
}
