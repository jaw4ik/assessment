﻿namespace easygenerator.DomainModel.Entities
{
    public class ConsumerTool : Identifiable
    {
        protected internal ConsumerTool() { }

        public string Title { get; private set; }
        public string Domain { get; private set; }

        public string Key { get; private set; }
        public string Secret { get; private set; }
        public virtual ConsumerToolSettings Settings { get; private set; }
    }
}
