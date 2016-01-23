using System;
using System.Web.Http;
using easygenerator.PublicationServer.Configuration;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.Controllers
{
    public class SeoController : BaseApiController
    {
        private readonly IPublicationRepository _publicationRepository;
        private readonly IUserRepository _userRepository;
        private readonly ConfigurationReader _configurationReader;

        public SeoController(IPublicationRepository publicationRepository, IUserRepository userRepository, ConfigurationReader configurationReader)
        {
            _publicationRepository = publicationRepository;
            _userRepository = userRepository;
            _configurationReader = configurationReader;
        }

        public IHttpActionResult IndexableContent(Guid courseId)
        {
            return Redirect($"{PublicationServerUri}/{courseId}/{_configurationReader.IndexingContentFolder}/");
        }

        [Route("public/{searchId}")]
        public IHttpActionResult SearchablePublication(Guid searchId)
        {
            var publication = _publicationRepository.GetBySearchId(searchId);
            if (publication != null)
            {
                var owner = _userRepository.Get(publication.OwnerEmail);
                if (owner != null && owner.AccessType == AccessType.Free && DateTimeWrapper.Now() - owner.ModifiedOn > TimeSpan.FromDays(14))
                {
                    return Redirect($"{PublicationServerUri}/{publication.Id}/");
                }
            }

            return Redirect(PageNotFoundUri);
        }


    }
}
