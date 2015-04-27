using System;
using System.Collections.Generic;

namespace easygenerator.PublicationServer.Publish
{
    public class PublishDispatcher : IPublishDispatcher
    {
        private HashSet<string> _courseIdsThatArePublishing = new HashSet<string>();
        private object _locker = new object();

        public void StartPublish(string courseId)
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

        public void EndPublish(string courseId)
        {
            ValidateCourseId(courseId);

            lock (_locker)
            {
                _courseIdsThatArePublishing.RemoveWhere(_ => string.Equals(_, courseId, StringComparison.CurrentCultureIgnoreCase));
            }
        }

        public bool IsPublishing(string courseId)
        {
            ValidateCourseId(courseId);

            lock (_locker)
            {
                return _courseIdsThatArePublishing.Contains(courseId);
            }
        }

        private void ValidateCourseId(string courseId)
        {
            if (courseId == null)
                throw new ArgumentNullException("courseId", "Course Id cannot be null.");

            if (string.IsNullOrWhiteSpace(courseId))
                throw new ArgumentException("Course Id cannot be empty or white space.", "courseId");
        }
    }
}