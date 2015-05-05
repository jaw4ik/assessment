using System;
using System.Linq;
using System.IO;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class ImageFile : Entity
    {
        private static readonly string[] imageFileExtensions = { ".gif", ".jpeg", ".jpg", ".png", ".bmp" };

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

        public virtual string FileName
        {
            get { return Id.ToString() + Path.GetExtension(Title); }
        }

        private static void ThrowIfNotImage(string title)
        {
            var extension = Path.GetExtension(title);
            if(!imageFileExtensions.Contains(extension.ToLower()))
                throw new ArgumentException(String.Format("{0} is not valid image file extension", extension), "title");
        }
    }
}
