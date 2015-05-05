namespace easygenerator.DomainModel.Entities.Questions
{
    public class InformationContent : Question
    {
        protected internal InformationContent() { }
        protected internal InformationContent(string title, string createdBy)
            : base(title, createdBy)
        {
        }
    }
}
