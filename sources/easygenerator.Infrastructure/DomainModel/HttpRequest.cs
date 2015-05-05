using System;

namespace easygenerator.Infrastructure.DomainModel
{
    public class HttpRequest
    {
        public Guid Id { get; private set; }
        public string Url { get; private set; }
        public string Verb { get; private set; }
        public string Content { get; private set; }
        public string ServiceName { get; private set; }
        public int SendAttempts { get; private set; }
        public bool ReportOnFailure { get; private set; }
        public DateTime CreatedOn { get; private set; }

        protected internal HttpRequest()
        {
            Id = Guid.NewGuid();
            CreatedOn = DateTimeWrapper.Now();
        }

        protected internal HttpRequest(string url, string verb, string content, string serviceName)
            : this()
        {
            ArgumentValidation.ThrowIfNullOrEmpty(url, "url");
            ArgumentValidation.ThrowIfNullOrEmpty(verb, "verb");
            ArgumentValidation.ThrowIfNullOrEmpty(content, "content");
            ArgumentValidation.ThrowIfNullOrEmpty(serviceName, "serviceName");

            Url = url;
            Verb = verb;
            Content = content;
            ServiceName = serviceName;
        }

        protected internal HttpRequest(string url, string verb, string content, string serviceName, bool reportOnFailure)
            : this(url, verb, content, serviceName)
        {
            ReportOnFailure = reportOnFailure;
        }

        public virtual void IncreaseSendAttempt()
        {
            SendAttempts++;
        }
    }
}
