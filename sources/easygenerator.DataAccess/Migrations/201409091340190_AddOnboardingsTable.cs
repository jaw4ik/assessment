namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOnboardingsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Onboardings",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        CourseCreated = c.Boolean(nullable: false),
                        ObjectiveCreated = c.Boolean(nullable: false),
                        ContentCreated = c.Boolean(nullable: false),
                        CreatedQuestionsCount = c.Int(nullable: false),
                        CoursePublished = c.Boolean(nullable: false),
                        IsClosed = c.Boolean(nullable: false),
                        UserEmail = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Onboardings");
        }
    }
}
