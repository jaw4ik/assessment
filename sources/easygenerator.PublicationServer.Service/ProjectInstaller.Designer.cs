namespace easygenerator.PublicationServer
{
    partial class ProjectInstaller
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.publicationServiceProcessInstaller = new System.ServiceProcess.ServiceProcessInstaller();
            this.publicationServiceInstaller = new System.ServiceProcess.ServiceInstaller();
            // 
            // publicationServiceProcessInstaller
            // 
            this.publicationServiceProcessInstaller.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.publicationServiceProcessInstaller.Password = null;
            this.publicationServiceProcessInstaller.Username = null;
            // 
            // publicationServiceInstaller
            // 
            this.publicationServiceInstaller.Description = "Serve API for course publications and provide access to published packages via HT" +
    "TP.";
            this.publicationServiceInstaller.DisplayName = "easygenerator Publication Server Service";
            this.publicationServiceInstaller.ServiceName = "easygenerator.PublicationServer";
            this.publicationServiceInstaller.StartType = System.ServiceProcess.ServiceStartMode.Automatic;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.publicationServiceProcessInstaller,
            this.publicationServiceInstaller});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller publicationServiceProcessInstaller;
        private System.ServiceProcess.ServiceInstaller publicationServiceInstaller;
    }
}