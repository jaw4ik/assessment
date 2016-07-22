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

        internal static CourseTemplateSettings Create(Course course, Template template, string settings, string extraData, Theme theme = null)
        {
            return new CourseTemplateSettings(CreatedBy)
            {
                Course = course,
                Template = template,
                Settings = settings,
                ExtraData = extraData,
                Theme = theme
            };
        }
    }
}
