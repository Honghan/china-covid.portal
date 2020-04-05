if (typeof qbb == "undefined"){
	var qbb = {};
}

(function($) {
	if(typeof qbb.inf == "undefined") {

		qbb.inf = {
			service_url: "https://honghan.info/semehr_ws/api",
			// service_url: "http://localhost:8080/webportal/api",
			key: "covid-free-key",

			getModelList: function(dataset, searchCB){
				var apiName = "getModelList";
				var sendObject={
						r:apiName,
	                    key: qbb.inf.key,
	                    dataset: dataset
				};
				qbb.inf.callAPI(sendObject, searchCB);
			},

			predict: function(dataset, modelId, caseDetails, searchCB){
				var apiName = "predict";
				var sendObject={
					r:apiName,
					key: qbb.inf.key,
					dataset: dataset,
					modelId: modelId,
					caseDetails: caseDetails
				};
				qbb.inf.callAPI(sendObject, searchCB);
			},

			callAPI: function(sendObject, cb){
				qbb.inf.ajax.doPost(sendObject, function(s){
					var ret = s;
					if (ret && ret.status == "200" && ret.data)
					{
						if (typeof cb == 'function')
							cb(ret.data);
					}else
					{
						if (typeof cb == 'function')
							cb();
					}
				}, function(){
					if (typeof checkOutDataCB == 'function')checkOutDataCB();
				});
			},

			ajax: {
					doGet:function(sendData,success,error){
						qbb.inf.ajax.doSend("Get",null,sendData,success,error);
					},
					doPost:function(sendData,success,error){
						qbb.inf.ajax.doSend("Post",null,sendData,success,error);
					},
					doSend:function(method,url,sendData,success,error){
						dataSuccess = function(data){
							(success)(eval(data));
						};
						if (sendData) sendData.token = "";
						jQuery.ajax({
							   type: method || "Get",
							   url: url || qbb.inf.service_url,
							   data: sendData || [],
							   cache: false,
							   dataType: "jsonp", /* use "html" for HTML, use "json" for non-HTML */
							   success: dataSuccess /* (data, textStatus, jqXHR) */ || null,
							   error: error /* (jqXHR, textStatus, errorThrown) */ || null
						});
					}
			}
		};
	}
})(jQuery);