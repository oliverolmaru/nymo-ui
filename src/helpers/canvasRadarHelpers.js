export function drawCircleSector(ctx, centerX, centerY, startAngle, endAngle, radius, fill){
    let leftX = centerX + Math.cos(startAngle)*radius;
    let leftY = centerY + Math.sin(startAngle)*radius;
    let rightX = centerX + Math.cos(endAngle)*radius;
    let rightY = centerY + Math.sin(endAngle)*radius;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(leftX, leftY);
    ctx.arc(centerX,centerY,radius,startAngle,endAngle);
    ctx.moveTo(rightX,rightY);
    ctx.lineTo(centerX,centerY);
    ctx.fillStyle=fill;
    ctx.fill();
}

export function drawSimpleCircleSector(ctx, centerX, centerY, coverageDegrees, middleAngleDegrees, radius, fill){
    let coverageRad = coverageDegrees/180*Math.PI;
    let middleAngle = middleAngleDegrees/180*Math.PI;

    let startAngle = -1*coverageRad/2 - Math.PI/2 + middleAngle;
    let endAngle = coverageRad/2 - Math.PI/2 + middleAngle;

    drawCircleSector(ctx, centerX, centerY, startAngle, endAngle, radius, fill);
}


export function drawMeasurement(ctx, centerX, centerY, angle, radius, stroke){
    let endX = centerX + Math.cos(angle)*radius;
    let endY = centerY + Math.sin(angle)*radius;

    ctx.strokeStyle = stroke;
    //Line
    ctx.beginPath();       // Start a new path
    ctx.moveTo(centerX, centerY);    // Move the pen to (30, 50)
    ctx.lineTo(endX, endY);  // Draw a line to (150, 100)
    ctx.stroke();

    //Dot in the end
    ctx.beginPath();
    ctx.fillStyle=stroke;
    ctx.arc(endX,endY,2,0,2*Math.PI);
    ctx.fill();

}

export function drawRadarFromMeasurements(ctx, centerX, centerY, measurements, measurementsShown, stroke){
    let everyNth = Math.floor(measurements.length/measurementsShown);

    for(let i = 0; i < measurementsShown; i++){
        let angle = 2*Math.PI/measurementsShown * i - Math.PI/2;
        let dist = measurements[i*everyNth].distance;
        drawMeasurement(ctx, centerX, centerY, angle, dist, stroke);
    }
}