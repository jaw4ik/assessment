using System;
using System.Collections.Generic;
using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.DataAccess
{
    public interface IPublicationRepository
    {
        Publication Get(Guid publicationId);
        void Add(Publication publication);
        void Update(Publication publication);
        int GetPublicationsCountForUsersWithAccessType(AccessType accessType, int accessTypeMinDaysPeriod);
        ICollection<Publication> GetPublicationsForUsersWithAccessType(AccessType accessType, int accessTypeMinDaysPeriod, int take, int skip);
        Publication GetBySearchId(Guid searchId);
    }
}
