using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;
using System.Linq;

namespace easygenerator.Web.Components.Mappers
{
    public class LearningPathMapper : IEntityModelMapper<LearningPath>
    {
        private readonly IUrlHelperWrapper _urlHelper;

        public LearningPathMapper(IUrlHelperWrapper urlHelper)
        {
            _urlHelper = urlHelper;
        }

        public dynamic Map(LearningPath entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Title = entity.Title,
                PackageUrl = entity.PackageUrl,
                PublicationUrl = _urlHelper.AddCurrentSchemeToUrl(entity.PublicationUrl),
                IsPublishedToExternalLms = entity.IsPublishedToExternalLms,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn,
                Entities = entity.Entities.Select(e => new
                {
                    Id = e.Id.ToNString()
                })
            };
        }
    }
}