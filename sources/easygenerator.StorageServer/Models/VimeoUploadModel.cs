using System;
using easygenerator.StorageServer.Models.Entities;

namespace easygenerator.StorageServer.Models
{
    public class VimeoUploadModel
    {
        public VimeoUploadTicketModel Ticket { get; set; }
        public Video Video { get; set; }
        public DateTime LastModification { get; set; }
    }
}