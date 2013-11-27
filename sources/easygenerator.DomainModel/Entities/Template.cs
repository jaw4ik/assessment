using System.Collections.Generic;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Template : Entity
    {
        protected internal Template() { }

        public string Name { get; private set; }
        public string Image { get; private set; }

        protected internal ICollection<Experience> Experiences { get; set; }

        protected internal Template(string name, string image, string createdBy)
            : base(createdBy)
        {
            ThrowIfNameIsInvalid(name);
            ThrowIfImageIsInvalid(image);

            Name = name;
            Image = image;
        }

        private void ThrowIfNameIsInvalid(string name)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, "name");
        }

        private void ThrowIfImageIsInvalid(string image)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(image, "image");
        }
    }
}
