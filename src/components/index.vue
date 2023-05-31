<template>
  <div id="cesiumContainer"></div>
  <showLayers :satellite_entities="satellite_entities" :segments_entities="segments_entities" :entity_yz="entity_yz"
    :entity_yz_arr="entity_yz_arr" :dashLine_entities="dashLine_entities" v-if="segments_entities.length != 0">
  </showLayers>
  <mapSwitch :viewer="viewer" v-if="segments_entities.length != 0"> </mapSwitch>
</template>

<script setup>
import { fileRead } from "../api/index";
import { drawSatellite } from "../utils/satellite.js";
import { createSegments } from "../utils/segments.js";
import { drawCone } from "../utils/cone.js";
import { createDashLine } from "../utils/dashLine.js"
import * as Cesium from "cesium";
import { onMounted, reactive, ref } from "vue";
import showLayers from "./showLayers.vue";
import mapSwitch from "./mapSwitch.vue";

let viewer = ref();
let satellites = reactive([]);
let satellite_entities = reactive([]);
let segments_entities = reactive([]);
let entity_yz = ref();
let entity_yz_arr = reactive([]);
let dashLine_entities = reactive([]);

// 初始化地图
function init() {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNGNiNTMwMy1iMTM0LTRmNjMtODQ3Zi1mMDEwMTc2N2FmYTkiLCJpZCI6MTM0NTEzLCJpYXQiOjE2ODE5MTAzOTJ9.tiKWDatrDzITuelBgU6GOGvDC9i8Uw-UVWE_2kQmTD4";
  viewer = new Cesium.Viewer("cesiumContainer", {
    //UI控制
    baseLayerPicker: false, //右上角的图层选择按钮
    animation: true, //左下角的动画仪表盘
    infoBox: true, //点击要素之后显示的信息
    geocoder: false, //搜索框
    homeButton: false, //home按钮
    sceneModePicker: true, //模式切换按钮
    timeline: true, //底部的时间轴
    fullscreenButton: true, //右下角的全屏按钮
    shouldAnimate: true,
    navigationHelpButton: false, //右上角的帮助按钮，
    selectionIndicator: false, //原生绿色选框
    terrainProvider: new Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
    }),
    sceneMode: Cesium.SceneMode.SCENE2D,
  });
  //不显示太阳、关闭版权信息
  {
    //viewer.scene.globe.enableLighting = true;
    //viewer.shadows = false;
    viewer.scene.sun.show = false; //不显示太阳
    viewer._cesiumWidget._creditContainer.style.display = "none"; //关闭底下的版权信息
    viewer._cesiumWidget._creditContainer.style.display = "none";

    viewer.clock.onTick.addEventListener(function () {
      if (viewer.camera.pitch > 0) {
        viewer.scene.screenSpaceCameraController.enableTilt = false;
      }
    });
  }

  //开启抗锯齿
  {
    if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
      //判断是否支持图像渲染像素化处理
      viewer.resolutionScale = window.devicePixelRatio;
    }
    viewer.scene.fxaa = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;
  }

  //开启地面深度检测，这样地下的就看不到了
  viewer.scene.globe.depthTestAgainstTerrain = true;
  // 时间速率，数字越大时间过的越快
  viewer.clock.multiplier = 1;
}

// 任务详情显示
function showDetails() {
  // 任务详情显示
  viewer.screenSpaceEventHandler.setInputAction(function onMouseClick(
    movement
  ) {
    let pickedObject = viewer.scene.pick(movement.position);
    segments_entities.forEach((segment_entities) => {
      for (let i = 0; i < segment_entities.length; i++) {
        let segment = segment_entities[i];
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.id.name === segment.name
        ) {
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
    });
  },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 数据获取
function getData() {
  fileRead().then((res) => {
    let reader = new FileReader();
    reader.readAsText(new Blob([res]));
    reader.onload = function (e) {
      if (e.target) {
        let fileContent = e.target.result;
        fileContent = String(fileContent);
        let lines = fileContent.split("\n");
        let positions = new Array();
        for (let i = 4; i < lines.length; i++) {
          let line = lines[i];
          // 时间匹配
          let dateMatch = line.match(
            /(\d{2}\s\w+\s\d{4}\s\d{2}:\d{2}:\d{2}\.\d{3})/g
          );
          // let dateString = dateMatch[1];
          // console.log(dateMatch);
          // 经纬度、海拔匹配
          let numbers = line.match(/-?\d+\.\d+/g);
          // console.log(numbers);
          if (numbers !== null) {
            let lat = parseFloat(numbers[1]);
            let lon = parseFloat(numbers[2]);
            let alt = parseFloat(numbers[3]);
            positions.push({ lon: lon, lat: lat, alt: alt });
          } else {
            if (positions.length != 0) satellites.push(positions);
            positions = [];
          }
        }
      }
    };
  });
}

onMounted(() => {
  // 初始化
  init();
  // txt测试数据读取
  getData();
  setTimeout(function () {
    let index = 0;
    satellites.forEach((positions) => {
      // 卫星绘制'
      let satelliteEntity = drawSatellite(Cesium, viewer, positions);
      satellite_entities.push(satelliteEntity);

      // 圆锥绘制
      // let coneData = drawCone(Cesium, viewer, positions, satelliteEntity);
      // entity_yz = coneData.entity_yz;
      // entity_yz_arr = coneData.entity_yz_arr;

      // 任务绘制（模拟数据）
      let segment = [];
      let segments = [];
      for (let i = 0; i <= positions.length; i++) {
        segment.push(positions[i]);
        if (i == 50 || i == 150 || i == 300) {
          segments.push(segment);
          segment = [];
          segment.push(positions[i]);
          if (i == 300) break;
        }
      }
      segments_entities.push(createSegments(Cesium, viewer, segments, index));
      index = index + 1;
      showDetails();
    });

    //星座网格绘制
    let dashLine1 = createDashLine(Cesium, viewer, satellite_entities[0].position, satellite_entities[1].position);
    let dashLine2 = createDashLine(Cesium, viewer, satellite_entities[2].position, satellite_entities[3].position);
    dashLine_entities.push(dashLine1);
    dashLine_entities.push(dashLine2);
  }, 1000);
});
</script>

<style>
html,
body,
#cesiumContainer {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
