using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.DomainModel.Validation.Comments;

namespace easygenerator.DomainModel.Entities
{
    public class Comment : Entity
    {
        protected internal Comment() { }

        protected internal Comment(string createdByName, string createdBy, string text, string context)
            : base(createdBy)
        {
            CreateComment(createdByName, text, context);
        }

        protected internal Comment(string createdByName, string createdBy, string text, string context, DateTime createdOn)
            : base(createdBy, createdOn)
        {
            CreateComment(createdByName, text, context);
        }

        private void CreateComment(string createdByName, string text, string context)
        {
            ThrowIfNameIsInvalid(createdByName);
            ThrowIfTextIsInvalid(text);
            CommentContextValidator.ThrowIfInvalid(context);

            CreatedByName = createdByName;
            Text = text;
            Context = context;
        }

        public Course Course { get; protected internal set; }
        public string CreatedByName { get; protected internal set; }
        public string Text { get; protected internal set; }
        public string Context { get; protected internal set; }

        private void ThrowIfNameIsInvalid(string createdByName)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(createdByName, "createdByName");
        }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(text, "text");
        }
    }
}
