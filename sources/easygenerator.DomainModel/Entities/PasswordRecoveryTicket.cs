using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities
{
    public class PasswordRecoveryTicket : Entity
    {
        public virtual User User { get; internal set; }
    }
}
