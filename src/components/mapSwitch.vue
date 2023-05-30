<template>
  <div id="mapSwitch">
    <el-select
      style="width: 70px"
      v-model="value"
      class="m-2"
      placeholder="正常"
      size="small"
      @change="modeChange()"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup>
import * as Cesium from "cesium";
import { reactive, ref } from "vue";

const props = defineProps({
  viewer: Object,
});
let viewer = reactive(props.viewer);
const value = ref("");
const options = [
  {
    value: 1,
    label: "正常",
  },
  {
    value: 2,
    label: "白天",
  },
  {
    value: 3,
    label: "夜晚",
  },
];
const dayLayer = viewer.imageryLayers.addImageryProvider(
  new Cesium.UrlTemplateImageryProvider({
    url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
    subdomains: ["a", "b", "c", "d"],
  })
);
const nightLayer = viewer.imageryLayers.addImageryProvider(
  new Cesium.UrlTemplateImageryProvider({
    url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
    subdomains: ["a", "b", "c", "d"],
  })
);
//默认正常模式
dayLayer.show = false;
nightLayer.show = false;

function modeChange() {
  switch (value.value) {
    case 1:
      normal();
      break;
    case 2:
      day();
      break;
    case 3:
      night();
      break;
  }
}

//正常模式
function normal() {
  dayLayer.show = false;
  nightLayer.show = false;
}

//白天
function day() {
  dayLayer.show = true;
  nightLayer.show = false;
}

//夜晚
function night() {
  dayLayer.show = false;
  nightLayer.show = true;
}
</script>

<style>
#mapSwitch {
  top: 53px;
  left: 210px;
  position: absolute;
  opacity: 0.8;
}
</style>
