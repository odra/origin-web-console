'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileClientRow', {
    controller: [
      '$scope',
      '$filter',
      '$routeParams',
      'ProjectsService',
      'DataService',
      'APIService',
      'MobileClientsService',
      'ListRowUtils',
      'Navigate',
      'AuthorizationService',
      MobileAppRow,
      
    ],
    controllerAs: 'row',
    bindings: {
      apiObject: '<',
      state: '<',
      bindings: '<'
    },
    templateUrl: 'views/overview/_mobile-client-row.html'
  });

  function MobileAppRow($scope, $filter, $routeParams, ProjectsService, DataService, APIService, MobileClientsService, ListRowUtils, Navigate,AuthorizationService) {
    var row = this;
  
    _.extend(row, ListRowUtils.ui);
    
    switch (row.apiObject.spec.clientType) {
      case 'android':
        row.icon = 'fa fa-android';
        break;
      case 'iOS':
        row.icon = 'fa fa-apple';
        break;
      case 'cordova':
        row.icon = 'icon icon-cordova';
        break;
      default:
        row.icon = 'fa fa-clone';
    }
    row.mobileclientVersion = {group:"mobile.k8s.io",version:"v1alpha1",resource:"mobileclients"};
    row.remove = function(){
      debugger;
      MobileClientsService.deleteClient(row.apiObject);
    };
    row.actionsDropdownVisible = function() {
      // no actions on those marked for deletion
      if (_.get(row.apiObject, 'metadata.deletionTimestamp')) {
        return false;
      }

      // We can delete mobileclients
      if (AuthorizationService.canI(row.mobileclientVersion, 'delete')) {
        return true;
      }

      
      // We can delete mobileclients
      return false;
    };

    $scope.browseCatalog = function() {
      Navigate.toProjectCatalog($scope.projectName);
    };
    $scope.projectName = $routeParams.project;
    $scope.alerts = {};
    $scope.renderOptions = $scope.renderOptions || {};
    $scope.renderOptions.hideFilterWidget = true;
    $scope.installType = '';

    
        $scope.app = row.apiObject;
        switch (row.apiObject.spec.clientType) {
          case 'cordova':
            $scope.installType = 'npm';
            break;
          case 'android':
            $scope.installType = 'maven';
            break;
          case 'iOS':
            $scope.installType = 'cocoapods';
            break;
        }


  }
})();
