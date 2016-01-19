using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;
using System.Linq;

namespace easygenerator.Web.Components.Mappers
{
    public class DocumentMapper : IEntityModelMapper<Document>
    {
        public dynamic Map(Document entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Title = entity.Title,
                EmbedCode = entity.EmbedCode,
                DocumentType = entity.DocumentType,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}