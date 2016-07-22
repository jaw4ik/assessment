using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Mappers;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ThemeEvents;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class ThemeController : DefaultApiController
    {
        private readonly IEntityMapper _entityMapper;
        private readonly IThemeRepository _themeRepository;
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public ThemeController(IEntityMapper entityMapper, IThemeRepository themeRepository, IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _entityMapper = entityMapper;
            _themeRepository = themeRepository;
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
        }

        [HttpPost]
        [Scope("api")]
        [Route("api/template/themes")]
        public ActionResult GetCollection(Template template)
        {
            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            var themes = _themeRepository.GetCollectionByTemplate(template, GetCurrentUsername());

            return JsonSuccess(themes.Select(c => _entityMapper.Map(c)));
        }

        [HttpPost]
        [Scope("api")]
        [Route("api/template/theme/add")]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToSaveThemes)]
        public ActionResult Add(Template template, string name, string settings)
        {
            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            var theme = _entityFactory.Theme(template, name, settings, GetCurrentUsername());
            _themeRepository.Add(theme);
            _eventPublisher.Publish(new ThemeAddedEvent(theme));

            return JsonSuccess(_entityMapper.Map(theme));
        }

        [HttpPost]
        [Scope("api")]
        [Route("api/template/theme/update")]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToSaveThemes)]
        public ActionResult Update(Theme theme, string settings)
        {
            if (theme == null)
            {
                return HttpNotFound(Errors.ThemeNotFoundError);
            }

            theme.Update(settings, GetCurrentUsername());

            return JsonSuccess(_entityMapper.Map(theme));
        }


        [HttpPost]
        [Scope("api")]
        [Route("api/template/theme/delete")]
        public ActionResult DeleteTheme(Theme theme)
        {
            if (theme != null)
            {
                var courseSettings = _themeRepository.GetAllCourseTemplateSettingsByTheme(theme);
                courseSettings.ForEach(item => item.Theme = null);
                _themeRepository.Remove(theme);

                _eventPublisher.Publish(new ThemeDeletedEvent(theme, courseSettings));
            }

            return JsonSuccess();
        }
    }
}