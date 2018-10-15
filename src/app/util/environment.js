/**
 * Created by admin on 2017/5/9.
 */

//DEV
 var urlDEV = "http://10.0.0.212:8080/";

//var urlDEV = "http://112.74.191.64:8080/service/";
//LOCAL
var urlLOCAL = "http://localhost:12345/";
//var urlLOCAL = "http://bowkerwecareapp.azurewebsites.net/service/";
//SIT
var urlSIT = "http://52.229.205.22:8080/cpo/";
//UAT
var urlUAT = "https://bowkercpodev.azurewebsites.net/cpo/";
//PROD
var urlPROD = "http://bowkercpov2.azurewebsites.net/cpo/";
//PUBLIC
var urlPUBLIC = "http://120.77.214.38:8090/";

var urlALi="http://47.52.22.37:8080/service/";
var urlBasePortalAli="http://47.52.22.37:8080/baseportal/";
//Base Portal
var urlBasePortalDEV = "http://112.74.191.64:8080/baseportal/";
//LOCAL
//var urlBasePortalLOCAL = "http://52.229.205.22:8080/baseportal/";
//UAT
//var urlBasePortalLOCAL = "https://bowkerbaseportalapp.azurewebsites.net/baseportal/";
var urlBasePortalLOCAL = "http://bowkerbaseportalprod.azurewebsites.net/baseportal/";
//SIT
var urlBasePortalSIT = "http://52.229.205.22:8080/baseportal/";
//UAT
var urlBasePortalUAT = "https://bowkerbaseportalapp.azurewebsites.net/baseportal/";
//PROD
var urlBasePortalPROD = "http://bowkerbaseportalprod.azurewebsites.net/baseportal/";
//PUBLIC
var urlBasePortalPUBLIC = "http://120.77.214.38:8090/";

/*
 dev = 1
 uat = 2
 prod = 3
 */

if(typeof environment == "undefined") {
	var environment = {};
	environment.DEV = 1;
	environment.UAT = 2;
	environment.PROD = 3;
	environment.LOCAL = 4;
	environment.PUBLIC = 5;
	environment.SIT = 6;
	environment.ALI=7;
}

var CURRENT_ENVIRONMENT =  environment.LOCAL;

function getBaseURL() {
	switch(CURRENT_ENVIRONMENT) {
		case environment.DEV:
			return urlDEV;
		case environment.UAT:
			return urlUAT;
		case environment.PROD:
			return urlPROD;
		case environment.LOCAL:
			return urlLOCAL;
		case environment.PUBLIC:
			return urlPUBLIC;
		case environment.SIT:
			return urlSIT;
		case environment.ALI:
		    return urlALi;
	}

}
function getEnvironment() {
  switch(CURRENT_ENVIRONMENT) {
    case environment.DEV:
      return "DEV";
    case environment.UAT:
      return "UAT";
    case environment.PROD:
      return "PROD";
    case environment.LOCAL:
      return "LOCAL";
    case environment.PUBLIC:
      return "PUBLIC";
    case environment.SIT:
      return "SIT";
    case environment.ALI:
      return "ALI";
  }

}
function getBasePortalURL() {
	switch(CURRENT_ENVIRONMENT) {
		case environment.DEV:
			return urlBasePortalDEV;
		case environment.UAT:
			return urlBasePortalUAT;
		case environment.PROD:
			return urlBasePortalPROD;
		case environment.LOCAL:
			return urlBasePortalLOCAL;
		case environment.PUBLIC:
			return urlBasePortalPUBLIC;
		case environment.SIT:
			return urlBasePortalSIT;
		case environment.ALI:
			return urlBasePortalAli;
	}
}

function getEnvironmentTitle() {
	switch(CURRENT_ENVIRONMENT) {
		case environment.COMPANY:
			return "CPO-DEV";
		case environment.UAT:
			return "CPO-UAT";
		case environment.PROD:
			return "CPO";
		case environment.LOCAL:
			return "CPO";
		case environment.PUBLIC:
			return "CPO";
		case environment.SIT:
			return "CPO";
		case environment.ALI:
		    return "CPO";
	}
	return "未知环境";
}
