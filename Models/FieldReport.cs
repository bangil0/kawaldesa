﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace App.Models
{
    public class FieldReport : BaseEntity
    {
        public override long ID { get; set; }
        public String Notes { get; set; }
        public DateTime Date { get; set; }
        public bool IsActivated { get; set; }

        [ForeignKey("Realization")]
        public long? fkRealizationID { get; set; }
        public virtual Realization Realization { get; set; }
        public virtual List<Blob> Pictures { get; set; }
    }
}