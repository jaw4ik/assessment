﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [AllowAnonymous]
    public class CommentController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public CommentController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [Route("api/comment/create")]
        public ActionResult Create(Course course, string text)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var comment = _entityFactory.Comment(text, GetCurrentUsername());
            course.AddComment(comment);

            return JsonSuccess(true);
        }
    }
}