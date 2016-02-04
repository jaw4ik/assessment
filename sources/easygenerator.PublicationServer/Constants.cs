using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer
{
    public static class Constants
    {
        public const string PublicPublicationsPath = "public";

        public static class Search
        {
            public const AccessType SearchableAccessType = AccessType.Free;
            public const int SearchableAccessTypeMinDaysPeriod = 14;
        }
    }
}
