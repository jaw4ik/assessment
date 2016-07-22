using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;

namespace easygenerator.Web.Controllers.Api
{
    public class CourseTemplateSettingsController : DefaultApiController
    {
        private readonly IEntityMapper _entityMapper;
        private readonly IThemeRepository _themeRepository;
        private readonly IDomainEventPublisher _eventPublisher;

        public CourseTemplateSettingsController(IEntityMapper entityMapper, IThemeRepository themeRepository, IDomainEventPublisher eventPublisher)
        {
            _entityMapper = entityMapper;
            _themeRepository = themeRepository;
            _eventPublisher = eventPublisher;
        }

        [Scope("settings", "api")]
        [EntityCollaborator(typeof(Course))]
        [ActionName("TemplateSettings"), HttpGet]
        [Route("api/course/{courseId}/template/{templateId}")]
        public ActionResult GetTemplateSettings(Course course, Template template)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            var courseTemplateTheme = course.GetTemplateTheme(template);
            return Json(new
            {
                settings = course.GetTemplateSettings(template),
                extraData = course.GetExtraDataForTemplate(template),
                theme = courseTemplateTheme != null ? _entityMapper.Map(courseTemplateTheme) : null
            },
                JsonRequestBehavior.AllowGet);
        }

        [Scope("settings", "api")]
        [EntityCollaborator(typeof(Course))]
        [ActionName("TemplateSettings"), HttpPost]
        [Route("api/course/{courseId}/template/{templateId}")]
        public ActionResult SaveTemplateSettings(Course course, Template template, string settings, string extraData)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            course.SaveTemplateSettings(template, settings, extraData);

            return Json(true);
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/{courseId}/template/{templateId}/addtheme")]
        public ActionResult AddTheme(Course course, Template template, Theme theme)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            if (theme == null)
            {
                return HttpNotFound(Errors.ThemeNotFoundError);
            }

            course.AddTemplateTheme(template, theme);
            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/course/{courseId}/template/{templateId}/removetheme")]
        public ActionResult RemoveTheme(Course course, Template template)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            var settings = _themeRepository.GetCourseTemplateSettingsWithTheme(course.Id, template.Id);
            if (settings != null)
            {
                settings.Theme = null;
                _eventPublisher.Publish(new CourseTemplateSettingsUpdated(course));
            }
            
            return JsonSuccess();
        }

    }
}