using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CommentMapper : IEntityModelMapper<Comment>
    {
        public dynamic Map(Comment entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Text = entity.Text,
                CreatedByName = entity.CreatedByName,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}