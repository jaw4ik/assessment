using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.ThemeEvents
{
    public class ThemeDeletedEvent : ThemeEvent
    {
        public IEnumerable<CourseTemplateSettings> ChangedCourseSettings { get; private set; }

        public ThemeDeletedEvent(Theme theme, IEnumerable<CourseTemplateSettings> changedCourseSettings)
            :base(theme)
        {
            ChangedCourseSettings = changedCourseSettings;
        }
    }
}
