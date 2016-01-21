using System;

namespace easygenerator.PublicationServer.Publish
{
    public interface IPublishDispatcher
    {
        void StartPublish(Guid courseId);
        void EndPublish(Guid courseId);
        bool IsPublishing(Guid courseId);
    }
}