export function createSegments(Cesium, viewer, segments, index) {
  // 六色选择
  const colors = [
    Cesium.Color.ORANGE,
    Cesium.Color.PINK,
    Cesium.Color.YELLOW,
    Cesium.Color.AQUA,
    Cesium.Color.GREEN,
    Cesium.Color.PURPLE,
  ];
  let segment_entities = [];
  for (let i = 0; i < segments.length; i++) {
    let positions = [];
    segments[i].forEach((position) => {
      positions.push(
        Cesium.Cartesian3.fromDegrees(
          position.lon,
          position.lat,
          position.alt * 1000
        )
      );
    });

    // 创建任务线
    let polyline = viewer.entities.add({
      name: "卫星" + index + "-任务" + i,
      description: "<p>" + "任务" + i + "</p>",
      polyline: {
        positions: positions,
        width: 5,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: colors[i],
          outlineWidth: 0,
          outlineColor: null,
        }),
      },

      // 标签
      position: positions[0],
      label: {
        text: "卫星" + index + "-任务" + i,
        font: "14px sans-serif",
        showBackground: true,
        style: Cesium.LabelStyle.FILL,
        outlineWidth: 30,
        backgroundColor: new Cesium.Color.fromCssColorString("#8b8784"),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.CENTER, //对齐方式
        pixelOffset: new Cesium.Cartesian2(50, -50), //设置偏移量
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          200000,
          200000000
        ),
      },
    });
    segment_entities.push(polyline);
  }

  return segment_entities;
}
