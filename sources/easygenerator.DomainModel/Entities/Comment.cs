using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Comment : Entity
    {
        protected internal Comment() { }

        protected internal Comment(string createdByName, string createdBy, string text)
            : base(createdBy)
        {
            CreateComment(createdByName, text);
        }

        protected internal Comment(string createdByName, string createdBy, string text, DateTime createdOn)
            : base(createdBy, createdOn)
        {
            CreateComment(createdByName, text);
        }

        private void CreateComment(string createdByName, string text)
        {
            ThrowIfNameIsInvalid(createdByName);
            ThrowIfTextIsInvalid(text);
            
            CreatedByName = createdByName;
            Text = text;
        }

        public Course Course { get; protected internal set; }
        public string CreatedByName { get; protected internal set; }
        public string Text { get; protected internal set; }
        
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
