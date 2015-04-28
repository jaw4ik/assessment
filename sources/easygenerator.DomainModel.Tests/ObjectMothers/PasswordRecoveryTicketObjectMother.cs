using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class PasswordRecoveryTicketObjectMother
    {
        public static PasswordRecoveryTicket Create()
        {
            return new PasswordRecoveryTicket();
        }
    }
}
