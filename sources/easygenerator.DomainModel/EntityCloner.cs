using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace easygenerator.DomainModel
{
    public class EntityCloner : Cloner
    {
        protected static MethodInfo Guid_NewGuidMethodInfo = typeof(Guid).GetMethod("NewGuid");
        protected static FieldInfo DateTimeWrapper_NowPropertyInfo = typeof(DateTimeWrapper).GetField("Now");

        protected static MethodInfo EntityTypeCloner_UpdateLearningContentsOrderInQuestion =
           typeof(EntityCloner).GetMethod("UpdateLearningContentsOrderInQuestion",
               BindingFlags.NonPublic | BindingFlags.Instance);

        protected static MethodInfo EntityTypeCloner_UpdateQuestionsOrderInObjective =
            typeof(EntityCloner).GetMethod("UpdateQuestionsOrderInObjective", BindingFlags.NonPublic | BindingFlags.Instance);

        protected static MethodInfo EntityTypeCloner_UpdateObjectivesOrderInCourse =
            typeof(EntityCloner).GetMethod("UpdateObjectivesOrderInCourse", BindingFlags.NonPublic | BindingFlags.Instance);

        public override T Clone<T>(T obj, params object[] args)
        {
            if (obj is Entity)
            {
                if (args.Length == 0 || !(args[0] is string))
                {
                    throw new ArgumentException("For Entity type owner name has to be passed as first element of args and should be string.", "args");
                }
            }
            return base.Clone(obj, args);
        }

        protected override List<Expression> GetCustomCloneExpressions(Type type, Expression target, Expression cloned, Expression source, Expression args)
        {
            if (typeof(Entity).IsAssignableFrom(type))
            {
                var list = new List<Expression>
                {
                    Expression.Assign(target, Expression.New(type)),
                    Expression.Call(cloned, Methods.ClonedDic_Add, source, target)
                };

                foreach (var propertyInfo in type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
                {
                    PropertyInfo member = null;
                    // workaround for private fields in base classes
                    if (!propertyInfo.CanWrite && propertyInfo.DeclaringType != type)
                    {
                        member = propertyInfo.DeclaringType.GetProperty(propertyInfo.Name,
                            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                    }
                    else
                    {
                        member = propertyInfo;
                    }

                    if (type == typeof(Course) || type == typeof(Course.CourseTemplateSettings))
                    {
                        if (member.Name == "Template")
                        {
                            list.Add(Expression.Assign(Expression.Property(target, member), Expression.Property(source, member)));
                            continue;
                        }
                    }

                    if (type == typeof(Course))
                    {
                        if (member.Name == "BuildOn" || member.Name == "PackageUrl" || member.Name == "PublishedOn" || member.Name == "ScormPackageUrl" || member.Name == "PublicationUrl"
                            || member.Name == "CommentsCollection" || member.Name == "CollaboratorsCollection" || member.Name == "TemplateSettings" || member.Name == "Aim4YouIntegration")
                        {
                            continue;
                        }

                        if (member.Name == "CreatedOn")
                        {
                            list.Add(Expression.Assign(Expression.Property(target, member), Expression.Invoke(Expression.Field(null, DateTimeWrapper_NowPropertyInfo))));
                            continue;
                        }
                    }

                    // cloning of cources is not needed.
                    if (type == typeof(Objective) && member.Name == "RelatedCoursesCollection")
                        continue;

                    if (!member.CanRead || !member.CanWrite || member.GetIndexParameters().Length > 0)
                        continue;

                    if (member.Name == "Id")
                    {
                        list.Add(Expression.Assign(Expression.Property(target, member), Expression.Call(null, Guid_NewGuidMethodInfo)));
                    }
                    else if (member.Name == "ModifiedOn")
                    {
                        list.Add(Expression.Assign(Expression.Property(target, member), Expression.Invoke(Expression.Field(null, DateTimeWrapper_NowPropertyInfo))));
                    }
                    else if (member.Name == "CreatedBy" || member.Name == "ModifiedBy")
                    {
                        list.Add(Expression.Assign(Expression.Property(target, member),
                            Expression.Convert(Expression.ArrayAccess(args, Expression.Constant(0)), typeof(string))));
                    }
                    else
                    {
                        list.Add(GetPropertyCopyExpression(member, source, target, cloned, args));
                    }
                }

                if (typeof(Question).IsAssignableFrom(type))
                {
                    list.Add(Expression.Call(Expression.Constant(this), EntityTypeCloner_UpdateLearningContentsOrderInQuestion, source, target));
                }

                if (type == typeof(Objective))
                {
                    list.Add(Expression.Call(Expression.Constant(this), EntityTypeCloner_UpdateQuestionsOrderInObjective, source, target));
                }

                if (type == typeof(Course))
                {
                    list.Add(Expression.Call(Expression.Constant(this), EntityTypeCloner_UpdateObjectivesOrderInCourse, source, target));
                }
                return list;
            }
            return null;
        }

        protected virtual void UpdateObjectivesOrderInCourse(Course source, Course target)
        {
            var orderedClonedObjectives = source.OrderClonedObjectives(target.RelatedObjectivesCollection);
            target.UpdateObjectivesOrder(orderedClonedObjectives, target.CreatedBy);
        }

        protected virtual void UpdateQuestionsOrderInObjective(Objective source, Objective target)
        {
            var orderedClonedQuestions = source.OrderClonedQuestions(target.QuestionsCollection);
            target.UpdateQuestionsOrder(orderedClonedQuestions, target.CreatedBy);
        }

        protected virtual void UpdateLearningContentsOrderInQuestion(Question source, Question target)
        {
            var orderedClonedLearningContents = source.OrderClonedLearningContents(target.LearningContentsCollection);
            target.UpdateLearningContentsOrder(orderedClonedLearningContents, target.CreatedBy);
        }
    }
}
