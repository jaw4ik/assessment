﻿using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class ObjectiveObjectMother
    {
        private const string Title = "Objective title";
        private const string CreatedBy = "easygenerator@easygenerator.com";

        public static Objective CreateWithTitle(string title)
        {
            return Create(title: title);
        }

        public static Objective Create(string title = Title, string createdBy = CreatedBy)
        {
            return new Objective(title, createdBy);
        }
    }
}
