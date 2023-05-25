export function createSegments(Cesium, viewer, segments) {
  // 六色选择
  const colors = [
    Cesium.Color.ORANGE,
    Cesium.Color.PINK,
    Cesium.Color.YELLOW,
    Cesium.Color.AQUA,
    Cesium.Color.GREEN,
    Cesium.Color.PURPLE,
  ];
  let segments_entities = [];
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
      name: "卫星0-任务" + i,
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
        text: "卫星0-任务" + i,
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
    segments_entities.push(polyline);
  }

  // 任务详情显示
  viewer.screenSpaceEventHandler.setInputAction(function onMouseClick(
    movement
  ) {
    let pickedObject = viewer.scene.pick(movement.position);

    for (let i = 0; i < segments_entities.length; i++) {
      let segment = segments_entities[i];
      if (Cesium.defined(pickedObject) && pickedObject.id === segment) {
        // 当前 Polyline 被选中，将其高亮显示，并显示详情infobox
        segment.polyline.material.outlineWidth = 2;
        segment.polyline.material.outlineColor = Cesium.Color.RED;

        viewer.selectedEntity = segment;
      } else {
        // 当前 Polyline 已经被选中，恢复到默认状态
        segment.polyline.material.outlineWidth = 0;
        segment.polyline.material.outlineColor = null;
      }
    }
    // 选中未定义目标不显示infobox
    if (!Cesium.defined(pickedObject)) {
      viewer.selectedEntity = null;
    }
  },
  Cesium.ScreenSpaceEventType.LEFT_CLICK);
  return segments_entities;
}
