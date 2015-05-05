namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ReorderTemplates : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE dbo.Templates SET [Order] = 0 WHERE Name = 'Simple course'");
            Sql("UPDATE dbo.Templates SET [Order] = 1 WHERE Name = 'Personalized learning'");
            Sql("UPDATE dbo.Templates SET [Order] = 2 WHERE Name = 'Quiz'");
            Sql("UPDATE dbo.Templates SET [Order] = 3 WHERE Name = 'Exam'");
        }
        
        public override void Down()
        {
        }
    }
}
