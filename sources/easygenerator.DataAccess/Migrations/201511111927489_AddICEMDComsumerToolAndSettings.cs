namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddICEMDComsumerToolAndSettings : DbMigration
    {
        public override void Up()
        {
            Sql(@"                    
                  DECLARE @ICEMDId AS UNIQUEIDENTIFIER
                  SET @ICEMDId = NEWID()
                  INSERT INTO ConsumerTools SELECT @ICEMDId, 'ICEMD', null, 'C839026F1EC74A5AA931B8926F4124A8', 'FC9E5A113CD5492E988A23C35900FCEA'
                  INSERT INTO ConsumerToolSettings SELECT @ICEMDId, NULL, NULL, Id FROM Companies WHERE Name = 'ICEMD'
                ");
        }
        
        public override void Down()
        {
            Sql("DELETE FROM ConsumerTools WHERE Title = 'ICEMD'");
        }
    }
}
