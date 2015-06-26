﻿/// <reference path="../../../Scaffold/Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../../gen/Models.ts"/>

module App.Controllers {
    import Models = App.Models;
    import Controllers = App.Controllers.Models;

    function safeApply(scope, fn) {
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    }

    class UserCtrl {

        indexCtrl: IndexCtrl;

        static $inject = ["$scope"];

        roles = {};
        national: Models.Region;
        regionPairs: Models.Region[][] = [];
        regionChildren: { [key: number]: Models.Region[] } = {};

        selected: Models.UserViewModel = null;

        uploads: Models.DocumentUpload[] = null;

        savingStates = {};

        constructor(public $scope) {
            var ctrl = this;
            this.indexCtrl = $scope.indexCtrl;

            var id = this.indexCtrl.$location.path().replace("/u/", "");
            this.loadUser(id);
            Controllers.RegionController.Get("0").done(region => {
                $scope.$apply(() => {
                    ctrl.national = region;
                });
            });
        }

        isEditable() {
            if (this.selected == null)
                return false;

            var isAdmin = this.selected.Roles.filter(r => r == "admin" || r == "org_admin");
            if (isAdmin.length > 0)
                return false;
            if (this.indexCtrl.isInRole("admin"))
                return true;
            if (this.indexCtrl.isInRole("org_admin"))
                return this.indexCtrl.currentUser.fkOrganizationId == this.selected.Organization.Id;
            return false
        }

        getRegionChildren(id: number) {
            if (id != 0 && !id)
                return;

            var ctrl = this;
            if (! (typeof (this.regionChildren[id]) == "undefined"))
                return this.regionChildren[id];

            this.regionChildren[id] = [];
            Controllers.RegionController.GetAll({ "ParentId": id }).done(regions => {
                ctrl.$scope.$apply(() => {
                    for (var i = 0; i < regions.length; i++) {
                        ctrl.regionChildren[id].push(regions[i]);
                    }
                });
            });
            return this.regionChildren[id];
        }

        truncateRegionPair(regionPair, index) {
            for (var i = index + 1; i < regionPair.length; i++) {
                regionPair[i] = null;
            }
        }

        saveScopes() {
            var ctrl = this;
            var selectedRegions : Models.Region[] = [];
            for (var i = 0; i < this.regionPairs.length; i++) {
                var last = null;
                var regionPair = this.regionPairs[i];
                for (var j = 0; j < regionPair.length; j++) {
                    var region = regionPair[j];
                    if (!region) {
                        break;
                    }
                    last = region;
                }
                if (last){
                    selectedRegions.push(last);
                }
            }

            this.savingStates["scopes"] = true;
            Services.UserController.SetScopes(this.selected.Id, selectedRegions).done(() => {
                ctrl.loadUser(this.selected.Id);
                ctrl.$scope.$apply(() => {
                    ctrl.savingStates["scopes"] = false;
                });
            });
        }

        loadUser(id: string) {
            var ctrl = this;
            Services.UserController.Get(id).done((user) => {
                ctrl.$scope.$apply(() => {
                    ctrl.selected = user;
                    ctrl.roles = {};
                    for (var i = 0; i < user.Roles.length; i++) {
                        ctrl.roles[user.Roles[i]] = true;
                    }
                    ctrl.regionPairs = [];
                    for (var i = 0; i < user.Scopes.length; i++) {
                        var regionPair = [null, null, null, null, null];
                        var current = user.Scopes[i];
                        while (current) {
                            regionPair[current.Type] = current;
                            current = current.Parent;
                        }
                        ctrl.regionPairs.push(regionPair);
                    }
                });
                console.log(ctrl.regionPairs);
            });

            ctrl.uploads = null;
            Controllers.DocumentUploadController.GetAll({ "fkCreatedById": id }).done(uploads => {
                ctrl.$scope.$apply(() => {
                    ctrl.uploads = uploads;
                });
            });
        }

        saveRoles() {
            var ctrl = this;
            var selectedRoles = [];
            for (var key in this.roles) {
                if (this.roles[key]) {
                    selectedRoles.push(key);
                }
            }
            this.savingStates["roles"] = true;
            Services.UserController.UpdateVolunteerRoles(this.selected.Id, selectedRoles).done(() => {
                ctrl.$scope.$apply(() => {
                    this.savingStates["roles"] = false;
                });
            });
        }
    }

    kawaldesa.controller("UserCtrl",  UserCtrl);
}