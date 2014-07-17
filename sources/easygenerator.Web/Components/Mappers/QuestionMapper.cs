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

        static int GetQuestionType(Question question)
        {
            if (question is FillInTheBlanks)
            {
                return 1;
            }

            if (question is SingleSelectText)
            {
                return 3;
            }

            if (question is Multipleselect)
            {
                return 0;
            }
            
            if (question is DragAndDropText)
            {
                return 2;
            }

            if (question is TextMatching)
            {
                return 6;
            }

            throw new NotSupportedException();
        }
    }
}