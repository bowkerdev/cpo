(function() {
	'use strict';

	angular
		.module('cpo')
    .service('sectionWidgetService',
    [function () {
        this.moveUp = function(Array,index) {
          var array=Array;
          if(index>0){
            var tmp = array[index];
            array[index] = array[index-1];
            array[index-1] = tmp;
          }

        }
        this.moveDown = function(Array,index) {
          var array=Array;
          if(index<array.length-1){
            var tmp = array[index];
            array[index] = array[index+1];
            array[index+1] = tmp;
          }

        }
        this.delete = function(Array,index) {
          Array.splice(index,1);
        }
      }])
})();
