using System;
using easygenerator.StorageServer.Models.Entities;

namespace easygenerator.StorageServer.Models.AuthIdentify
{
    public class TaskModel
    {
        public bool Success  { get; set; }
        public DataModel Data { get; set; }
    }

    public class DataModel
    {
        public string Email { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Role { get; set; }

        public SubscriptionModel Subscription { get; set; }
    }

    public class SubscriptionModel
    {
        public AccessType AccessType { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}