//Returns
// {
//     labels: [],
//     minimumData: [],
//     averageData: [],
//     maximumData: []
// }

export function roundToDecimal(value, noOfDecimalPoints){
    if(typeof(value) !== "number"){
        return value;
    }
    return Math.round(value*noOfDecimalPoints*10)/(noOfDecimalPoints*10);
}

export function generateData(logs, key){
    let startDate = (new Date(logs[0].timestamp)).getTime();
    const averageData = [];
    const minimumData = [];
    const maximumData = [];
    const labels = [];
    for(let i = 0; i < logs.length; i++){
      let timeDiff = ((new Date(logs[i].timestamp)).getTime() - startDate)/1000;

      //Do we expect a MinMax value
      if(typeof(logs[i][key]) === typeof(new Object())){
        averageData.push({
            x: timeDiff,
            y: roundToDecimal(logs[i][key].average, 2)
          })
          minimumData.push({
            x: timeDiff,
            y: roundToDecimal(logs[i][key].minimum, 2)
          })
          maximumData.push({
            x: timeDiff,
            y: roundToDecimal(logs[i][key].maximum, 2)
          })
      }
      else{
        averageData.push({
            x: timeDiff,
            y: logs[i][key]
          })
      }
      labels.push(Math.floor(timeDiff / 60).toString() + " min " + (timeDiff % 60).toString() + " s");
    }


    return {
        labels: labels,
        minimumData: minimumData,
        averageData: averageData,
        maximumData: maximumData
    }
}
