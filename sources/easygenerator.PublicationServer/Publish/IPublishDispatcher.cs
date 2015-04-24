namespace easygenerator.PublicationServer.Publish
{
    public interface IPublishDispatcher
    {
        void StartPublish(string courseId);
        void EndPublish(string courseId);
        bool IsPublishing(string courseId);
    }
}