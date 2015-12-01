using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using easygenerator.StorageServer.Models;
using easygenerator.StorageServer.Models.Entities;

namespace easygenerator.StorageServer.Components.Dispatchers
{
    public class VimeoUploadDispatcher : IVimeoUploadDispatcher, IDisposable
    {
        private HashSet<VimeoUploadModel> _videoUploads = new HashSet<VimeoUploadModel>();
        private object _locker = new object();
        protected Timer _autoRemoveTimer;

        private const double _uploadLifetime = 120000;
        private const double _cleanInterval = 120000;

        public VimeoUploadDispatcher()
        {
            _autoRemoveTimer = new Timer();

            _autoRemoveTimer.Interval = _cleanInterval;
            _autoRemoveTimer.Elapsed += (o, e) => CleanUploadings();
            _autoRemoveTimer.Start();
        }


        public void Dispose()
        {
            _autoRemoveTimer.Stop();
        }

        private void CleanUploadings()
        {
            var till = DateTime.Now.AddMilliseconds(-_uploadLifetime);
            _videoUploads.RemoveWhere(_ => _.LastModification < till);
        }

        public VimeoUploadModel GetUploading(Guid videoId)
        {
            return _videoUploads.SingleOrDefault(_ => _.Video.Id == videoId);
        }

        public IEnumerable<VimeoUploadModel> GetUserUploadings(Guid userId)
        {
            return _videoUploads.Where(_ => _.Video.UserId == userId);
        }

        public void StartUploading(VimeoUploadTicketModel ticket, Video video)
        {
            if (_videoUploads.All(_ => _.Video.Id != video.Id))
            {
                lock (_locker)
                {
                    if (_videoUploads.All(_ => _.Video.Id != video.Id))
                    {
                        var videoUpload = new VimeoUploadModel() { Ticket = ticket, Video = video, LastModification = DateTime.Now };
                        _videoUploads.Add(videoUpload);
                    }
                }
            }
        }

        public void EndUploading(Guid videoId)
        {
            lock (_locker)
            {
                _videoUploads.RemoveWhere(_ => _.Video.Id == videoId);
            }
        }

        public bool UpdateUploadingLifetime(Guid videoId)
        {
            lock (_locker)
            {
                var videoUpload = _videoUploads.SingleOrDefault(_ => _.Video.Id == videoId);
                if (videoUpload != null)
                {
                    videoUpload.LastModification = DateTime.Now;
                    return true;
                }
                return false;
            }
        }
    }

    public interface IVimeoUploadDispatcher
    {
        VimeoUploadModel GetUploading(Guid videoId);
        IEnumerable<VimeoUploadModel> GetUserUploadings(Guid userId);
        void StartUploading(VimeoUploadTicketModel ticket, Video video);
        void EndUploading(Guid videoId);
        bool UpdateUploadingLifetime(Guid videoId);
    }
}