using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class HotSpotPolygonMapper : IEntityModelMapper<HotSpotPolygon>
    {
        public dynamic Map(HotSpotPolygon entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Points = entity.Points,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}