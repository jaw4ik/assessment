using System.Collections.ObjectModel;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class DragAndDropText : Question
    {
        public DragAndDropText() { }

        public DragAndDropText(string title, string createdBy)
            : base(title, createdBy)
        {
            Dropspots = new Collection<Dropspot>();
        }

        public string Background { get; set; }
        public Collection<Dropspot> Dropspots { get; set; }
    }
}
