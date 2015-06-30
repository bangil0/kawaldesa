﻿using App.Models;
using App.Models.Views;
using Scaffold;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace App.Controllers.Models
{
    public class BaseNationalAddRecapitulationController<TRecapitulation> : ReadOnlyController<TRecapitulation, string>
        where TRecapitulation: BaseNationalAddRecapitulation, new()
    {
        public BaseNationalAddRecapitulationController(DB dbContext)
            : base(dbContext)
        {
        }

        protected override IQueryable<TRecapitulation> ApplyQuery(IQueryable<TRecapitulation> query)
        {
            var parentId = GetQueryString<string>("fkParentId");
            return query.Where(t => (t.ParentRegionId == parentId || t.RegionId == parentId) && t.ApbnKey == "2015p");
        }
    }
    public class NationalAddRecapitulationController : BaseNationalAddRecapitulationController<NationalAddRecapitulation>
    {
        public NationalAddRecapitulationController(DB dbContext)
            : base(dbContext)
        {
        }
    }
    public class FrozenNationalAddRecapitulationController : BaseNationalAddRecapitulationController<FrozenNationalAddRecapitulation>
    {
        public FrozenNationalAddRecapitulationController(DB dbContext)
            : base(dbContext)
        {
        }
    }
}