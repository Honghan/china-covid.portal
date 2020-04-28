if (typeof qbb == "undefined"){
	var qbb = {};
}

(function($) {
	if(typeof qbb.inf == "undefined") {

		qbb.inf = {
			key: "covid-free-key",

			localModels: null,

			getLocalModel: function(cb){
				if (qbb.inf.localModels != null){
					cb(qbb.inf.localModels);
				}else{
					$.getJSON( "/data/sampleDSModels.json", function(obj) {
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
			}
		};
	}
})(jQuery);