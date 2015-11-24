namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNuvolaConsumerToolAndSettings : DbMigration
    {
        public override void Up()
        {
            Sql(@"                    
                  DECLARE @NuvolaId AS UNIQUEIDENTIFIER
                  SET @NuvolaId = NEWID()
                  INSERT INTO ConsumerTools SELECT @NuvolaId, 'Nuvola', null, 'F844BD681F4F44EFBC5F7EA42A587C3D', 'A85C6830BB644962AFB9BC45432C522F'
                  INSERT INTO ConsumerToolSettings SELECT @NuvolaId, NULL, NULL, Id FROM Companies WHERE Name = 'Nuvola'
                ");
        }

        public override void Down()
        {
            Sql(@"
                DELETE FROM ConsumerToolSettings WHERE Id IN (SELECT Id FROM ConsumerTools WHERE Title = 'Nuvola')
                DELETE FROM ConsumerTools WHERE Title = 'Nuvola'
            ");
        }
    }
}
