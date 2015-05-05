using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish
{
    public interface ICoursePublisher
    {
        bool Publish(Course course);
    }
}