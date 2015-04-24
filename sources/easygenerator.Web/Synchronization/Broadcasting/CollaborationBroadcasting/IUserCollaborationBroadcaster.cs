namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public interface IUserCollaborationBroadcaster : IBroadcaster
    {
        dynamic OtherCollaborators(string userEmail);
        dynamic OtherCollaboratorsOnOwnedCourses(string userEmail);
    }
}