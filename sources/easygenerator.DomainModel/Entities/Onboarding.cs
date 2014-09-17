﻿using System;

namespace easygenerator.DomainModel.Entities
{
    public class Onboarding : Identifiable
    {
        public Onboarding() { }

        public Onboarding(bool courseCreated, bool objectiveCreated, bool contentCreated, int createdQuestionsCount, bool coursePublished, bool isClosed, string userEmail)
        {
            CourseCreated = courseCreated;
            ObjectiveCreated = objectiveCreated;
            ContentCreated = contentCreated;
            CreatedQuestionsCount = createdQuestionsCount;
            CoursePublished = coursePublished;
            IsClosed = isClosed;
            UserEmail = userEmail;
        }

        public bool CourseCreated { get; private set; }

        public bool ObjectiveCreated { get; private set; }

        public bool ContentCreated { get; private set; }

        public int CreatedQuestionsCount { get; private set; }

        public bool CoursePublished { get; private set; }

        public bool IsClosed { get; private set; }

        public string UserEmail { get; private set; }

        public virtual void MarkCourseCreatedAsCompleted()
        {
            CourseCreated = true;
        }

        public virtual void MarkObjectiveCreatedAsCompleted()
        {
            ObjectiveCreated = true;
        }

        public virtual void MarkContentCreatedAsCompleted()
        {
            ContentCreated = true;
        }

        public virtual void IncreaseCreatedQuestionsCount()
        {
            CreatedQuestionsCount++;
        }

        public virtual void MarkCoursePublishedAsCompleted()
        {
            CoursePublished = true;
        }

        public virtual void CloseOnboarding()
        {
            IsClosed = true;
        }

    }

    public static class OnboardingRules
    {
        public const int CreatedQuestionsCount = 3;
    }
}