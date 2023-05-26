export function drawCone(Cesium, viewer, positions, wx_positions) {
  var property_yz = new Cesium.SampledPositionProperty();
  var TimeInterval = 60;
  for (var i = 0; i < positions.length; i++) {
    var time = Cesium.JulianDate.addSeconds(
      viewer.clock.currentTime,
      i * TimeInterval,
      new Cesium.JulianDate()
    );
    var position = Cesium.Cartesian3.fromDegrees(
      positions[i].lon,
      positions[i].lat,
      positions[i].alt * 1000 - 400000
    );
    property_yz.addSample(time, position);
  }

  //添加圆锥
  var entity_yz = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: viewer.clock.currentTime,
        stop: Cesium.JulianDate.addSeconds(
          viewer.clock.currentTime,
          60 * 60 * 24,
          new Cesium.JulianDate()
        ),
      }),
    ]),
    position: property_yz,
    orientation: new Cesium.VelocityOrientationProperty(property_yz),
    cylinder: {
      HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      length: 800000,
      topRadius: 0, //顶部半径
      bottomRadius: 350000, //底部半径
      material: Cesium.Color.BLUE.withAlpha(0.5),
      outline: !0,
      numberOfVerticalLines: 0,
      outlineColor: Cesium.Color.BLUE.withAlpha(0.8),
    },
  });
  entity_yz.position.setInterpolationOptions({
    //轨道平滑
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
  });

  //圆锥数组
  var entity_yz_arr = new Array();
  var flag = true; //用于表示定时生成的圆锥是否显示
  //实时更新卫星和圆锥的角度
  setInterval(function () {
    //获取卫星和圆锥当前的位置
    let wx_position = wx_positions.position.getValue(viewer.clock.currentTime);
    let yz_position = entity_yz.position.getValue(viewer.clock.currentTime);
    const heading = Cesium.Math.toRadians(90);
    const pitch = Cesium.Math.toRadians(0);
    const roll = Cesium.Math.toRadians(0);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation1 = Cesium.Transforms.headingPitchRollQuaternion(
      wx_position,
      hpr
    );
    const orientation2 = Cesium.Transforms.headingPitchRollQuaternion(
      yz_position,
      hpr
    );
    (wx_positions.orientation = orientation1),
      (entity_yz.orientation = orientation2);

    //最后把圆锥清除
    // if (
    //   viewer.clock.currentTime.secondsOfDay >=
    //   viewer.clock.stopTime.secondsOfDay - 0.7
    // ) {
    //   for (var i = 0; i < entity_yz_arr.length; i++)
    //     viewer.entities.remove(entity_yz_arr[i]);
    // }
  });

  //定时生成圆锥覆盖区域
  setInterval(function () {
    if (viewer.clock.shouldAnimate == true) {
      //时间轴不暂停才生成
      let yz_position = entity_yz.position.getValue(viewer.clock.currentTime);
      const heading = Cesium.Math.toRadians(90);
      const pitch = Cesium.Math.toRadians(0);
      const roll = Cesium.Math.toRadians(0);
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const orientation2 = Cesium.Transforms.headingPitchRollQuaternion(
        yz_position,
        hpr
      );

      var entity_tmp = viewer.entities.add({
        show: flag,
        position: yz_position,
        orientation: orientation2,
        cylinder: {
          HeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          length: 800000,
          topRadius: 0, //顶部半径
          bottomRadius: 350000, //底部半径
          material: Cesium.Color.BLUE.withAlpha(0.03),
          outline: !0,
          numberOfVerticalLines: 0,
          outlineColor: Cesium.Color.BLUE.withAlpha(0.1),
        },
      });
      entity_yz_arr.push(entity_tmp);
    }
  }, 251);
}
