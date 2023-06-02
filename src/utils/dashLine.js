export function createDashLine(Cesium, viewer, sPos, ePos) {
    // var TimeInterval = 60;
    // var midPos = new Cesium.SampledPositionProperty();
    // for (var i = 0; i < sPos.length; i++) {
    //     var time = Cesium.JulianDate.addSeconds(
    //         viewer.clock.currentTime,
    //         i * TimeInterval,
    //         new Cesium.JulianDate()
    //     );
    //     var pos1 = sPos.getValue(time, new Cesium.Cartesian3());
    //     var pos2 = sPos.getValue(time, new Cesium.Cartesian3());
    //     var pos3 = Cesium.Cartesian3.midpoint(pos1, pos2, new Cesium.Cartesian3());
    //     midPos.addSample(time, pos3);
    // }

    // var positions = new Cesium.PositionPropertyArray([sPos, midPos, ePos]);
    var positions = new Cesium.PositionPropertyArray([sPos, ePos]);

    //创建卫星连线
    var dashLine = viewer.entities.add({
        polyline: {
            positions: positions,
            width: 1.0,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.BLUE,
                dashLength: 8
            })
        }
    })

    return dashLine;
}