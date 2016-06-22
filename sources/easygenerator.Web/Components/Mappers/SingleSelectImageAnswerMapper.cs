﻿using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class SingleSelectImageAnswerMapper : EntityModelMapper<SingleSelectImageAnswer>
    {
        public override dynamic Map(SingleSelectImageAnswer entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Image = entity.Image,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}