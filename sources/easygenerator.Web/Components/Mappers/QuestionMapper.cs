using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class QuestionMapper : IEntityMapper<Question>
    {
        public dynamic Map(Question entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Title = entity.Title,
                Content = entity.Content,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn,
                Type = entity.Type
            };
        }
    }
}