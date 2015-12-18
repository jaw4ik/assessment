using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CommentEvents
{
    public abstract class CommentEvent : Event
    {
        public Comment Comment { get; private set; }

        protected CommentEvent(Comment comment)
        {
            ThrowIfCommentIsInvalid(comment);
            Comment = comment;
        }

        private void ThrowIfCommentIsInvalid(Comment comment)
        {
            ArgumentValidation.ThrowIfNull(comment, "comment");
        }
    }
}
