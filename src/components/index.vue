<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import { onMounted } from "vue";
onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNGNiNTMwMy1iMTM0LTRmNjMtODQ3Zi1mMDEwMTc2N2FmYTkiLCJpZCI6MTM0NTEzLCJpYXQiOjE2ODE5MTAzOTJ9.tiKWDatrDzITuelBgU6GOGvDC9i8Uw-UVWE_2kQmTD4";
  const viewer = new Cesium.Viewer("cesiumContainer");
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
