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

        protected internal Objective(string title)
        {
            ThrowIfTitleIsInvalid(title);
            Title = title;
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;
            MarkAsModified();
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }
    }
}
