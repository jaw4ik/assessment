using System;

namespace easygenerator.PublicationServer.Models
{
    public class Publication
    {
        protected Publication() { }

        public Publication(Guid id, string ownerEmail, string publicPath)
        {
            if (id.Equals(Guid.Empty))
            {
                throw new ArgumentException("Publication id cannot be empty", nameof(id));
            }

            if (string.IsNullOrWhiteSpace(ownerEmail))
            {
                throw new ArgumentException("Owner email cannot be empty or white space", nameof(ownerEmail));
            }

            if (string.IsNullOrWhiteSpace(publicPath))
            {
                throw new ArgumentException("Public path cannot be empty or white space", nameof(publicPath));
            }

            Id = id;
            OwnerEmail = ownerEmail;
            PublicPath = publicPath;
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
        public string PublicPath { get; private set; }
    }
}
