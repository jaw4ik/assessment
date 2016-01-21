using System;

namespace easygenerator.PublicationServer.Models
{
    public class Publication
    {
        protected Publication() { }

        public Publication(Guid id, string ownerEmail)
        {
            if (id.Equals(Guid.Empty))
            {
                throw new ArgumentException("Publication id cannot be empty", nameof(id));
            }

            if (string.IsNullOrWhiteSpace(ownerEmail))
            {
                throw new ArgumentException("Owner email cannot be empty or white space", nameof(ownerEmail));
            }

            Id = id;
            OwnerEmail = ownerEmail;
            SearchId = Guid.NewGuid();
            CreatedOn = DateTimeWrapper.Now();
            ModifiedOn = DateTimeWrapper.Now();
        }

        public void MarkAsModified()
        {
            ModifiedOn = DateTimeWrapper.Now();
        }

        public Guid Id { get; private set; }
        public string OwnerEmail { get; private set; }
        public DateTime CreatedOn { get; private set; }
        public DateTime ModifiedOn { get; private set; }
        public Guid SearchId { get; private set; }
    }
}
