﻿using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Permissions;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class ObjectiveController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IObjectiveRepository _repository;
        private readonly IEntityMapper _entityMapper;
        private readonly IEntityPermissionsChecker<Objective> _permissionChecker;
        private readonly IDomainEventPublisher _eventPublisher;


        public ObjectiveController(IObjectiveRepository repository, 
            IEntityFactory entityFactory, 
            IEntityMapper entityMapper,
            IEntityPermissionsChecker<Objective> permissionChecker, 
            IDomainEventPublisher eventPublisher)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
            _permissionChecker = permissionChecker;
            _eventPublisher = eventPublisher;
        }

        [HttpPost]
        [Route("api/objectives")]
        public ActionResult GetCollection()
        {
            var objectives = _repository.GetCollection(obj => _permissionChecker.HasCollaboratorPermissions(User.Identity.Name, obj));

            return JsonSuccess(objectives.Select(e => _entityMapper.Map(e)));
        }

        [HttpPost]
        [Route("api/objective/create")]
        public ActionResult Create(string title)
        {
            var objective = _entityFactory.Objective(title, GetCurrentUsername());

            _repository.Add(objective);

            return JsonSuccess(new
            {
                Id = objective.Id.ToNString(),
                CreatedOn = objective.CreatedOn,
                CreatedBy = objective.CreatedBy
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/objective/update")]
        public ActionResult Update(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            objective.UpdateTitle(title, GetCurrentUsername());
            _eventPublisher.Publish(new ObjectiveTitleUpdatedEvent(objective));

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        [EntityOwner(typeof(Objective))]
        [Route("api/objective/delete")]
        public ActionResult Delete(Objective objective)
        {
            if (objective != null)
            {
                if (objective.Courses.Any() || objective.Questions.Any())
                {
                    return JsonLocalizableError(Errors.ObjectiveCannotBeDeleted,
                                                Errors.ObjectiveCannotBeDeletedResourceKey);
                }
                _repository.Remove(objective);
            }

            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/objective/updatequestionsorder")]
        public ActionResult UpdateQuestionsOrder(Objective objective, ICollection<Question> questions)
        {
            if (objective == null)
            {
                return HttpNotFound(Errors.ObjectiveNotFoundError);
            }

            objective.UpdateQuestionsOrder(questions, GetCurrentUsername());
            _eventPublisher.Publish(new QuestionsReorderedEvent(objective));
            
            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }
    }
}