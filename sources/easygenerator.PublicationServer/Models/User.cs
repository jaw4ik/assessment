using System;

namespace easygenerator.PublicationServer.Models
{
    public class User
    {
        public string Email { get; set; }
        public DateTime ModifiedOn { get; set; }
        public enum AccessType
        {
            Free = 0,
            Starter = 1,
            Plus = 2,
            Academy = 3,
            Trial = 100
        }
    }
}
