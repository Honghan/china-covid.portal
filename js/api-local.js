if (typeof qbb == "undefined"){
	var qbb = {};
}

(function($) {
	if(typeof qbb.inf == "undefined") {

		qbb.inf = {
			service_url: "https://honghan.info/semehr_ws/api",
			key: "covid-free-key",

			localModels: null,

			getLocalModel: function(cb){
				if (qbb.inf.localModels != null){
					cb(qbb.inf.localModels);
				}else{
					$.getJSON( "/data/sampleDSModels.json?v=1.2", function(obj) {
						qbb.inf.localModels = obj;
						cb(obj);
					});
				}
			},

			getModelList: function(dataset, searchCB){
				qbb.inf.getLocalModel(function (obj) {
					searchCB(qbb.inf.localModels);
				});
			},

			logisticRegressionCal: function(model, X){
				var sum = model["b0"];
				for (var k in model["b1"]){
					sum += model["b1"][k] * parseFloat(X[k]);
				}
				var pv = sum;
				console.log(pv);
				return 1 / (1 + Math.exp(-pv))
			},

			predict: function(dataset, modelId, caseDetails, searchCB){
				qbb.inf.getLocalModel(function (obj) {
					var predObj = qbb.inf.localModels;
					var models = predObj.models;
					for(var idx=0;idx<models.length;idx++){
						if (models[idx].id == modelId){
							console.log(caseDetails);
							searchCB({
								"outcome": models[idx].outcome,
								"riskGroups": models[idx]["risk_groups"],
								"prob": qbb.inf.logisticRegressionCal(models[idx], $.parseJSON(caseDetails))});
							break;
						}
					}
				});

				var apiName = "predict";
				var sendObject={
					r:apiName,
					key: qbb.inf.key,
					dataset: dataset,
					modelId: modelId,
					caseDetails: caseDetails
				};
				qbb.inf.callAPI(sendObject, function (s) {
					// do nothing
				});
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