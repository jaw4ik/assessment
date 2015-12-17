namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateSystemTemplatesOrder : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE Templates SET [Order]='0'");
            Sql("UPDATE Templates SET [Order]='1' WHERE [Name]='Simple course'");
            Sql("UPDATE Templates SET [Order]='2' WHERE [Name]='Assessment'");
            Sql("UPDATE Templates SET [Order]='3' WHERE [Name]='Personalized learning'");
            Sql("UPDATE Templates SET [Order]='4' WHERE [Name]='Reader'");
        }
        
        public override void Down()
        {
        }
    }
}
