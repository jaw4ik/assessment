using System;

namespace easygenerator.PublicationServer.Models
{
    public class Publication
    {
        public Guid Id { get; set; }
        public DateTime PublishedBy { get; set; }
        public DateTime PublishedOn { get; set; }
        public bool IsSearchable { get; set; }
        public Guid? SearchId { get; set; }
    }
}
