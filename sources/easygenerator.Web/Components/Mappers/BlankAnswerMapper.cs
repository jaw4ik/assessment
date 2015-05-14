using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class BlankAnswerMapper : IEntityModelMapper<BlankAnswer>
    {
        public dynamic Map(BlankAnswer answer)
        {
            return new
            {
                Id = answer.Id.ToNString(),
                Text = answer.Text,
                IsCorrect = answer.IsCorrect,
                CreatedOn = answer.CreatedOn,
                GroupId = answer.GroupId.ToNString()
            };
        }
    }
}