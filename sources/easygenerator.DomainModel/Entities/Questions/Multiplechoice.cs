namespace easygenerator.DomainModel.Entities.Questions
{
    public class Multiplechoice : Multipleselect
    {
        public Multiplechoice() { }

        public Multiplechoice(string title, string createdBy)
            : base(title, createdBy)
        {
        }
    }
}
