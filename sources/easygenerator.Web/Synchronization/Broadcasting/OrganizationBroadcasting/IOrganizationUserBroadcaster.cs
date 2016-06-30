namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public interface IOrganizationUserBroadcaster : IBroadcaster
    {
        dynamic OrganizationAdmins(string userEmail);
    }
}