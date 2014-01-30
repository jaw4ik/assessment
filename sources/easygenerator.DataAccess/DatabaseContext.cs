using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Diagnostics;
using easygenerator.DomainModel.Entities;
using easygenerator.DataAccess.Migrations;

namespace easygenerator.DataAccess
{
    public class DatabaseContext : DbContext, IDataContext, IUnitOfWork
    {
        static DatabaseContext()
        {
            try
            {
                Database.SetInitializer(new MigrateDatabaseToLatestVersion<DatabaseContext, Configuration>());
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
            ((IObjectContextAdapter)this).ObjectContext.ObjectMaterialized += (sender, args) => DateTimeObjectMaterializer.Materialize(args.Entity);
        }

        public DbSet<Objective> Objectives { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<LearningContent> LearningContents { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<HelpHint> HelpHints { get; set; }

        public IDbSet<T> GetSet<T>() where T : Entity
        {
            return Set<T>();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Properties<Guid>().Where(p => p.Name == "Id").Configure(p => p.IsKey());
            modelBuilder.Properties<DateTime>().Where(p => p.Name == "CreatedOn").Configure(p => p.IsRequired());
            modelBuilder.Properties<DateTime>().Where(p => p.Name == "ModifiedOn").Configure(p => p.IsRequired());
            modelBuilder.Properties<string>().Where(p => p.Name == "CreatedBy").Configure(p => p.IsRequired());
            modelBuilder.Properties<string>().Where(p => p.Name == "ModifiedBy").Configure(p => p.IsRequired());


            modelBuilder.Entity<Objective>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Objective>().HasMany(e => e.QuestionsCollection).WithRequired(e => e.Objective);
            modelBuilder.Entity<Objective>().HasMany(e => e.RelatedCoursesCollection)
                .WithMany(e => e.RelatedObjectivesCollection)
                .Map(m => m.ToTable("CourseObjectives"));


            modelBuilder.Entity<Course>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Course>().HasRequired(e => e.Template).WithMany(e => e.Courses).WillCascadeOnDelete(false);
            modelBuilder.Entity<Course>().HasMany(e => e.RelatedObjectivesCollection).WithMany(e => e.RelatedCoursesCollection).Map(m => m.ToTable("CourseObjectives"));
            modelBuilder.Entity<Course>().HasMany(e => e.TemplateSettings).WithRequired(e => e.Course).WillCascadeOnDelete(true);
            modelBuilder.Entity<Course>().Property(e => e.IntroductionContent).IsMaxLength().IsOptional();

            modelBuilder.Entity<Course.CourseTemplateSettings>().Property(e => e.Settings);
            modelBuilder.Entity<Course.CourseTemplateSettings>().HasRequired(e => e.Course);
            modelBuilder.Entity<Course.CourseTemplateSettings>().HasRequired(e => e.Template);

            modelBuilder.Entity<Question>().Property(e => e.Title).HasMaxLength(255).IsRequired();
            modelBuilder.Entity<Question>().HasRequired(e => e.Objective);
            modelBuilder.Entity<Question>().HasMany(e => e.AnswersCollection).WithRequired(e => e.Question);
            modelBuilder.Entity<Question>().HasMany(e => e.LearningContentsCollection).WithRequired(e => e.Question);

            modelBuilder.Entity<LearningContent>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<LearningContent>().HasRequired(e => e.Question);

            modelBuilder.Entity<Answer>().Property(e => e.Text).IsRequired();
            modelBuilder.Entity<Answer>().Property(e => e.IsCorrect).IsRequired();
            modelBuilder.Entity<Answer>().HasRequired(e => e.Question);

            modelBuilder.Entity<User>().Property(e => e.Email).IsRequired().HasMaxLength(254);
            modelBuilder.Entity<User>().Property(e => e.PasswordHash).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Phone).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.FullName).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Country).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.Organization).IsRequired();
            modelBuilder.Entity<User>().Property(e => e.AccessType).IsRequired();
            modelBuilder.Entity<User>().HasMany(e => e.PasswordRecoveryTicketCollection).WithRequired(e => e.User);

            modelBuilder.Entity<UserSettings>().Property(e => e.IsShowIntroductionPage).IsRequired();
            modelBuilder.Entity<UserSettings>().HasRequired(e => e.User);

            modelBuilder.Entity<PasswordRecoveryTicket>().HasRequired(e => e.User);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.CreatedBy);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.ModifiedBy);
            modelBuilder.Entity<PasswordRecoveryTicket>().Ignore(e => e.ModifiedOn);

            modelBuilder.Entity<HelpHint>().Property(e => e.Name).IsRequired().HasMaxLength(254);

            modelBuilder.Entity<Template>().Property(e => e.Name).IsRequired();
            modelBuilder.Entity<Template>().Property(e => e.Image).IsRequired();
            modelBuilder.Entity<Template>().HasMany(e => e.Courses);

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

            modelBuilder.Entity<ImageFile>().Property(e => e.Title).HasMaxLength(255).IsRequired();

            base.OnModelCreating(modelBuilder);
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
                    if ((entry.Entity is LearningContent) && (entry.Entity as LearningContent).Question == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is Question) && (entry.Entity as Question).Objective == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                    if ((entry.Entity is PasswordRecoveryTicket) && (entry.Entity as PasswordRecoveryTicket).User == null)
                    {
                        entry.State = EntityState.Deleted;
                    }
                }

                return base.SaveChanges();
            }
            catch (DbEntityValidationException exception)
            {
                foreach (var validationErrors in exception.EntityValidationErrors)
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
