using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.DataAccess
{
    public interface IUnitOfWork
    {
        void Save();
    }
}