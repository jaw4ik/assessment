//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace easygenerator.AcceptanceTests
{
    using System;
    using System.Collections.Generic;
    
    public partial class Objective
    {
        public Objective()
        {
            this.Questions = new HashSet<Question>();
            this.Experiences = new HashSet<Experience>();
        }
    
        public System.Guid Id { get; set; }
        public string Title { get; set; }
        public string CreatedBy { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public System.DateTime ModifiedOn { get; set; }
    
        public virtual ICollection<Question> Questions { get; set; }
        public virtual ICollection<Experience> Experiences { get; set; }
    }
}
