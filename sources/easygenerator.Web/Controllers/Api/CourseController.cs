using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.Components;
using easygenerator.Infrastructure;
using easygenerator.Web.Publish;
using Microsoft.Ajax.Utilities;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class CourseController : DefaultController
    {
        private readonly ICourseBuilder _builder;
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _repository;
        private readonly ICoursePublisher _coursePublisher;

        public CourseController(ICourseBuilder courseBuilder, ICourseRepository repository, IEntityFactory entityFactory, ICoursePublisher coursePublisher)
        {
            _builder = courseBuilder;
            _repository = repository;
            _entityFactory = entityFactory;
            _coursePublisher = coursePublisher;
        }

        [HttpPost]
        public ActionResult Create(string title, Template template)
        {
            var course = _entityFactory.Course(title, template, GetCurrentUsername());

            _repository.Add(course);

            return JsonSuccess(new
            {
                Id = course.Id.ToNString(),
                CreatedOn = course.CreatedOn
            });
        }

        [HttpPost]
        public ActionResult Delete(Course course)
        {
            if (course != null)
            {
                _repository.Remove(course);
            }

            return JsonSuccess();
        }

        [HttpPost]
        public ActionResult Build(Course course)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            var result = _builder.Build(course);

            if (!result)
            {
                return JsonError("Build failed");
            }

            return JsonSuccess(new
                {
                    PackageUrl = course.PackageUrl,
                    BuildOn = course.BuildOn
                });
        }

        [HttpPost]
        public ActionResult Publish(Course course)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            var result = _coursePublisher.Publish(course);

            if (!result)
            {
                return JsonLocalizableError(Errors.CoursePublishFailedError, Errors.CoursePublishFailedResourceKey);
            }

            return JsonSuccess(new
                {
                    PublishedPackageUrl = _coursePublisher.GetPublishedPackageUrl(course.Id.ToString())
                });
        }

        [HttpPost]
        public ActionResult GetCollection()
        {
            var courses = _repository.GetCollection(exp => exp.CreatedBy == User.Identity.Name);

            var result = courses.Select(exp => new
            {
                Id = exp.Id.ToNString(),
                Title = exp.Title,
                CreatedOn = exp.CreatedOn,
                ModifiedOn = exp.ModifiedOn,
                Template = new { Id = exp.Template.Id.ToNString() },
                PackageUrl = exp.PackageUrl,
                PublishedPackageUrl = exp.PublishedOn != null ? _coursePublisher.GetPublishedPackageUrl(exp.Id.ToString()) : null,
                RelatedObjectives = exp.RelatedObjectives.Select(obj => new
                {
                    Id = obj.Id.ToNString()
                })
            });

            return JsonSuccess(result);
        }

        [HttpPost]
        public ActionResult UpdateTitle(Course course, string courseTitle)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            course.UpdateTitle(courseTitle, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = course.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateTemplate(Course course, Template template)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            course.UpdateTemplate(template, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = course.ModifiedOn });
        }

        [HttpPost]
        public ActionResult RelateObjectives(Course course, ICollection<Objective> objectives)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            if (objectives.Count == 0)
            {
                return JsonLocalizableError(Errors.ObjectivesNotFoundError, Errors.ObjectivesNotFoundResourceKey);
            }

            foreach (Objective objective in objectives)
            {
                course.RelateObjective(objective, GetCurrentUsername());
            }

            return JsonSuccess(new
            {
                ModifiedOn = course.ModifiedOn,
                RelatedObjectives = objectives.Select(obj => new
                {
                    Id = obj.Id.ToNString()
                })
            });
        }

        [HttpPost]
        public ActionResult UnrelateObjectives(Course course, ICollection<Objective> objectives)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            if (objectives.Count == 0)
            {
                return JsonLocalizableError(Errors.ObjectivesNotFoundError, Errors.ObjectivesNotFoundResourceKey);
            }

            foreach (Objective objective in objectives)
            {
                course.UnrelateObjective(objective, GetCurrentUsername());
            }

            return JsonSuccess(new
            {
                ModifiedOn = course.ModifiedOn
            });
        }

        [ActionName("TemplateSettings"), HttpGet]
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

            return Json(course.GetTemplateSettings(template), JsonRequestBehavior.AllowGet);
        }

        [ActionName("TemplateSettings"), HttpPost]
        public ActionResult SaveTemplateSettings(Course course, Template template, string settings)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            if (template == null)
            {
                return HttpNotFound(Errors.TemplateNotFoundError);
            }

            course.SaveTemplateSettings(template, settings);

            return Json(true);
        }


    }
}