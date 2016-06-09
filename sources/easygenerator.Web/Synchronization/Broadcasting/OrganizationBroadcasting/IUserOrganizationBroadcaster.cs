namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public interface IUserOrganizationBroadcaster : IBroadcaster
    {
        dynamic OrganizationAdmins(string userEmail);
    }
}