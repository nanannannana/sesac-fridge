if(result) {
    let resultObj = {};

    if(checkboxArr.length/2 == 1) { // 식재료가 한개일 때,
        for(var i=0;i<checkboxArr.length/2;i++) {
            resultObj = {
                "name" :  checkboxArr[i],
                "range" : checkboxArr[i+1]-50
            }
            resultData.push(resultObj);
        }
    }else {
        for(var i=0;i<=checkboxArr.length/2;i++) {
            if(i==0) {
                resultObj = {
                    "name" :  checkboxArr[0],
                    "range": checkboxArr[1]-50
                }
                resultData.push(resultObj);
                checkboxArr.splice(0,2);
                // console.log("resultData after push: ", resultData);
                // console.log("splice", checkboxArr.splice(0,2));
                // console.log("checkboxArr:", checkboxArr);
            }else if(i>0) {
                resultObj = {
                    "name" :  checkboxArr[0],
                    "range": checkboxArr[1]-50
                }
                resultData.push(resultObj);
                checkboxArr.splice(0,2);
            }
        }
    }
}