using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class QuestionEntityModelMapper : IEntityModelMapper<Question>
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
                Type = GetQuestionType(entity)
            };
        }

        int GetQuestionType(Question question)
        {
            var type = question.GetType();

            if (type.Namespace == "System.Data.Entity.DynamicProxies")
            {
                type = type.BaseType;
            }


            if (type == typeof(Multipleselect))
            {
                return 0;
            }
            if (type == typeof(FillInTheBlanks))
            {
                return 1;
            }
            if (type == typeof(DragAndDropText))
            {
                return 2;
            }
            if (type == typeof(Multiplechoice))
            {
                return 3;
            }

            throw new NotSupportedException();
        }
    }
}