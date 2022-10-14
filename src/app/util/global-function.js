var DebugLog = true;
var transferDateKey = ["createDate", "publishTime", "editTime", "validityFrom", "validityTo", "approveTime", "voteTime", "utcUpdate", "utcCreate", "createdate", "planDate", "orderReleaseDate", "requestTransferMonthFrom", "requestTransferMonthTo", "releaseDate", "remarkDate", 'byReadyDate', 'createdDate', 'fpdMidEnd', 'psddMidEnd', 'originalLc0190Date', 'crdMidOrEnd', 'pdMidOrEnd', 'crdPdMidOrEnd', 'lc0190Date', 'shortageImportDate'];
var transferSimpleDateKey = ["startTime", "endTime", "firstProdDate", "lastProdDate", "planDate", "poBatchDate", "requestDate", "psdd", "podd", 'customerRequestDate', 'psddFactory', 'fpd', 'fpdFactory', 'factoryPodd', 'customerRequestDateCs', "orderReleaseDate", "pvMonth", "toPvMonth", 'byReadyDate', 'byReady', 'latestFabricPiEta', 'latestTrimPiEta', 'fabricPiDate', 'etd', 'byReady', 'orderDate', 'poBatchDate', 'byReadyDate', 'createdDate', 'originalLc0190Date'];
var transferFixTo2NumberKey = ["ttlSmv"];
var splitThrousandCount = ["totalQty"];
var pageStatus = {
	"EDIT": "EDIT",
	"VIEW": "VIEW"
}

function getMonths(fromMonth, toMonth) {
	var param = new Array();
	if(fromMonth && toMonth) {
		var fromDateArray = fromMonth.split('-');
		var toDateArray = toMonth.split('-');
		var fromYear;
		var fromMonth;
		var toYear;
		var toMonth;
		if(fromDateArray && fromDateArray.length > 1) {
			fromYear = fromDateArray[0];
			fromMonth = fromDateArray[1];
		} else {
			return null;
		}

		if(toDateArray && toDateArray.length > 1) {
			toYear = toDateArray[0];
			toMonth = toDateArray[1];
		} else {
			return null;
		}

		if(fromYear == toYear) {
			for(var month = fromMonth; month <= toMonth && month <= 12; month++) {
				param.push(fromYear.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
			}
		} else {
			for(var year = fromYear; year <= toYear; year++) {
				if(year == fromYear) {
					for(var month = fromMonth; month <= 12; month++) {
						param.push(year.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
					}
				} else if(year == toYear) {
					for(var month = 1; month <= toMonth && month <= 12; month++) {
						param.push(year.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
					}
				} else {
					for(var month = 1; month <= 12; month++) {
						param.push(year.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
					}
				}
			}
		}

		if(param && param.length) {
			return param.join(',')
		} else {
			return null;
		}
	} else if((!fromMonth && toMonth) || (fromMonth && !toMonth)) {
		return null;
	} else {
		return null;
	}
}

function GLOBAL_Http($http, url, method, data, successCallBack, errorCallBack) {
	var token = window.localStorage ? localStorage.getItem("token") : Cookie.read("token");

	// for(var a in data){
	//     if(data[a]){
	//       data[a] = encodeURIComponent(data[a]);
	//     }
	// }
	var myUrl = "";
	if(method == "GET") {
		var array = new Array();
		//		data['noCacheTimeStamp']=new Date().getTime();
		//		console.log(data);
		var existAttr = false;
		for(var a in data) {
			if(data[a] != null && data[a] !== '') {
				array.push(a + "=" + data[a]);
				existAttr = true;
			}

		}
		if(existAttr) {
			//			array.push('noCacheTimeStamp=' + new Date().getTime());
		}
		var string = array.join("&");

		myUrl = getBaseURL() + url + string;
	} else {
		myUrl = getBaseURL() + url;
	}
	myUrl = encodeURI(myUrl);
	myUrl = myUrl
		// .replace(/;/g,encodeURIComponent(";"))
		// .replace(/\?/g,encodeURIComponent("?"))
		// .replace(/:/g,encodeURIComponent(":"))
		// .replace(/@/g,encodeURIComponent("@"))
		// .replace(/&/g,encodeURIComponent("&"))
		// .replace(/=/g,encodeURIComponent("="))
		.replace(/\+/g, encodeURIComponent("+"))
	// .replace(/$/g,encodeURIComponent("$"))
	// .replace(/,/g,encodeURIComponent(","))
	// .replace(/#/g,encodeURIComponent("#"));
	//;/?:@&=+$,#
	//myUrl.replace()

	return $http({
			method: method,
			url: myUrl,
			cache: false,
			data: data,
			timeout: 1000 * 60 * 10,
			headers: {
				"pragma": "no-cache",
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json;charset=UTF-8',
				'Accept-Language': 'en-US',
				'Authorization': 'Bearer ' + token
			}
		})
		.success(function(data, status, headers, config) {
			if(DebugLog) {
				// console.log(data);
				// console.log("status code:" + status);
				// console.log(config);
			}
			successCallBack(data);
		})
		.error(function(data, status, headers, config) {
			if(DebugLog) {
				// console.log(data);
				// console.log("status code:" + status);
				// console.log(config);
			}
			if(!data) {
				var language;
				try {
					language = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 5);
				} catch(e) {
					language = "en-GB";
				}

				if(language === 'zh-CN')
					data = '连接失败,请稍后重试';
				else if(language === 'en-GB')
					data = 'The connection fails, please try again later';
			}
			errorCallBack(data);
		})
}

function export_path(data, url) {
	var array = new Array();
	for(var a in data) {
		array.push(a + "=" + data[a]);
	}
	var string = array.join("&");
	var myUrl = getBaseURL() + url + string;
	return myUrl;
}

function GLOBAL_Http_UploadFile($http, url, data, successCallBack, errorCallBack) {
	var token = window.localStorage ? localStorage.getItem("token") : Cookie.read("token");
	return $http({
			method: "POST",
			url: getBaseURL() + url,
			timeout: 1000 * 60 * 10,
			data: data,
			headers: {
				'Content-Type': undefined,
				'Accept-Language': findLanguage(),
				'Authorization': 'Bearer ' + token
			}
		})
		.success(function(data) {
			successCallBack(data);
		})
		.error(function(data) {
			errorCallBack(data);
		})
}

function getToken() {
	return token;
}

function dateTimeFormat(timestamp) {
	if(!timestamp) {
		return "";
	}
	var date = new Date();
	date.setTime(timestamp);
	return date.Format("yyyy/MM/dd");
}

function dateTimeDetailFormat(timestamp) {
	if(!timestamp) {
		return "";
	}
	var date = new Date();
	date.setTime(timestamp);
	return date.Format("yyyy/MM/dd HH:mm:ss");
}

function dateFormat(timestamp) {
	if(!timestamp) {
		return "";
	}
	var date = new Date();
	date.setTime(timestamp);
	return date.Format("yyyy/MM/dd");
}

function transferDateToTimeStamp(dateTimeString) {
	return Date.parse(dateTimeString.replace(/-/g, "/"));
}

function simpleDateFormat(timestamp) {
	if(!timestamp) {
		return;
	}
	var date = new Date();
	// new Date(timestamp).toLocaleDateString()
	date.setTime(timestamp);
	return date.Format("yyyy/MM/dd");

}

function translateData(rows) {
	if(!rows) {
		return null;
	}

	for(var i = 0; i < rows.length; i++) {
		var dataSource = rows[i];
		for(var key in dataSource) {
			var value = dataSource[key];
			if(transferDateKey.indexOf(key) > -1) {
				if(value)
					rows[i][key] = dateFormat(value);
			} else if(transferSimpleDateKey.indexOf(key) > -1) {
				if(value)
					rows[i][key] = simpleDateFormat(value);
			} else if(splitThrousandCount.indexOf(key) > -1) {
				if(value) {
					rows[i][key] = splitCount(value);
				}
			} else if(transferFixTo2NumberKey.indexOf(key) > -1) {

				rows[i][key] = value ? value.toFixed(2) : 0;
			}

		}
	}
	return rows;
}

function translateRecodeData(rows, statusMap1, statusMap2) {
	for(var i = 0; i < rows.length; i++) {
		var dataSource = rows[i];
		for(var key in dataSource) {
			var value = dataSource[key];
			if(transferDateKey.indexOf(key) > -1) {
				if(value)
					rows[i][key] = dateFormat(value);
			} else if(transferSimpleDateKey.indexOf(key) > -1) {
				if(value)
					rows[i][key] = simpleDateFormat(value);
			} else if(key == "scheduleStatus") {
				if(statusMap1) {
					if(statusMap1[rows[i][key]]) {
						rows[i][key] = statusMap1[rows[i][key]];

					}
				}
			} else if(key == "studyStatus") {
				if(statusMap2) {
					if(statusMap2[rows[i][key]]) {
						rows[i][key] = statusMap2[rows[i][key]];

					}
				}
			}
		}
	}
	return rows;
}

function translateOutputData(dataSource, statusMap) {
	for(var key in dataSource) {
		var value = dataSource[key];
		if(transferDateKey.indexOf(key) > -1) {
			if(value)
				dataSource[key] = dateFormat(value);
		} else if(transferSimpleDateKey.indexOf(key) > -1) {
			if(value)
				dataSource[key] = simpleDateFormat(value);
		} else if(key == "status") {
			if(statusMap) {
				if(statusMap[dataSource[key]]) {
					dataSource[key] = statusMap[dataSource[key]];
				}
			}
		}
	}
	return dataSource;
}

Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

String.prototype.format = function(args) {
	var result = this;
	if(arguments.length > 0) {
		if(arguments.length == 1 && typeof(args) == "object") {
			for(var key in args) {
				if(args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		} else {
			for(var i = 0; i < arguments.length; i++) {
				if(arguments[i] != undefined) {
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
}

/*
 * service:需添加的依赖Commonservice
 * modalType:弹出框的样式
 *           0: confirm ；1：warning ；2：alert ；3： error
 * message：提示信息
 * callBack：确定按钮的回调函数,无回调设置为null
 *
 * */
function modalAlert(service, modalType, message, callBack,cancelCB) {

	var confirmModalInstance = service.outputCommonModal(modalType, message);
	confirmModalInstance.result.then(callBack,cancelCB);
}

/**
 * Created by mac on 2017/8/24.
 */

function sortParams(sortColumns, finishBlock) {
	if(sortColumns && sortColumns[0]) {
		if(sortColumns[0].field && sortColumns[0].sort && sortColumns[0].sort.direction) {
			if(finishBlock) {

				finishBlock(sortColumns[0].field, sortColumns[0].sort.direction);
			}
		} else {
			if(finishBlock) {
				finishBlock(null, null);
			}
		}
	} else {
		finishBlock(null, null);
	}
}

/*
 * 动态引入script
 * */
function scriptTemplet(src, par) {
	for(var i = 0; i < src.length; i++) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = src[i];
		par.appendChild(script);
	}
}
/*
 * 获取文件后缀名
 * */
function getFileType(fileName) {
	var index1 = fileName.lastIndexOf(".");
	var index2 = fileName.length;
	var suffix = fileName.substring(index1 + 1, index2); //后缀名
	return suffix;
}

/**
 *
 *  Secure Hash Algorithm (SHA256)
 *  http://www.webtoolkit.info/
 *
 *  Original code by Angel Marin, Paul Johnston.
 *
 **/

function SHA256(s) {

	var chrsz = 8;
	var hexcase = 0;

	function safe_add(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return(msw << 16) | (lsw & 0xFFFF);
	}

	function S(X, n) {
		return(X >>> n) | (X << (32 - n));
	}

	function R(X, n) {
		return(X >>> n);
	}

	function Ch(x, y, z) {
		return((x & y) ^ ((~x) & z));
	}

	function Maj(x, y, z) {
		return((x & y) ^ (x & z) ^ (y & z));
	}

	function Sigma0256(x) {
		return(S(x, 2) ^ S(x, 13) ^ S(x, 22));
	}

	function Sigma1256(x) {
		return(S(x, 6) ^ S(x, 11) ^ S(x, 25));
	}

	function Gamma0256(x) {
		return(S(x, 7) ^ S(x, 18) ^ R(x, 3));
	}

	function Gamma1256(x) {
		return(S(x, 17) ^ S(x, 19) ^ R(x, 10));
	}

	function core_sha256(m, l) {
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;

		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;

		for(var i = 0; i < m.length; i += 16) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];

			for(var j = 0; j < 64; j++) {
				if(j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));

				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}

			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}

	function str2binb(str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
		}
		return bin;
	}

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for(var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if(c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	}

	function binb2hex(binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
				hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
		}
		return str;
	}

	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}

function exportExcel(paramObj, path, suffix) {
	paramObj['language'] = 'zh';
	paramObj['lang'] = 'zh_CN';
	window.open(export_path(paramObj, path), suffix);
}

function formatStratTime(startTime) {
	var startTime_str;
	startTime_str = startTime + " 00:00:00";
	return transferDateToTimeStamp(startTime_str);
}

function formatEndTime(endTime) {
	var endTime_str;
	endTime_str = endTime + " 23:59:59";
	return transferDateToTimeStamp(endTime_str);
}

// browser language
function findLanguage() {
	try {
		var lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 5);
		if(lang != 'zh-CN' && lang != 'en-US' && lang != 'en-GB') {
			return 'en-US';
		} else {
			return lang;
		}

	} catch(e) {
		return "en-US";
	}
}

function fix(num, length) {
	return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

function listToString(list, field) {
	var str = "";
	for(var i = 0; i < list.length; i++) {
		if(list[i][field]) {
			str += list[i][field] + ",";
		}
	}
	if(str) {
		return str.substring(0, str.length - 1);
	} else {
		return "";
	}
}

function listToString2(list, field, splitType) {
	var str = "";
	for(var i = 0; i < list.length; i++) {
		if(list[i][field]) {
			str += list[i][field] + splitType;
		}
	}
	if(str) {
		return str.substring(0, str.length - splitType.length);
	} else {
		return "";
	}
}

function stringListToString(list) {
	var str = "";
	for(var i = 0; i < list.length; i++) {
		if(list[i]) {
			str += list[i] + ",";
		}
	}
	if(str) {
		return str.substring(0, str.length - 1);
	} else {
		return "";
	}
}

function isFloat(num) {
	var re = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
	return re.test(num);
}

this.judgeDifferent = function(listAAA, listBBB, idFieldName, MonthFieldName, idFieldName2, capacityFieldName) {
	var differentList = [];
	for(var i = 0; i < listAAA.length; i++) {
		for(var j = 0; j < listBBB.length; j++) {
			if(listAAA[i][idFieldName] == listBBB[j][idFieldName]) {
				if(capacityFieldName) {
					// var data = {};
					for(var z = 0; z < listAAA[i][MonthFieldName].length; z++) {
						for(var k = 0; k < listBBB[j][MonthFieldName].length; k++) {
							var listAAACapacity = listAAA[i][MonthFieldName][z];
							var listBBBCapacity = listBBB[i][MonthFieldName][k];
							if(listAAACapacity[idFieldName2] == listBBBCapacity[idFieldName2]) {
								if(listAAACapacity[capacityFieldName] != listBBBCapacity[capacityFieldName]) {
									// if(!data[idFieldName]) data[idFieldName] = listAAA[i][idFieldName];
									// if(!data[MonthFieldName]) data[MonthFieldName] = [];
									// data[MonthFieldName].push(listAAACapacity);
									differentList.push(listAAACapacity);
								}
								break;
							}
						}
					}
					// if(!isEmptyObject(data)){
					//   differentList.push(data);
					// }
				} else if(listAAA[i][MonthFieldName] != listBBB[j][MonthFieldName]) {
					var data = {};
					data[idFieldName] = listAAA[i][idFieldName];
					data[MonthFieldName] = listAAA[i][MonthFieldName];
					differentList.push(data);
				}
				break;
			}
		}
	}
	return differentList;
}

this.compareListOpType = function(scope, ListAAA, ListBBB, field) {
	var opType = {
		"ADD": 1,
		"DELETE": 2,
		"UPDATE": 3
	}
	var InList = [];
	for(var i = 0; i < ListAAA.length; i++) {
		//增加
		ListAAA[i].sort = i;
		if(!ListAAA[i][field]) {
			ListAAA[i].opType = opType.ADD;
		}
		if(ListBBB) {
			for(var j = 0; j < ListBBB.length; j++) {
				if(ListBBB[j][field] == ListAAA[i][field]) {
					ListAAA[i].opType = opType.UPDATE;
					InList.push(ListBBB[j]);
					break;
				}
			}
		}
	}

	//删除
	if(ListBBB) {
		for(var a = 0; a < ListBBB.length; a++) {
			if(InList.length == 0 || InList.indexOf(ListBBB[a]) == -1) {
				ListBBB[a].opType = opType.DELETE;
				ListAAA.push(ListBBB[a]);
			}
		}
	}
};

function isEmptyObject(e) {
	for(var t in e)
		return !1;
	return !0
}

function isDot(num) {
	var result = (num.toString()).indexOf(".");
	if(result != -1) {
		return true;
	} else {
		return false;
	}
}

function scrollGuild(id, height) {
	jQuery(id).animate({
		scrollTop: height
	}, 1000);
}
var specialCharSet = {
	'\\*': '%2A',
	'\\+': '%2B',
	'\\-': '%2D',
	'\\/': '%2F',
	'\\?': '%3F',
	'\\%': '%25',
	'\\#': '%23',
	'\\&': '%26',
	'\\=': '%3D',
	' ': '%20'
}

function urlCharTransfer(charSet) {
	//console.log(charSet);
	//	for(var key in specialCharSet){
	//		if(charSet.indexOf(key)>=0){
	//			charSet=charSet.replace(key,specialCharSet[key]);
	//		}
	//	}
	//console.log(charSet);
	return charSet;
}

function splitCount(count) {
	if(!isNaN(count)) {

		var parts = count.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts[0] ;

	} else {
		return count;
	}
}

function IEVersion() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
	var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
	var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
	if(isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if(fIEVersion == 10) {
			return "IE10";
		}
	} else if(isIE11) {
		return "IE11"; //IE11
	} else {
		return -1;
	}
}

function isIE10_11() {
	if(IEVersion() != -1) {
		return true;
	}
	return false;
}

var scroll_bar_width;

function calcScrollBarWidth () {
  if (scroll_bar_width !== undefined) return scroll_bar_width;

  var outer = document.createElement('div');
  outer.style.height = '100%';
  outer.style.overflow = 'auto';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  var inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  var widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scroll_bar_width =  widthNoScroll - widthWithScroll;

  return scroll_bar_width;
}