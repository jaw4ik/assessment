using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ImageFileObjectMother
    {
        private const string Title = "title.png";
        private const string Author = "user@easygenerator.com";

        public static ImageFile Create(string title = Title, string createdBy = Author)
        {
            return new ImageFile(title, createdBy);
        }

        public static ImageFile CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static ImageFile CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }
    }
}
