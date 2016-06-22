using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class DocumentMapper : EntityModelMapper<Document>
    {
        public override dynamic Map(Document entity)
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