using System;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class CommentController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IEntityMapper _entityMapper;

        public CommentController(IEntityFactory entityFactory, IEntityMapper entityMapper)
        {
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateInput(false)]
        [Route("api/comment/create")]
        public ActionResult Create(Course course, string text, string createdByName, string createdBy, string context)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var comment = _entityFactory.Comment(text, createdByName, createdBy, context);
            course.AddComment(comment);

            return JsonSuccess(true);
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/comment/restore")]
        public ActionResult Restore(Course course, string text, string createdByName, string createdBy, string context, DateTime createdOn)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var comment = _entityFactory.Comment(text, createdByName, createdBy, context, createdOn.ToUniversalTime());
            course.AddComment(comment);

            return JsonSuccess(comment.Id.ToNString());
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/comment/delete")]
        public ActionResult Delete(Course course, Comment comment)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }
            if (comment == null)
            {
                return JsonSuccess(true);
            }

            course.DeleteComment(comment);

            return JsonSuccess(true);
        }

        [HttpPost, StarterAccess(ErrorMessageResourceKey = Errors.UpgradeToStarterPlanToUseCommentsErrorMessage)]
        [Route("api/comments")]
        public ActionResult GetComments(Course course)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            return JsonSuccess(new { Comments = course.Comments.Select(comment => _entityMapper.Map(comment)) });
        }
    }
}