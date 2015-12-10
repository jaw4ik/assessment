using System;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
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
        public ActionResult Create(Course course, string text, string createdByName, string createdBy)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var comment = _entityFactory.Comment(text, createdByName, createdBy);
            course.AddComment(comment);

            return JsonSuccess(true);
        }

        [HttpPost]
        [EntityCollaborator(typeof(Course))]
        [Route("api/comment/restore")]
        public ActionResult Restore(Course course, string text, string createdByName, string createdBy, DateTime createdOn)
        {
            if (course == null)
            {
                return HttpNotFound(Errors.CourseNotFoundError);
            }

            var comment = _entityFactory.Comment(text, createdByName, createdBy, createdOn.ToUniversalTime());
            course.AddComment(comment);

            return JsonSuccess(true);
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

            var comments = course.Comments.OrderByDescending(i => i.CreatedOn).Select(i => new
            {
                Id = i.Id.ToNString(),
                Text = i.Text,
                CreatedBy = i.CreatedBy,
                CreatedByName = i.CreatedByName,
                CreatedOn = i.CreatedOn
            });

            return JsonSuccess(new { Comments = comments });
        }
    }
}