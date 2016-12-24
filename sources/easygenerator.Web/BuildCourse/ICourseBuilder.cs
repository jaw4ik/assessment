using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildCourse
{
    public interface ICourseBuilder
    {
        bool Build(Course course, string publishMode, bool includeMedia = false, bool enableAccessLimitation = false);
    }
}
