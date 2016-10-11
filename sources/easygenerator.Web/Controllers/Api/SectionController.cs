using System;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class SectionController : DefaultApiController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly ISectionRepository _repository;
        private readonly IEntityMapper _entityMapper;
        private readonly IUrlHelperWrapper _urlHelper;


        public SectionController(ISectionRepository repository, IEntityFactory entityFactory, IEntityMapper entityMapper, IUrlHelperWrapper urlHelper)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
            _urlHelper = urlHelper;
        }

        [HttpPost]
        [Route("api/sections")]
        public ActionResult GetCollection()
        {
            var sections = _repository.GetAvailableSectionsCollection(User.Identity.Name);
            
            return JsonSuccess(sections.Select(e => _entityMapper.Map(e)));
        }

        [HttpPost]
        [Route("api/section/create")]
        public ActionResult Create(string title)
        {
            var section = _entityFactory.Section(title, GetCurrentUsername());

            _repository.Add(section);

            return JsonSuccess(new
            {
                Id = section.Id.ToNString(),
                ImageUrl = String.IsNullOrEmpty(section.ImageUrl)
                    ? _urlHelper.ToAbsoluteUrl(Constants.Section.DefaultImageUrl)
                    : section.ImageUrl,
                CreatedOn = section.CreatedOn,
                CreatedBy = section.CreatedBy
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Section))]
        [Route("api/section/updatetitle")]
        public ActionResult UpdateTitle(Section section, string title)
        {
            if (section == null)
            {
                return JsonLocalizableError(Errors.SectionNotFoundError, Errors.SectionNotFoundResourceKey);
            }

            section.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess(new { });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Section))]
        [Route("api/section/updatelearningobjective")]
        public ActionResult UpdateLearningObjective(Section section, string learningObjective)
        {
            if (section == null)
            {
                return JsonLocalizableError(Errors.SectionNotFoundError, Errors.SectionNotFoundResourceKey);
            }

            section.UpdateLearningObjective(learningObjective, GetCurrentUsername());

            return JsonSuccess(new { });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Section))]
        [Route("api/section/updateimage")]
        public ActionResult UpdateImage(Section section, string imageUrl)
        {
            if (section == null)
            {
                return JsonLocalizableError(Errors.SectionNotFoundError, Errors.SectionNotFoundResourceKey);
            }

            section.UpdateImageUrl(imageUrl, GetCurrentUsername());

            return JsonSuccess(new { });
        }

        [HttpPost]
        [EntityOwner(typeof(Section))]
        [Route("api/section/delete")]
        public ActionResult Delete(Section section)
        {
            if (section != null)
            {
                if (section.Courses.Any())
                {
                    return JsonLocalizableError(Errors.SectionCannotBeDeleted, Errors.SectionCannotBeDeletedResourceKey);
                }

                foreach (Question question in section.Questions)
                {
                    section.RemoveQuestion(question, GetCurrentUsername());
                }

                _repository.Remove(section);
            }

            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(Section))]
        [Route("api/section/updatequestionsorder")]
        public ActionResult UpdateQuestionsOrder(Section section, ICollection<Question> questions)
        {
            if (section == null)
            {
                return HttpNotFound(Errors.SectionNotFoundError);
            }

            section.UpdateQuestionsOrder(questions, GetCurrentUsername());

            return JsonSuccess(new { });
        }

        [HttpPost]
        [EntityOwner(typeof(Section))]
        [Route("api/section/permanentlydelete")]
        public ActionResult PermanentlyDeleteSection(Section section)
        {
            if (section == null)
            {
                return HttpNotFound(Errors.SectionNotFoundError);
            }

            foreach (var course in section.Courses)
            {
                course.UnrelateSection(section, GetCurrentUsername());
            }

            foreach (var question in section.Questions)
            {
                section.RemoveQuestion(question, GetCurrentUsername());
            }

            _repository.Remove(section);

            return JsonSuccess();
        }
    }
}