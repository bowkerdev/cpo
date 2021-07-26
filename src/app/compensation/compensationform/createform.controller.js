(function () {
  'use strict';

  angular
    .module('cpo')
    .service('compensationCreateFormService', ['$http', 'CommonService', '$translate',
      function ($http, CommonService, $translate) {

        var gModalInstance;
        var modalScope;
        this.setModalScope = function (inScope, inModalInstance) {
          modalScope = inScope;
          gModalInstance = inModalInstance;
        };

        this.cancel = function () {
          gModalInstance.dismiss();
        }

        this.save = function (scope) {
          gModalInstance.close()
        }

        /**
         * init
         */
        this.init = function (scope, planGroups) {
          var _this = this;
        };
      }
    ])
    .controller('compensationCreateFormController', ["$scope", "compensationCreateFormService", '$uibModalInstance', "fileReader", 'planGroups',
      function ($scope, compensationCreateFormService, $uibModalInstance, fileReader, planGroups) {
        compensationCreateFormService.setModalScope($scope, $uibModalInstance);
        $scope.cancel = function () {
          compensationCreateFormService.cancel();
        }
        $scope.save = function () {
          compensationCreateFormService.save($scope);
        }
        compensationCreateFormService.init($scope, planGroups);
      }
    ])

})();
