using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class RankingtextAnswerMapper : IEntityModelMapper<RankingTextAnswer>
    {
        public dynamic Map(RankingTextAnswer entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Text = entity.Text,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}