using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    internal static class ExperienceTemplateSettingsObjectMother
    {
        private const string CreatedBy = "username@easygenerator.com";

        internal static Experience.ExperienceTemplateSettings Create(Experience experience, Template template, string settings)
        {
            return new Experience.ExperienceTemplateSettings(CreatedBy)
            {
                Experience = experience,
                Template = template,
                Settings = settings
            };
        }
    }
}
