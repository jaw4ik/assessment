using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class TextMatchingAnswerMapper : IEntityModelMapper<TextMatchingAnswer>
    {
        public dynamic Map(TextMatchingAnswer entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Key = entity.Key,
                Value = entity.Value,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}