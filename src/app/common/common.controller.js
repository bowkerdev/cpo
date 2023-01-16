(function() {
  'use strict';

  angular
    .module('cpo')
    .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          element.bind('change', function(event){
            scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
            });
            //附件预览
            scope.file = (event.srcElement || event.target).files[0];
            scope.getFile();
          });
        }
      };
    }])
    .factory('fileReader', ["$q", function($q){
      var onLoad = function(reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.resolve(reader.result);
          });
        };
      };

      var onError = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.reject(reader.result);
          });
        };
      };

      var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
      };

      var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
      };

      return {
        readAsDataUrl: readAsDataURL
      };
    }])
    .service('CommonService', ['$modal', '$translate', 'COMMON_CONFIG','uiGridConstants',
      function ($uibModal, $translate, COMMON_CONFIG,uiGridConstants) {

			this.userInfo;
      this.menu = null;
      this.permissionCache = {};

      this.setFlg = function(checkParam1, checkParam2){
        var checkResult = null;
        if (angular.isDefined(checkParam2)) {
          if(checkParam1 === true && checkParam2 === false){
            checkResult = 1;
          }else if (checkParam1 === false && checkParam2 === true){
            checkResult = 0;
          }
        } else {
          if(checkParam1 === true){
            checkResult = 1;
          } else {
            checkResult = 0;
          }
        }
        return checkResult;
      };

      this.getFlg = function(checkParam){
        var checkResult = true;
        if(checkParam === 0){
          checkResult = false;
        }
        return checkResult;
      };

      this.blankToNull = function(item){
        if (item === '') {
          item = null;
        }
        return item;
      };

      this.checkRequired = function(checkValue){
        if(angular.isNullOrUndefined(checkValue) || checkValue === ''){
          return false;
        }
        return true;
      };

      this.changeFlag = function(target) {
        if (target) {
          return false;
        }
        return true;
      };

      this.nullToBlank = function (item) {
        if (item === null) {
          item = '';
        }
        return item;
      };

      this.setPulldownSelect = function(pulldownList, parseCustomSearchValue, keyName){

        var setPulldownObj = null;

        angular.forEach(pulldownList, function(pullDownObj) {
          if (parseCustomSearchValue){
            if (eval("pullDownObj." + keyName) === eval("parseCustomSearchValue." + keyName) ){
              setPulldownObj = pullDownObj;
            }
          }
        });

        return setPulldownObj;
      };

      this.outputCommonModal = function(modalType, outputMsg){
        // 确认对话框打开
        return $uibModal.open({
          templateUrl : 'commonConfirmModal',
          controller : 'CommonConfirmCtrl',
          backdrop: 'static',
          size : 'sm',
          resolve : {
            outputMode : function() {
              return modalType;
            },
            outputMsg : function() {
              return outputMsg;
            }
          }
        });

      };

      this.getStatusMsg = function(statusType, statusCode){
        var statusCodeList = [statusCode];
        var statusMsgList = [];
        var statusMsg = '';
        var paramList = [];
        for (var i = 2; i < arguments.length; i++) {
          paramList.push(arguments[i]);
        }
        var paramValList = [];
        if (paramList.length > 0){
          paramValList.push(paramList);
        }
        statusMsgList = this.getStatusMsgs(statusType, statusCodeList, paramValList);
        if (statusMsgList.length > 0){
          statusMsg = statusMsgList[0];
        }
        return statusMsg;
      };

      this.getStatusMsgs = function(statusType, statusCodeList, paramList){

        var statusMsgList = [];
        var thisService = this;
        // status code取得
        angular.forEach(statusCodeList, function(statusCode, i){
          // 国际化文件语言取得
          var msg = $translate.instant(statusType + '.' + statusCode);
          if (statusType === 'errorAPIMsg' && msg === statusType + '.' + statusCode){
            msg = $translate.instant(statusType + '.' + 'OTHER');
            paramList = [];
          } else if (msg === statusType + '.' + statusCode){
            // 其他status code的情况
            if (statusCode){
              msg = statusCode;
            } else {
              msg = '';
            }
          }
          // 参数设定
          angular.forEach(paramList[i], function(paramVal, j){
            if (msg.indexOf('$' + String(j)) !== -1){
              var translateParam = thisService.getStatusMsgParam(paramVal);
              msg = msg.replace('$' + String(j), translateParam);
            }
          });
          var setObj = {'text': msg};
          statusMsgList.push(setObj);
        });
        return statusMsgList;
      };

      this.getStatusMsgParam = function(key){
        // 国际化文件语言取得
        var returnMsg = $translate.instant(key);
        return returnMsg;
      };

      this.constructeStaticColumnsFromJSON = function(scope,columnDefName,hasFilter,cellTemplate,width,isMinWith) {
        var array = scope.rootColumnDef[columnDefName];
        if (array) {

          var newArray = new Array();

          for (var index in array) {
            var item = array[index];
            var newItem = {
              name: (item.displayName?item.displayName:"")+Math.ceil(Math.random()*1000),
              displayName: item.displayName,
              field: item.field,

              enableCellEdit: false,
            }
            if(isMinWith){
              newItem.minWidth = width ? width : (item.width?item.width:'100');
            }else{
              newItem.width = width ? width : (item.width?item.width:'100');
            }
            if (cellTemplate) {
              newItem.cellTemplate = cellTemplate;
            }
            if(hasFilter){
              newItem.filters = [{
                condition: uiGridConstants.filter.CONTAINS,
                placeholder: ''
              }];
            }
            newArray.push(newItem);
          }
          return newArray;
      } else {
          return [];
        }
      };
      this.getFilterParams = function(grid){
        var newsearchKey = {};

        angular.forEach(grid.columns, function(column, index) {
          if(column.filters && column.filters[0].term && column.filters[0].term.length > 0) {
            if(!column.filters[2].term){
              newsearchKey["in_"+column.field] = column.filters[0].term;
            }else{
              newsearchKey["nin_"+column.field] = column.filters[1].term;
            }
          }
        });
        return newsearchKey;
      }

      this.columnHasHide = function(girdName,field){

        if ( girdName ) {
          var array = localStorage.getItem(girdName) ?
            localStorage.getItem(girdName).split("________"):null;

          if(array){
            return (array.indexOf(field)!=-1);
          }else{
            return false;
          }
        }else{
          return false;
        }
      }
      this.zsZoomGridMenuCustomItems = function(){
       return [];
//
        return [
          {
            title: 'Check Less Columns',
            action: function ($event) {
              angular.forEach(this.grid.options.columnDefs,function(item){
                item.width *= 1.1;
              })
              this.grid.api.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
            },

            order: 212
          },
          {
            title : 'Check More Columns' ,
            action : function ( $event ) {
              angular.forEach(this.grid.options.columnDefs,function(item){
                item.width *= 0.9;
              })
              this.grid.api.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
            },
            order: 211
          }
        ];
      }
      this.columnVisibilityChanged =  function( changedColumn ) {

        var result = [];
        angular.forEach(changedColumn.grid.columns , function ( item ) {
          if ( !item.visible ) {
            result.push(item.field)
          }
        })
        var resultString = result.join("________");
        if ( changedColumn.grid.options.zsGridName ) {
          localStorage.setItem(changedColumn.grid.options.zsGridName , resultString);
        }

      }

        this.showLoadingView = function(text,callBack){
          $('#httploading').modal('show');
          $('#httploading').css('display','flex')
          $("#loadingText").text(text?text:"");
          // setTimeout(function(){
          //   // $('#httploading').modal('show');
          //   // $("#loadingText").text(text?text:"");
          //   if(callBack){
          //     callBack();
          //   }
          // },200);

        }

        this.hideLoadingView = function(){
          $("#loadingText").text("");
          $('#httploading').modal('hide');
          $('#httploading').css('display','none')

        }
        this.constructeColumnItem = function (displayname,name,field,hasFilter,cellTemplate,minwidth) {
            var  column =   {
            name: displayname,
            displayName: displayname,
            field: field,
              minwidth: width ? width : '100',
            enableCellEdit: false,
          }
          if (cellTemplate) {
            column.cellTemplate = cellTemplate;
          }
          if(hasFilter){
            column.filters = [{
              condition: uiGridConstants.filter.CONTAINS,
              placeholder: ''
            }];
          }
          return column;
        }
        this.hasPermission = function (pageID, permissionName){
          if (this.permissionCache[pageID] && this.permissionCache[pageID][permissionName] != undefined) {
            return this.permissionCache[pageID][permissionName];
          } else{
            try {
              if (this.menu && this.menu.length) {
                for (var i = 0; i < this.menu.length; i++) {
                  if (this.menu[i].url == pageID && this.menu[i].subMenus && this.menu[i].subMenus.length) {
                    for (var index = 0; index < this.menu[i].subMenus.length; index++) {
                      if (this.menu[i].subMenus[index].permission.indexOf(permissionName) > -1) {
                        if (!this.permissionCache[pageID]) {
                          this.permissionCache[pageID] = {};
                        }
                        this.permissionCache[pageID][permissionName] = true;
                        return true;
                      }
                    }
                  }
                }
              }
              if (!this.permissionCache[pageID]) {
                this.permissionCache[pageID] = {};
              }
              this.permissionCache[pageID][permissionName] = false;
              return false;
            } catch(e) {
              return false;
            }
          }
        }

    }]);



})();
