using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Web;
using Elmah;
using System.Diagnostics;

namespace easygenerator.Web.Publish
{
    public class PublishDispatcher : IPublishDispatcher
    {
        private HashSet<string> _experienceIdsThatArePublishing = new HashSet<string>();
        private object _locker = new object();

        public void StartPublish(string experienceId)
        {
            ValidateExperienceId(experienceId);
            
            if (!_experienceIdsThatArePublishing.Contains(experienceId))
            {
                lock (_locker)
                {
                    if (!_experienceIdsThatArePublishing.Contains(experienceId))
                    {
                        _experienceIdsThatArePublishing.Add(experienceId);
                    }
                }
            }
        }

        public void EndPublish(string experienceId)
        {
            ValidateExperienceId(experienceId);

            lock (_locker)
            {
                _experienceIdsThatArePublishing.RemoveWhere(_ => string.Equals(_, experienceId, StringComparison.CurrentCultureIgnoreCase));
            }
        }

        public bool IsPublishing(string experienceId)
        {
            ValidateExperienceId(experienceId);

            lock (_locker)
            {
                return _experienceIdsThatArePublishing.Contains(experienceId);
            }
        }

        private void ValidateExperienceId(string experienceId)
        {
            if (experienceId == null)
                throw new ArgumentNullException("experienceId", "Experience Id cannot be null.");

            if (string.IsNullOrWhiteSpace(experienceId))
                throw new ArgumentException("Experience Id cannot be empty or white space.", "experienceId");
        }
    }
}