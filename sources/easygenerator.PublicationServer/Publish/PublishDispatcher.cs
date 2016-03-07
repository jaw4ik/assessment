using System;
using System.Collections.Generic;

namespace easygenerator.PublicationServer.Publish
{
    public class PublishDispatcher : IPublishDispatcher
    {
        private HashSet<Guid> _courseIdsThatArePublishing = new HashSet<Guid>();
        private object _locker = new object();

        public void StartPublish(Guid courseId)
        {
            ValidateCourseId(courseId);

            if (!_courseIdsThatArePublishing.Contains(courseId))
            {
                lock (_locker)
                {
                    if (!_courseIdsThatArePublishing.Contains(courseId))
                    {
                        _courseIdsThatArePublishing.Add(courseId);
                    }
                }
            }
        }

        public void EndPublish(Guid courseId)
        {
            ValidateCourseId(courseId);

            lock (_locker)
            {
                _courseIdsThatArePublishing.RemoveWhere(_ => _.Equals(courseId));
            }
        }

        public bool IsPublishing(Guid courseId)
        {
            ValidateCourseId(courseId);

            lock (_locker)
            {
                return _courseIdsThatArePublishing.Contains(courseId);
            }
        }

        private void ValidateCourseId(Guid courseId)
        {
            if (courseId.Equals(Guid.Empty))
            {
                throw new ArgumentException("Course Id cannot be empty or white space.", nameof(courseId));
            }
        }
    }
}