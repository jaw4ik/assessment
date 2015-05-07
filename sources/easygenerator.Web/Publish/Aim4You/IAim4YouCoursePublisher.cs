using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish.Aim4You
{
    public interface IAim4YouCoursePublisher
    {
        bool PublishCourse(string userEmail, Course course, string domain);
    }
}
