/**
 * Created by admin on 2017/5/9.
 */

//DEV
 var urlDEV = "http://10.0.0.212:8080/";

//var urlDEV = "http://112.74.191.64:8080/service/";
//LOCAL
// var urlLOCAL = "http://121.37.2.207:8080/cpo/";
var urlLOCAL = "http://localhost:12345/";
// var urlLOCAL = "https://mes-uat.bowkerasia.com/cpo/";
// var urlLOCAL = "http://localhost:8080/";
//var urlLOCAL = "http://bowkerwecareapp.azurewebsites.net/service/";
//SIT
var urlSIT = "http://52.229.205.22:8080/cpo/";
//UAT
var urlUAT = "https://mes-uat.bowkerasia.com/cpo/";
//var urlUAT = "https://bowkercpo-dev.azurewebsites.net/cpo/";
//PROD
var urlPROD = "https://mes.bowkerasia.com/cpo/";
//PUBLIC
var urlPUBLIC = "http://120.77.214.38:8090/";

var urlALi="http://47.52.22.37:8080/service/";
var urlDemo="http://zhimi0win.eastasia.cloudapp.azure.com:8087/cpo/";

var urlBasePortalAli="http://47.52.22.37:8080/baseportal/";
//Base Portal
var urlBasePortalDEV = "http://112.74.191.64:8080/baseportal/";
//LOCAL
//var urlBasePortalLOCAL = "http://52.229.205.22:8080/baseportal/";
//UAT
var urlBasePortalLOCAL = "https://baseportal.bowkerasia.com/baseportal/";
// var urlBasePortalLOCAL = "https://mes-uat.bowkerasia.com/baseportal/";
//SIT
var urlBasePortalSIT = "http://52.229.205.22:8080/baseportal/";
//UAT
var urlBasePortalUAT = "https://baseportal.bowkerasia.com/baseportal/";
// var urlBasePortalUAT = "https://baseportal.bowkerasia.com/baseportal/";
//PROD
var urlBasePortalPROD = "https://baseportal.bowkerasia.com/baseportal/";
//PUBLIC
var urlBasePortalPUBLIC = "http://120.77.214.38:8090/";
//PUBLIC
var urlBasePortalDemo = "http://zhimi0win.eastasia.cloudapp.azure.com:8080/baseportal/";

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
	environment.DEMO=8;
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
		case environment.DEMO:
		    return urlDemo;
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
	case environment.DEMO:
      return "";
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
		case environment.DEMO:
			return urlBasePortalDemo;
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
		case environment.DEMO:
		    return "CPO";
	}
	return "????????????";
}
