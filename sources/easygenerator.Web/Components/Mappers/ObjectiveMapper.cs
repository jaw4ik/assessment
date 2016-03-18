using System;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class SectionEntityModelMapper : IEntityModelMapper<Section>
    {
        private readonly IEntityModelMapper<Question> _questionEntityModelMapper;
        private readonly IUrlHelperWrapper _urlHelper;

        public SectionEntityModelMapper(IEntityModelMapper<Question> questionEntityModelMapper, IUrlHelperWrapper urlHelper)
        {
            _questionEntityModelMapper = questionEntityModelMapper;
            _urlHelper = urlHelper;
        }

        public dynamic Map(Section obj)
        {
            return new
            {
                Id = obj.Id.ToNString(),
                Title = obj.Title,
                ImageUrl = String.IsNullOrEmpty(obj.ImageUrl)
                    ? _urlHelper.ToAbsoluteUrl(Constants.Section.DefaultImageUrl)
                    : obj.ImageUrl,
                LearningObjective = obj.LearningObjective,
                CreatedBy = obj.CreatedBy,
                CreatedOn = obj.CreatedOn,
                ModifiedOn = obj.ModifiedOn,
                Questions = obj.Questions.Select(q => _questionEntityModelMapper.Map(q))
            };
        }
    }
}