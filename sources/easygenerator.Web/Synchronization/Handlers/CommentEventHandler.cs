using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CommentEvents;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CommentEventHandler :
        IDomainEventHandler<CommentDeletedEvent>
    {
        private readonly ICollaborationBroadcaster<Course> _broadcaster;
        

        public CommentEventHandler(ICollaborationBroadcaster<Course> broadcaster)
        {
            _broadcaster = broadcaster;
        }

        public void Handle(CommentDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .commentDeleted(args.Course.Id.ToNString(), args.Comment.Id.ToNString());
        }
    }
}