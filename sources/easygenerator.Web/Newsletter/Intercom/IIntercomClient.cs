namespace easygenerator.Web.Newsletter.Intercom
{
    public interface IIntercomClient
    {
        IntercomDotNet.IntercomClient Client { get; }
    }
}