using System;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess
{
    public class DatabaseContext : DbContext, IDataContext, IUnitOfWork
    {
        static DatabaseContext()
        {
            try
            {
                Database.SetInitializer(new DatabaseContextInitializationStrategy());
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DatabaseContext()
            : this("DefaultConnection")
        {

        }

        public DatabaseContext(string connectionString)
            : base(connectionString)
        {
        }

        public DbSet<Objective> Objectives { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<LearningObject> LearningObjects { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<HelpHint> HelpHints { get; set; }

        public IDbSet<T> GetSet<T>() where T : Entity
        {
            return Set<T>();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            ApplyEntityMapping<Objective>(modelBuilder);
            modelBuilder.Entity<Objective>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Objective>().HasMany(e => e.QuestionsCollection).WithRequired(e => e.Objective);
            modelBuilder.Entity<Objective>().HasMany(e => e.RelatedExperiencesCollection)
                .WithMany(e => e.RelatedObjectivesCollection)
                .Map(m => m.ToTable("ExperienceObjectives"));


            ApplyEntityMapping<Experience>(modelBuilder);
            modelBuilder.Entity<Experience>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Experience>().HasRequired(e => e.Template);
            modelBuilder.Entity<Experience>().HasMany(e => e.RelatedObjectivesCollection)
                .WithMany(e => e.RelatedExperiencesCollection)
                .Map(m => m.ToTable("ExperienceObjectives"));

            ApplyEntityMapping<Question>(modelBuilder);
            modelBuilder.Entity<Question>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Question>().HasRequired(e => e.Objective);
            modelBuilder.Entity<Question>().HasMany(e => e.AnswersCollection).WithRequired(e => e.Question);
            modelBuilder.Entity<Question>().HasMany(e => e.LearningObjectsCollection).WithRequired(e => e.Question);

            ApplyEntityMapping<LearningObject>(modelBuilder);
            modelBuilder.Entity<LearningObject>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<LearningObject>().HasRequired(e => e.Question);

            ApplyEntityMapping<Answer>(modelBuilder);
            modelBuilder.Entity<Answer>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<Answer>().Property(e => e.IsCorrect).IsRequired();
            modelBuilder.Entity<Answer>().HasRequired(e => e.Question);

            ApplyEntityMapping<User>(modelBuilder);
            modelBuilder.Entity<User>().Property(e => e.Email).IsRequired().HasMaxLength(254);
            modelBuilder.Entity<User>().Property(e => e.PasswordHash).IsRequired();

            ApplyEntityMapping<HelpHint>(modelBuilder);
            modelBuilder.Entity<HelpHint>().Property(e => e.Name).IsRequired().HasMaxLength(254);

            ApplyEntityMapping<Template>(modelBuilder);
            modelBuilder.Entity<Template>().Property(e => e.Name).IsRequired();
            modelBuilder.Entity<Template>().Property(e => e.Image).IsRequired();

            modelBuilder.Entity<MailNotification>().HasKey(e => e.Id);
            modelBuilder.Entity<MailNotification>().Property(e => e.CreatedOn).IsRequired();
            modelBuilder.Entity<MailNotification>().Property(e => e.Body).IsRequired();
            // ignore useless properties for mailnotification entities
            modelBuilder.Entity<MailNotification>().Ignore(e => e.ModifiedOn);
            modelBuilder.Entity<MailNotification>().Ignore(e => e.CreatedBy);
            modelBuilder.Entity<MailNotification>().Ignore(e => e.ModifiedBy);
            //
            modelBuilder.Entity<MailNotification>().Property(e => e.Subject).HasMaxLength(254).IsRequired();
            modelBuilder.Entity<MailNotification>().Property(e => e.ToEmailAddresses).HasMaxLength(511).IsRequired();
            modelBuilder.Entity<MailNotification>().Property(e => e.CCEmailAddresses).HasMaxLength(511);
            modelBuilder.Entity<MailNotification>().Property(e => e.BCCEmailAddresses).HasMaxLength(511);
            modelBuilder.Entity<MailNotification>().Property(e => e.FromEmailAddress).HasMaxLength(127).IsRequired();

            base.OnModelCreating(modelBuilder);
        }

        private static void ApplyEntityMapping<T>(DbModelBuilder builder) where T : Entity
        {
            builder.Entity<T>().HasKey(e => e.Id);
            builder.Entity<T>().Property(e => e.CreatedOn).IsRequired();
            builder.Entity<T>().Property(e => e.ModifiedOn).IsRequired();
            builder.Entity<T>().Property(e => e.CreatedBy).IsRequired();
            builder.Entity<T>().Property(e => e.ModifiedBy).IsRequired();
        }

        public void Save()
        {
            SaveChanges();
        }


        public override int SaveChanges()
        {
            try
            {
                foreach (DbEntityEntry entry in ChangeTracker.Entries<Entity>())
                {
                    if ((entry.Entity is Answer) && (entry.Entity as Answer).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is LearningObject) && (entry.Entity as LearningObject).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is Question) && (entry.Entity as Question).Objective == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                }

                return base.SaveChanges();
            }
            catch (DbEntityValidationException dbEx)
            {
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        Debug.WriteLine("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
                throw;
            }

        }
    }
}
