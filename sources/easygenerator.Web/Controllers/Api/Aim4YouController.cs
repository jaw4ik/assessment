﻿using System.Threading;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Publish.Aim4You;
using easygenerator.Web.Extensions;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class Aim4YouController : DefaultController
    {
        private readonly IAim4YouApiService _aim4YouService;
        private readonly IAim4YouCoursePublisher _aim4YouPublisher;

        public Aim4YouController(IAim4YouApiService aim4YouService, IAim4YouCoursePublisher aim4YouPublisher)
        {
            _aim4YouService = aim4YouService;
            _aim4YouPublisher = aim4YouPublisher;
        }

        [HttpPost]
        [Route("api/aim4you/registerUser")]
        public ActionResult RegisterUser()
        {
            if (_aim4YouService.RegisterUser(GetCurrentUsername(), GetCurrentDomain()))
            {
                return JsonSuccess(true);
            }
            return JsonLocalizableError(Errors.CoursePublishActionFailedError, Errors.CoursePublishActionFailedResourceKey);
        }

        [HttpPost]
        [Route("api/aim4you/publish")]
        public ActionResult Publish(Course course)
        {
            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            var result = _aim4YouPublisher.PublishCourse(GetCurrentUsername(), course);

            if (!result)
            {
                return JsonLocalizableError(Errors.CoursePublishActionFailedError, Errors.CoursePublishActionFailedResourceKey);
            }

            return JsonSuccess(true);
        }
    }
}
