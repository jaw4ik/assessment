using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Entities
{
    public class Template : Entity
    {
        protected internal Template() { }

        public string Name { get; private set; }
        public string PreviewUrl { get; private set; }
        public int Order { get; private set; }
        public int IsNew { get; private set; }
        public bool IsCustom { get; private set; }

        protected internal ICollection<Course> Courses { get; set; }

        protected internal Template(string name, string createdBy)
            : base(createdBy)
        {
            ThrowIfNameIsInvalid(name);

            Name = name;
        }

        protected internal Template(string name, string previewUrl, string createdBy)
            : this(name, createdBy)
        {
            PreviewUrl = previewUrl;
        }

        private void ThrowIfNameIsInvalid(string name)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, "name");
        }
    }
}
