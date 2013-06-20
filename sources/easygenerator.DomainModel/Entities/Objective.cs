using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Objective : Entity
    {
        protected internal Objective() { }

        public Objective(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            Title = title;
        }

        public string Title { get; private set; }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }
    }
}
