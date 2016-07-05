using System;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class CourseSaleInfo
    {
        public CourseSaleInfo()
        {
        }

        public CourseSaleInfo(Course course, DateTime? publishedOn = null, string documentId = null, bool isProcessing = false)
        {
            ArgumentValidation.ThrowIfNull(course, nameof(course));

            Course_Id = course.Id;
            Course = course;
            PublishedOn = publishedOn;
            DocumentId = documentId;
            IsProcessing = isProcessing;
        }

        public Guid Course_Id { get; private set; }
        public DateTime? PublishedOn { get; protected internal set; }
        public string DocumentId { get; protected internal set; }
        public bool IsProcessing { get; protected internal set; }

        public virtual Course Course { get; set; }
    }
}
