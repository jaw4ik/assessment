using System;

namespace easygenerator.StorageServer.Models.Entities
{
    public class Video : Entity
    {
        protected internal Video() { }

        public string VimeoId { get; protected set; }
        public string Title { get; protected set; }
        public long Size { get; protected set; }
        public Guid UserId { get; protected set; }

        public Video(string title, long size, Guid userId)
        {
            Title = title;
            Size = size;
            UserId = userId;
        }

        public void SetVimeoId(string vimeoId)
        {
            VimeoId = vimeoId;
        }
    }
}