namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public interface IUserCollaborationBroadcaster
    {
        dynamic AllUserCollaborators(string userEmail);
    }
}