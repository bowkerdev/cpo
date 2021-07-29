(function () {
  'use strict';

  angular
    .module('cpo')
    .service('compensationConfigService', ['$http', 'CommonService', '$translate', 
      function ($http, CommonService, $translate) {

        this.getOrderTypeList = function () {
          return [
            { label: 'Dometic', value: 'Dometic', id: 'Dometic' },
            { label: 'Export', value: 'Export', id: 'Export' }
          ]
        }

        this.getComplaintStatusList = function () {
          return [
						{ label: 'New', value: 'New', id: 'New' },
						{ label: 'Processing', value: 'Processing', id: 'Processing' },
						{ label: 'Completed', value: 'Completed', id: 'Completed' },
						{ label: 'Cancelled', value: 'Cancelled', id: 'Cancelled' }
					]
        }

        this.getCompensationStatusList = function () {
          return [
            { label: 'Saved', value: 'Saved', id: 'Saved' },
            { label: 'Submitted', value: 'Submitted', id: 'Submitted' },
            { label: 'Completed', value: 'Completed', id: 'Completed' },
            { label: 'Approved', value: 'Approved', id: 'Approved' },
            { label: 'Cancelled', value: 'Cancelled', id: 'Cancelled' }
          ]
        }

      }
    ])

})();