
using System;

namespace easygenerator.PublicationServer.Publish
{
    public interface ICoursePublisher
    {
        bool PublishCourse(Guid courseId);
    }
}
