using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Web;
using System.Web.SessionState;
using easygenerator.DataAccess;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components
{
    public class SessionDataContext : IDataContext
    {
        private readonly HttpSessionState _session;

        public SessionDataContext()
        {
            _session = HttpContext.Current.Session;
            SetDataCollectionToSessionIfNotSetYet("templates", new Collection<Template>()
                    {
                        new Template("Default", "/Content/images/defaultTemplate.png"),
                        new Template("Quiz", "/Content/images/quizTemplate.png")
                    });
        }

        public ICollection<Objective> Objectives
        {
            get { return GetDataCollectionFromSession<Objective>("objectives"); }
        }

        public ICollection<Experience> Experiences
        {
            get { return GetDataCollectionFromSession<Experience>("experiences"); }
        }

        public ICollection<Template> Templates
        {
            get { return GetDataCollectionFromSession<Template>("templates"); }
        }

        public ICollection<User> Users
        {
            get { throw new InvalidOperationException(); }
        }

        public void Save()
        {

        }

        private ICollection<T> GetDataCollectionFromSession<T>(string name)
        {
            SetDataCollectionToSessionIfNotSetYet(name, new Collection<T>());
            return _session[name] as ICollection<T>;
        }

        private void SetDataCollectionToSessionIfNotSetYet<T>(string name, ICollection<T> data)
        {
            if (_session[name] is ICollection<T> == false)
            {
                _session[name] = data;
            }
        }
    }
}