using System;
using System.Linq;
using System.IO;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class ImageFile : Entity
    {
        private static readonly string[] ImageFileExtensions = { ".gif", ".jpeg", ".jpg", ".png", ".bmp" };

        protected internal ImageFile() { }

        protected internal ImageFile(string title, string createdBy)
            : base(createdBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
            ThrowIfNotImage(title);
            
            Title = title;
        }

        public virtual string Title { get; private set; }

        public virtual string FileName => Id.ToString() + Path.GetExtension(Title);

        private static void ThrowIfNotImage(string title)
        {
            var extension = Path.GetExtension(title);
            if(!ImageFileExtensions.Contains(extension?.ToLower()))
                throw new ArgumentException($"{extension} is not valid image file extension", nameof(title));
        }
    }
}
