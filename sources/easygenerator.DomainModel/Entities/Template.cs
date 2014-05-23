using System.Collections.Generic;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Template : Entity
    {
        protected internal Template() { }

        public string Name { get; private set; }
        public string Image { get; private set; }
        public string Description { get; private set; }
        public string PreviewUrl { get; private set; }
        public int Order { get; private set; }

        protected internal ICollection<Course> Courses { get; set; }

        protected internal Template(string name, string image, string description, string createdBy)
            : base(createdBy)
        {
            ThrowIfNameIsInvalid(name);
            ThrowIfImageIsInvalid(image);
            ThrowIfDescriptionIsInvalid(description);

            Name = name;
            Image = image;
            Description = description;
        }

        protected internal Template(string name, string image, string description, string previewUrl, string createdBy)
            : this(name, image, description, createdBy)
        {
            PreviewUrl = previewUrl;
        }

        private void ThrowIfNameIsInvalid(string name)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, "name");
        }

        private void ThrowIfImageIsInvalid(string image)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(image, "image");
        }

        private void ThrowIfDescriptionIsInvalid(string description)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(description, "description");
        }
    }
}
