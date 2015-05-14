using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    internal static class CourseTemplateSettingsObjectMother
    {
        private const string CreatedBy = "username@easygenerator.com";

        internal static Course.CourseTemplateSettings Create(Course course, Template template, string settings, string extraData)
        {
            return new Course.CourseTemplateSettings(CreatedBy)
            {
                Course = course,
                Template = template,
                Settings = settings,
                ExtraData = extraData
            };
        }
    }
}
