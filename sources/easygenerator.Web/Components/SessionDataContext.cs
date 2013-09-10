using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using easygenerator.DataAccess;
using easygenerator.DomainModel.Entities;
using Microsoft.Ajax.Utilities;

namespace easygenerator.Web.Components
{
    public class SessionDataContext : IDataContext
    {
        private readonly HttpSessionState _session;

        public SessionDataContext()
        {
            _session = HttpContext.Current.Session;
        }


        public ICollection<Objective> Objectives
        {
            get
            {
                if (_session["objectives"] is Collection<Objective> == false)
                {
                    _session["objectives"] = new Collection<Objective>();
                }

                return _session["objectives"] as Collection<Objective>;
            }
        }

        public ICollection<Experience> Experiences
        {
            get
            {
                if (_session["experiences"] is Collection<Experience> == false)
                {
                    _session["experiences"] = new Collection<Experience>();
                }

                return _session["experiences"] as Collection<Experience>;
            }
        }

        public void Save()
        {

        }
    }
}