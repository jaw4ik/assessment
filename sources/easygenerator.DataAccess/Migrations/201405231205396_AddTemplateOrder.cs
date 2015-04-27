namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddTemplateOrder : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Templates", "Order", c => c.Int(nullable: false, defaultValue: 0));
            Sql("UPDATE dbo.Templates SET [Order] = 0 WHERE Name = 'Simple course'");
            Sql("UPDATE dbo.Templates SET [Order] = 1 WHERE Name = 'Quiz'");
            Sql("UPDATE dbo.Templates SET [Order] = 2 WHERE Name = 'Exam'");
        }

        public override void Down()
        {
            DropColumn("dbo.Templates", "Order");
        }
    }
}
