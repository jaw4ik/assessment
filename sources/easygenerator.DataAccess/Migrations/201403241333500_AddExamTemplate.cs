namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddExamTemplate : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO dbo.Templates VALUES(NEWID(), 'Exam', '/Content/images/examTemplate.png', 'Use this when you want to create a final examination (with no explanations or learning content).', '/Templates/Exam/', 'admin@easygenerator.com', GETDATE(), 'admin@easygenerator.com', GETDATE())");
        }
        
        public override void Down()
        {
            Sql("DELETE FROM Templates WHERE Name = 'Exam'");
        }
    }
}
