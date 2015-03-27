using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseTemplateSettingsUpdated : CourseEvent
    {
        public CourseTemplateSettingsUpdated(Course course)
            : base(course)
        {

        }
    }
}
