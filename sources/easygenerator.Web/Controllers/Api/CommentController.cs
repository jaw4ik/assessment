using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
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
                CreatedOn = i.CreatedOn
            });

            return JsonSuccess(new { Comments = comments });
        }
    }
}