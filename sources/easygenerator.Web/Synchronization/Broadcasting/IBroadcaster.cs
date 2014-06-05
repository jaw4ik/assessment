using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Broadcasting
{
    public interface IBroadcaster
    {
        dynamic User(string username);
        dynamic Users(List<string> users);
    }
}