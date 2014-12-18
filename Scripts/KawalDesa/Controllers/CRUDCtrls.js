﻿/// <reference path="../../../Scaffold/Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/underscore/underscore.d.ts"/>
/// <reference path="../../Models.ts"/>
/// <reference path="../KawalDesa.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KawalDesa;
(function (KawalDesa) {
    (function (Controllers) {
        var Models = App.Models;

        var CRUDCtrl = (function () {
            function CRUDCtrl($scope, cfpLoadingBar) {
                this.$scope = $scope;
                this.cfpLoadingBar = cfpLoadingBar;
                this.IDField = "ID";
                this.sortField = this.IDField;
                this.sortOrder = "ASC";
                var ctrl = this;
                $scope.model = {};

                $scope.page = 1;
                $scope.entitiesPerPage = 10;
                $scope.pagination = { current: 1 };

                $scope.$watch("entitiesPerPage", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    ctrl.query = ctrl.generateQuery(ctrl.sortField, ctrl.sortOrder, ctrl.$scope.page, ctrl.$scope.entitiesPerPage, ctrl.keywords);
                    ctrl.fetch(ctrl.query);
                });
            }
            CRUDCtrl.prototype.save = function () {
                var ctrl = this;
                var model = new this.type(this.$scope.model);

                model.Save().done(function () {
                    ctrl.updateEntity(model);
                    ctrl.$scope.formMessage = {
                        type: "success",
                        message: "Successfully saved!"
                    };
                }).fail(function (response) {
                    ctrl.$scope.formMessage = {
                        type: "error",
                        message: response.responseJSON.Message,
                        errors: response.responseJSON.ModelState
                    };
                }).always(function () {
                    ctrl.$scope.$apply(function () {
                        ctrl.$scope.formMessage;
                    });
                });
            };

            CRUDCtrl.prototype.edit = function (model) {
                this.toggleForm(true);
                this.$scope.model = model;
            };

            CRUDCtrl.prototype.updateEntity = function (model) {
                var ctrl = this;
                var scope = this.$scope;
                for (var i = 0; i < scope.entities.length; i++) {
                    if (model[ctrl.IDField] !== null && model[ctrl.IDField] === scope.entities[i][ctrl.IDField]) {
                        scope.$apply(function () {
                            scope.entities[i] = model;
                        });
                        return;
                    }
                }
                scope.$apply(function () {
                    scope.entities.push(model);
                    scope.totalEntities += 1;
                });
            };

            CRUDCtrl.prototype.fetch = function (query) {
                var scope = this.$scope;
                var ctrl = this;
                ctrl.cfpLoadingBar.start();
                this.type.Count(query).done(function (count) {
                    scope.$apply(function () {
                        scope.totalEntities = count;
                    });
                });

                this.type.GetAll(query).done(function (entities) {
                    scope.$apply(function () {
                        scope.entities = entities;
                        ctrl.cfpLoadingBar.complete();
                    });
                });
            };

            CRUDCtrl.prototype.search = function () {
                var keywords = this.keywords;
                if (!this.keywords)
                    keywords = "";
                else if (this.keywords.length < 3)
                    return;

                this.query = this.generateQuery(this.sortField, this.sortOrder, 1, this.$scope.entitiesPerPage, keywords);
                this.fetch(this.query);
            };

            CRUDCtrl.prototype.changePage = function (newPage) {
                this.$scope.page = newPage;
                this.query = this.generateQuery(this.sortField, this.sortOrder, newPage, this.$scope.entitiesPerPage, this.keywords);
                this.fetch(this.query);
            };

            CRUDCtrl.prototype.generateQuery = function (sortField, sortOrder, pageBegin, pageLength, keywords) {
                var result = {};
                if (sortField)
                    result["SortField"] = sortField;
                if (sortOrder)
                    result["SortOrder"] = sortOrder;
                if (pageBegin)
                    result["PageBegin"] = pageBegin;
                if (pageLength)
                    result["PageLength"] = pageLength;
                if (keywords)
                    result["Keywords"] = keywords;
                return result;
            };

            CRUDCtrl.prototype.toggleForm = function (show) {
                this.showForm = show;
                this.$scope.model = null;
                this.$scope.formMessage = null;
            };

            CRUDCtrl.prototype.validate = function (model) {
                return true;
            };
            return CRUDCtrl;
        })();

        var RegionCtrl = (function (_super) {
            __extends(RegionCtrl, _super);
            function RegionCtrl($scope, cfpLoadingBar) {
                _super.call(this, $scope, cfpLoadingBar);
                this.$scope = $scope;
                this.cfpLoadingBar = cfpLoadingBar;
                this.type = Models.Region;
                this.SortField = "DateCreated";
                this.SortOrder = "DESC";
                this.getRegionsType();
            }
            RegionCtrl.prototype.save = function () {
                this.$scope.model.ParentID = this.$scope.model.Parent.ID;
                _super.prototype.save.call(this);
            };

            RegionCtrl.prototype.getRegion = function (query) {
                return App.Models.Region.GetAll({
                    Keywords: query,
                    SortOrder: 'ASC'
                });
            };

            RegionCtrl.prototype.getRegionsType = function () {
                var scope = this.$scope;
                var ctrl = this;
                $.ajax({
                    type: "GET",
                    url: "/api/Enum/GetRegionType"
                }).done(function (regionTypeName) {
                    scope.$apply(function () {
                        ctrl.regionTypeName = regionTypeName;
                    });
                });
            };
            return RegionCtrl;
        })(CRUDCtrl);

        var TransactionCtrl = (function (_super) {
            __extends(TransactionCtrl, _super);
            function TransactionCtrl($scope, cfpLoadingBar) {
                _super.call(this, $scope, cfpLoadingBar);
                this.$scope = $scope;
                this.cfpLoadingBar = cfpLoadingBar;
                this.type = Models.Transaction;
            }
            TransactionCtrl.prototype.save = function () {
                this.$scope.model.SourceID = this.$scope.model.Source.ID;
                this.$scope.model.DestinationID = this.$scope.model.Destination.ID;
                _super.prototype.save.call(this);
            };

            TransactionCtrl.prototype.getRegion = function (query) {
                return App.Models.Region.GetAll({
                    Keywords: query,
                    SortOrder: 'ASC'
                });
            };

            TransactionCtrl.prototype.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                this.openExamDatePicker = true;
            };
            return TransactionCtrl;
        })(CRUDCtrl);

        var UserCtrl = (function (_super) {
            __extends(UserCtrl, _super);
            function UserCtrl($scope, cfpLoadingBar) {
                _super.call(this, $scope, cfpLoadingBar);
                this.$scope = $scope;
                this.cfpLoadingBar = cfpLoadingBar;
                this.type = Models.User;
                this.roles = [];
                this.roleNames = ["admin"];
                this.IDField = 'Id';
            }
            UserCtrl.prototype.getRoles = function () {
                var ctrl = this;
                var scope = this.$scope;
                $.ajax({
                    type: 'GET',
                    url: '/api/User/GetAllRoles'
                }).done(function (roles) {
                    scope.$apply(function () {
                        ctrl.roles = _.reduce(roles, function (o, v) {
                            o[v.Value] = v.Text;
                            return o;
                        }, {});
                    });
                });
            };
            return UserCtrl;
        })(CRUDCtrl);

        var NationalRegionCtrl = (function () {
            function NationalRegionCtrl($scope, cfpLoadingBar, $state, $stateParams) {
                this.$scope = $scope;
                this.cfpLoadingBar = cfpLoadingBar;
                this.$state = $state;
                this.$stateParams = $stateParams;
                var ctrl = this;

                $scope.currentRegion = {};
                $scope.entities = [];
                $scope.page = 1;
                $scope.entitiesPerPage = 10;
                $scope.pagination = { current: 1 };

                if ($state.current.name === "index") {
                    this.getRegions(1, null);
                } else if ($state.current.name === "province" || $state.current.name === "district") {
                    if (!$stateParams.ProvinceID)
                        return;

                    var provinceID = $stateParams.ProvinceID;
                    var scope = this.$scope;
                    Models.Region.Get(provinceID).done(function (region) {
                        scope.$apply(function () {
                            scope.currentRegion = region;
                        });
                    });

                    if ($state.current.name === "province")
                        this.getRegions(2, provinceID);
                    else
                        this.getRegions(3, provinceID);
                }
            }
            NationalRegionCtrl.prototype.getRegions = function (type, parentID) {
                var ctrl = this;
                var scope = this.$scope;
                var query = {
                    "SortOrder": "ASC",
                    "Type": type,
                    "ParentID": parentID
                };
                Models.Region.GetAll(query).done(function (regions) {
                    scope.$apply(function () {
                        scope.entities = regions;
                    });
                });
            };
            return NationalRegionCtrl;
        })();

        KawalDesa.kawaldesa.controller("RegionCtrl", ["$scope", "cfpLoadingBar", RegionCtrl]);
        KawalDesa.kawaldesa.controller("TransactionCtrl", ["$scope", "cfpLoadingBar", TransactionCtrl]);
        KawalDesa.kawaldesa.controller("UserCtrl", ["$scope", "cfpLoadingBar", UserCtrl]);
        KawalDesa.kawaldesa.controller("NationalRegionCtrl", ["$scope", "cfpLoadingBar", "$state", "$stateParams", NationalRegionCtrl]);
    })(KawalDesa.Controllers || (KawalDesa.Controllers = {}));
    var Controllers = KawalDesa.Controllers;
})(KawalDesa || (KawalDesa = {}));
//# sourceMappingURL=CRUDCtrls.js.map
