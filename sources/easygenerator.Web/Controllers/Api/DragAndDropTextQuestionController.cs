using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using Newtonsoft.Json;

namespace easygenerator.Web.Controllers.Api
{
    public class DragAndDropTextQuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public DragAndDropTextQuestionController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
        }

        [HttpPost]
        [Route("api/question/create/type/2")]
        public ActionResult CreateDragAndDrop(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.DragAndDropTextQuestion(title, GetCurrentUsername());


            objective.AddQuestion(question, GetCurrentUsername());
            _eventPublisher.Publish(new QuestionCreatedEvent(question));

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [Route("api/question/draganddrop")]
        public ActionResult GetQuestionContent(Question question)
        {
            return JsonSuccess(new
            {
                content = question.Content
            });
        }

        [Route("api/question/draganddrop/dropspot/create")]
        public ActionResult CreateDropspot(Question question, string text)
        {
            var content = GetContent(question);

            var dropspot = new Dropspot(text);
            content.dropspots.Add(dropspot);

            question.UpdateContent(JsonConvert.SerializeObject(content), GetCurrentUsername());

            return JsonSuccess(dropspot.id.ToNString());
        }

        [Route("api/question/draganddrop/dropspot/delete")]
        public ActionResult DeleteDropspot(Question question, Guid id)
        {
            var content = GetContent(question);


            content.dropspots.RemoveAll(d => d.id == id);

            question.UpdateContent(JsonConvert.SerializeObject(content), GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/dropspot/updateText")]
        public ActionResult ChangeDropspotText(Question question, Guid id, string text)
        {
            var content = GetContent(question);

            var dropspot = content.dropspots.SingleOrDefault(d => d.id == id);
            if (dropspot != null)
            {
                dropspot.text = text;
            }

            question.UpdateContent(JsonConvert.SerializeObject(content), GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/dropspot/updatePosition")]
        public ActionResult ChangeDropspotPosition(Question question, Guid id, int x, int y)
        {
            var content = GetContent(question);

            var dropspot = content.dropspots.SingleOrDefault(d => d.id == id);
            if (dropspot != null)
            {
                dropspot.x = x;
                dropspot.y = y;
            }

            question.UpdateContent(JsonConvert.SerializeObject(content), GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/background/update")]
        public ActionResult ChangeBackground(Question question, string background)
        {
            var content = GetContent(question);
            content.background = background;

            question.UpdateContent(JsonConvert.SerializeObject(content), GetCurrentUsername());

            return JsonSuccess();
        }

        private DragAndDrop GetContent(Question question)
        {
            var content = question.Content;
            if (String.IsNullOrWhiteSpace(content))
            {
                return new DragAndDrop();
            }

            try
            {
                return JsonConvert.DeserializeObject<DragAndDrop>(content);
            }
            catch (Exception)
            {
                return new DragAndDrop();
            }
        }

        class DragAndDrop
        {
            public DragAndDrop()
            {
                dropspots = new List<Dropspot>();
            }
            public string background { get; set; }
            public List<Dropspot> dropspots { get; set; }
        }

        class Dropspot
        {
            public Dropspot(string text)
            {
                id = Guid.NewGuid();
                this.text = text;
            }

            public Guid id { get; set; }
            public int x { get; set; }
            public int y { get; set; }
            public string text { get; set; }
        }
    }
}