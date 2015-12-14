using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.Models.Entities
{
    public class Audio : Entity
    {
        protected internal Audio() { }

        public string VimeoId { get; protected set; }
        public string Title { get; protected set; }
        public double Duration { get; set; }
        public long Size { get; protected set; }
        public Guid UserId { get; protected set; }

        public AudioStatus Status { get; set; }
        public string Source { get; protected set; }

        public Audio(string title, double duration, long size, string source, Guid userId)
        {
            Title = title;
            Duration = duration;
            Size = size;
            UserId = userId;
            Source = source;
            Status = AudioStatus.NotAvailable;
        }

        public void SetVimeoId(string vimeoId)
        {
            VimeoId = vimeoId;
        }

        public void MarkAsAvailable()
        {
            Status = AudioStatus.Available;
        }
    }

    public enum AudioStatus
    {
        NotAvailable = 0,
        Available = 1
    }
}