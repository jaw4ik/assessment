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

        protected internal Comment(string createdBy, string text)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);
            Text = text;
        }

        public Course Course { get; protected internal set; }
        public string Text { get; protected internal set; }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(text, "text");
        }
    }
}
