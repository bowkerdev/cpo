(function () {
  'use strict';

  angular
    .module('cpo')

    .controller('rootCtrl' , [ '$scope' , '$compile' , '$location' , '$http' , '$window' , '$translate' , '$timeout' , function ( $scope , $compile , $location , $http , $window , $translate , $timeout ) {
      var token = $location.search().token;


      $scope.rootColumnDef = {};
      $.ajax({
        url : "columns.json" ,
        dataType : 'json' ,
        success : function ( data ) {

          $scope.rootColumnDef = data;
        } ,
        error : function ( e ) {

          if ( e.status == 200 ) {

            $scope.rootColumnDef = JSON.parse(e.responseText);

          }
        }
      });


      if ( token && token.length > 0 ) {
        if ( window.localStorage ) {
          localStorage.setItem("token" , token);
        } else {
          Cookie.write("token" , token);
        }
        $http({
          method : "get" ,
          url : getBasePortalURL() + "api/token?" ,
          headers : {
            'Content-Type' : 'application/json;charset=UTF-8' ,
            'Accept-Language' : 'zh-CN' ,
            'Authorization' : "Bearer " + token
          }
        })
          .success(function ( data ) {

            $scope.userinfo = data.userinfo;

            if ( data.userinfo ) {
              $scope.avatarStyle = {
                "background-image" : "url(" + data.userinfo.pic + ")"
              }
            }

          })
          .error(function ( data ) {
            window.history.back();

          })
      }
      //else{
      //  window.history.back();
      //}

      $scope.homeUrl = 'app/worktable/worktable.html';
      $scope.homeId = 'homePage';

      $scope.page = {};
      $scope.pageTab = [];
      $scope.activePage;
      $scope.dynmicHeight = function () {

        //
        var style = this.getLeftSpaceHeight();

        return style;//{height:"1000px"};
      }
      $scope.openTab = function ( pageID , pageUrl , pageTitle ) {
        if ( !pageID ) return;
        if ( null == $scope.page[ pageID ] ) {
          //Tab数组
          $scope.pageTab.push({
            "pageID" : pageID ,
            "pageUrl" : pageUrl ,
            "pageTitle" : pageTitle
          });
          $scope.activePage = pageID;
          $scope.page[ pageID ] = pageUrl;

          if ( $('.page-show').length ) {
            $('.page-show').removeClass('page-show');
          }

          //通过$compile动态编译html
          var html = '<div id="' + pageID + '" class="page-init-hide" ng-class="{\'page-show\':activePage===\'' + pageID + '\'}" ng-include=\'"' + pageUrl + '"\'></div>';
          var template = angular.element(html);
          var mobileDialogElement = $compile(template)($scope);
          angular.element(document.getElementById('main-view')).append(mobileDialogElement);
          resizeNavTab();
        }
      }

      $scope.removeTab = function ( pageID ) {
        if ( null != $scope.page[ pageID ] ) {
          angular.element(document.getElementById(pageID)).remove();
          $scope.page[ pageID ] = null;
          var i = 0;
          for ( ; i < $scope.pageTab.length ; i++ ) {
            if ( $scope.pageTab[ i ].pageID == pageID ) {
              $scope.pageTab.splice(i , 1);
              break;
            }
          }

          if ( null == document.getElementById($scope.activePage) && null != $scope.pageTab && $scope.pageTab.length ) {
            $scope.activePage = $scope.pageTab[ i < $scope.pageTab.length ? i : $scope.pageTab.length - 1 ].pageID;
          }
          resizeNavTab();
        }
      }

      $scope.closeAllTab = function () {
        document.getElementById('main-view').innerHTML = "";
        $scope.$broadcast("view.destory" , null);
        $scope.page = {};
        $scope.pageTab = [];
        $scope.openTab('homePage' , 'app/worktable/worktable.html' , "Work Table");
        $scope.focusPage('homePage');

      }

      $scope.resizeNavTabWhileMenuResize = function () {
        setTimeout(function () {
          resizeNavTab();
        } , 100);
      }

      $scope.focusPage = function ( pageID ) {
        if ( !pageID ) return;
        $scope.activePage = pageID;
        if ( pageID == 'homePage' ) {
          $scope.$broadcast("view.show" , null);
        }
      }

      $scope.refreshToken = function () {

        var timeStamp = dateTimeFormat(new Date());
        //				var userName = "WeCAREC001";
        var userName = "BVN001";
        var pwd = "123456";
        var newPassword = SHA256(pwd);
        var signStr = SHA256(userName + newPassword + timeStamp + userName);
        var requestData = {
          'timestamp' : timeStamp ,
          'userName' : userName ,
          'sign' : signStr
        };

        var str = $.param(requestData);
        $http({
          method : 'POST' ,
          url : getBasePortalURL() + "api/authorize" ,
          data : $.param(requestData) ,
          headers : {
            'Accept-Language' : 'zh-CN' ,
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
        })
          .success(function ( data ) {

            if ( window.localStorage ) {
              localStorage.setItem("token" , data.token);
            } else {
              Cookie.write("token" , data.token);
            }
            $scope.init();

          })
          .error(function ( data , status , headers , config ) {
            if ( DebugLog ) {

            }
            $scope.init();
          })

      }
      //用于修复IE10、IE11浏览器模态框不居中
      window.onload=function(){
          if(isIE10_11()){
            var head=document.getElementsByTagName('head')[0];
            var link=document.createElement('link');
            link.rel="stylesheet";
            link.href="ie-modal-location.css";
            head.appendChild(link);
        }
      }
      function initMenu() {


        var list = [
          {
          "name" : "Work Table" ,
          "url" : "app/worktable/worktable.html" ,
          "icon" : "fa fa-table"
        } ,
          {
            "name" : "Factory Adjustment" ,
            "url" : "app/factorymaster/factoryadjustment.html" ,
            "icon" : "fa fa-adjust"
          } ,
          {
            "name" : "Capacity Management" ,
            "url" : "app/factorymaster/factorycapacity.html" ,
            "icon" : "fa fa-beer",
            "menuid":"9999"
          } ,
          {
            "name" : "Criteria Management" ,
            "url" : "app/criteria/criteria.html" ,
            "icon" : "fa fa-cogs"
          } ,
          {
            "name" : "Working No.Master" ,
            "url" : "app/workingno/workingno.html" ,
            "icon" : "fa fa-cube"
          } ,
          {
            "name" : "Factory Master" ,
            "url" : "app/factorymaster/factorymaster.html" ,
            "icon" : "fa fa-university" ,
            "subMenus" : [ {
              "name" : "Factory & Site" ,
              "url" : "app/factorymaster/factorymaster.html" ,
              "icon" : "fa fa-home" ,
              "menuid" : "100001"
            } ,
              {
                "name" : "Process Master" ,
                "url" : "app/processmaster/processmaster.html" ,
                "icon" : "fa fa-home" ,
                "menuid" : "100002"
              }

            ]
          } ,
          {
            "name" : "Customer Master" ,
            "url" : "app/customerMaster/customerMaster.html" ,
            "icon" : "fa fa-user-circle-o"
          } ,
          {
            "name" : "Assignment History" ,
            "url" : "app/assignmenthistory/assignmenthistory.html" ,
            "icon" : "fa fa-calendar-times-o"
          }
          ,
          {
            "name" : "Document Lib" ,
            "url" : "app/documentlibrary/documentlibrary.html" ,
            "icon" : "fa fa-file"
          }
          ,
          {
            "name" : "Report Management" ,
            "url" : "app/report/worktablereport.html" ,
            "icon" : "fa fa-bar-chart"
          } ,
          {
            "name" : "Base Data Setup" ,
            "url" : "app/basedatasetup/basedatasetup.html" ,
            "icon" : "fa fa-check-square-o",

          },
          {
            "name" : "Vendor KPI Report" ,
            "url" : "app/vendorkpi/reportrequirement.html" ,
            "icon" : "fa fa-area-chart"
          },
          // {
          //   "name" : "Season Date Range Setting" ,
          //   "url" : "app/seasondaterangesetting/seasondaterangesetting.html" ,
          //   "icon" : "fa fa-bar-chart"
          // }
        ];

        for ( var i = 0 ; i < list.length ; i++ ) {
          if ( i == 2 ) continue;
          list[ i ].menuid = 10000 + i;
        }
        $scope.navList = list;
      }

      function translateUndone( language ) {


        var myurl = 'assets/i18n/locale-' + language + '.json';
        return $http({
          method : 'GET' ,
          url : myurl
        })
          .success(function ( data , status , headers , config ) {
            if ( data && data.index && data.index.WORK_TABLE ) {
              $scope.translateHomeTitle = data.index.WORK_TABLE;
            } else {
              $scope.translateHomeTitle = 'Work Table';
            }
            $timeout(function () {
              $scope.openTab('homePage' , 'app/worktable/worktable.html' , $scope.translateHomeTitle);
              $scope.focusPage('homePage');
            } , 1000);
          })
          .error(function ( data , status , headers , config ) {
            $scope.translateHomeTitle = 'Work Table';
            $scope.openTab('homePage' , 'app/worktable/worktable.html' , $scope.translateHomeTitle);
            $scope.focusPage('homePage');
          })
      }

      $scope.setupMenu = function ( length , index ) {
        if ( length >= index + 1 ) {
          setup_sidebar_menu();
        }
      };

      $scope.init = function () {

        angular.element("#envirommentA").text(getEnvironment());
        angular.element("#envirommentB").text(getEnvironment());
        var token = window.localStorage ? localStorage.getItem("token") : Cookie.read("token");
        $http({
          method : "get" ,
          url : getBasePortalURL() + "api/permission?platform=4&type=&roleid=" ,
          headers : {
            'Content-Type' : 'application/json;charset=UTF-8' ,
            'Accept-Language' : 'zh-CN' ,
            'Authorization' : "Bearer " + token
          }
        })
          .success(function ( data ) {
            if(data.rows&&data.rows.length>0){
              $scope.navList = data.rows;
            }else{
              if ( CURRENT_ENVIRONMENT == environment.SIT || CURRENT_ENVIRONMENT == environment.LOCAL ) {
              	initMenu();
              }
            }

            //test

            // $scope.navList =  [{
            //   "name" : "Vendor KPI Report" ,
            //   "url" : "app/vendorkpi/reportrequirement.html" ,
            //   "icon" : "fa fa-area-chart"
            // }];



            if ( $translate.instant('index.WORK_TABLE') == 'index.WORK_TABLE' ) {
              var language = findLanguage();
            //  translateUndone(language);


              var myurl = 'assets/i18n/locale-' + language + '.json';
              return $http({
                method : 'GET' ,
                url : myurl
              })
                .success(function ( data , status , headers , config ) {
                  if ( data && data.index && data.index.WORK_TABLE ) {
                    $scope.translateHomeTitle =  $scope.navList[0].name;
                  } else {
                    $scope.translateHomeTitle =  $scope.navList[0].name;
                  }
                  $timeout(function () {
                    $scope.openTab('homePage' , $scope.navList[0].url , $scope.translateHomeTitle);
                    $scope.focusPage('homePage');
                  } , 1000);
                })
                .error(function ( data , status , headers , config ) {
                  $scope.translateHomeTitle = $scope.navList[0].name;
                  $scope.openTab('homePage' , $scope.navList[0].url , $scope.translateHomeTitle);
                  $scope.focusPage('homePage');
                })



            } else {
              $scope.translateHomeTitle = $scope.navList[0].name;
              $scope.openTab('homePage' , $scope.navList[0].url , $scope.translateHomeTitle);
              $scope.focusPage('homePage');
            }

          })
          .error(function ( data ) {
          	if ( CURRENT_ENVIRONMENT == environment.SIT || CURRENT_ENVIRONMENT == environment.LOCAL ) {
              	initMenu();
              }
          })

        $http({
          method : "get" ,
          url : getBasePortalURL() + "api/token?" ,
          headers : {
            'Content-Type' : 'application/json;charset=UTF-8' ,
            'Accept-Language' : 'zh-CN' ,
            'Authorization' : "Bearer " + token
          }
        })
          .success(function ( data ) {

            $scope.userinfo = data.userinfo;
          })
          .error(function ( data ) {
            window.history.back();

          });


      }

      function onResize( e ) {
        resizeNavTab();
      }

      function resizeNavTab() {
        var width = (($('#navigationTabbr').width() / $scope.pageTab.length) - 58);
        if ( width < 10 ) width = 10;
        width = width + "px";
        $scope.widthArray = {
          "width" : width
        }
      }


      angular.element($window).bind('resize' , onResize);

      if ( CURRENT_ENVIRONMENT == environment.DEV || CURRENT_ENVIRONMENT == environment.SIT || CURRENT_ENVIRONMENT == environment.LOCAL ) {

        $scope.refreshToken();
      } else {

        $scope.init();
      }

      //

    } ])

})();
