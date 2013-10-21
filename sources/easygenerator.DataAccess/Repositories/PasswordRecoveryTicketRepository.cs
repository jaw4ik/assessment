﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class PasswordRecoveryTicketRepository : Repository<PasswordRecoveryTicket>, IPasswordRecoveryTicketRepository
    {
        public PasswordRecoveryTicketRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }
    }
}
