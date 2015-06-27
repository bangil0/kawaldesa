﻿using Scaffold.Validation;
using App.Utils.Excel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http.Validation;
using Scaffold;

namespace App.Models.Views
{

    public class BaseNationalBhprAllocationRecapitulation : IModel<string>
    {
        public string Id { get; set; }

        public string RegionId { get; set; }

        public int ApbdYear { get; set; }

        public bool ApbdIsPerubahan { get; set; }

        public string RegionName { get; set; }

        public string ParentRegionId { get; set; }

        public decimal? RegionalTax { get; set; }

        public decimal? RegionalRetribution { get; set; }

        public decimal? Bhpr { get; set; }

        public int TotalDesa { get; set; }
    }

    public class NationalBhprAllocationRecapitulation : BaseNationalBhprAllocationRecapitulation
    {
    }

    public class FrozenNationalBhprAllocationRecapitulation : BaseNationalBhprAllocationRecapitulation
    {
    }
}