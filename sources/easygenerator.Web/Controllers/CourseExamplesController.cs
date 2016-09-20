using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Services.Description;
using DocumentFormat.OpenXml;
using WebGrease.Css.Extensions;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.CourseExamples;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Domain.DomainOperations;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    public class CourseExamplesController : DefaultApiController
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly ICourseRepository _courseRepository;

        public CourseExamplesController(ConfigurationReader configurationReader, ICourseRepository courseRepository)
        {
            _configurationReader = configurationReader;
            _courseRepository = courseRepository;
        }

        [HttpPost]
        [Route("api/examples/courses")]
        public ActionResult GetCollection()
        {
            var results = new List<object>();
            foreach (var element in _configurationReader.CourseExamplesConfiguration.Courses)
            {
                Guid courseId;
                if (!Guid.TryParse(element.Id, out courseId)) continue;

                var course = _courseRepository.Get(courseId);
                if (course != null)
                {
                    results.Add(new
                    {
                        id = course.Id,
                        title = course.Title,
                        imageUrl = element.ImageUrl,
                        category = element.Category
                    });
                }
            }
            return JsonSuccess(results);
        }
    }
}