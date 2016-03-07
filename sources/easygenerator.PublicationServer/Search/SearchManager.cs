using System;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Models;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.Search
{
    public class SearchManager
    {
        private readonly IUserRepository _userRepository;

        public SearchManager(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public virtual bool AllowedToBeIndexed(Publication publication)
        {
            if (publication == null)
                return false;

            var owner = _userRepository.Get(publication.OwnerEmail);
            return owner != null && owner.AccessType == Constants.Search.SearchableAccessType
                   && (DateTimeWrapper.Now() - owner.ModifiedOn) > TimeSpan.FromDays(Constants.Search.SearchableAccessTypeMinDaysPeriod);
        }
    }
}
