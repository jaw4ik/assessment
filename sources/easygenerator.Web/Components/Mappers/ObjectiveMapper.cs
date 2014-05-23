using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class ObjectiveMapper : IEntityMapper<Objective>
    {
        public dynamic Map(Objective obj)
        {
            return new
            {
                Id = obj.Id.ToNString(),
                Title = obj.Title,
                CreatedBy = obj.CreatedBy,
                CreatedOn = obj.CreatedOn,
                ModifiedOn = obj.ModifiedOn,
                Questions = obj.Questions.Select(q => new
                {
                    Id = q.Id.ToNString(),
                    Title = q.Title,
                    Content = q.Content,
                    CreatedOn = q.CreatedOn,
                    CreatedBy = q.CreatedBy,
                    ModifiedOn = q.ModifiedOn,
                    Type = q.Type
                })
            };
        }
    }
}