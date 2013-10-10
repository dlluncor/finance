var cityparser = {};

cityparser.getCity = function(message){
    var cities = ["San Francisco", "San Jose", "Los Angeles"];
    var dateVer1 =/(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/g;
    var dateVer2 =/([1-9])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/g;

    var startDate = null;
    var endDate = null;
    var targetLocation = null;

    var city_found = 0;
    var date_found = 0;
    var dates = [];

    /* find start and end dates */
    if((dates = (message.match(dateVer1)))){
        if(dates.length == 2){
            var compA = parseInt(dates[0].substr(6,10));
            var compB = parseInt(dates[1].substr(6,10));
            if(compA != compB){
                if(compA > compB){
                    startDate = dates[1];
                    endDate = dates[0];
                }else if(compA < compB) {
                    startDate = dates[0];
                    endDate = dates[1];
                }
            }else{
                compA = parseInt(dates[0].substr(0,2));
                compB = parseInt(dates[1].substr(0,2));
                if(compA != compB){
                    if(compA != compB){
                        if(compA > compB){
                            startDate = dates[1];
                            endDate = dates[0];
                        }else if(compA < compB) {
                            startDate = dates[0];
                            endDate = dates[1];
                        }
                    }
                }else{

                    compA = parseInt(dates[0].substr(3,5));
                    compB = parseInt(dates[1].substr(3,5));
                    if(compA != compB){
                        if(compA > compB){
                            startDate = dates[1];
                            endDate = dates[0];
                        }else if(compA < compB) {
                            startDate = dates[0];
                            endDate = dates[1];
                        }
                    }
                }
            }
            date_found = 1;
        }
    }

    /* find locations */
    cities.some(function(str) {
        if(message.toLowerCase().indexOf(str) >= 0 || message.indexOf(str) >= 0){
            targetLocation = str;
            found = 1;
        }
    })
    return {
        'startDate': startDate,
        'endDate': endDate,
        'toLocation': targetLocation
    };
};