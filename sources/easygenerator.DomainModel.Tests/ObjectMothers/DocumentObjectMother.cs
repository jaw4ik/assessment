using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class DocumentObjectMother
    {
        private const string Title = "Document title";
        private const string EmbedCode = "<iframe></iframe>";
        private const DocumentType DocumentType = DomainModel.Entities.DocumentType.PowerPoint;
        private const string CreatedBy = "username@easygenerator.com";

        public static Document CreateWithTitle(string title)
        {
            return Create(title);
        }

        public static Document CreateWithCreatedBy(string createdBy)
        {
            return Create(createdBy: createdBy);
        }

        public static Document CreateWithEmbedCOde(string embedCode)
        {
            return Create(embedCode: embedCode);
        }

        public static Document CreateWithType(DocumentType type)
        {
            return Create(documentType: type);
        }

        public static Document Create(string title = Title, string embedCode = EmbedCode, DocumentType documentType = DocumentType, string createdBy = CreatedBy)
        {
            return new Document(title, embedCode, documentType, createdBy);
        }
    }
}
