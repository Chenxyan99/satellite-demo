<template>
  <div id="cesiumContainer"></div>
</template>
 
<script setup>
import * as Cesium from 'cesium';
import { onMounted } from 'vue';
onMounted(() => {
  const viewer = new Cesium.Viewer('cesiumContainer');
});
</script>
 
<style>
#app {
  width: 100%;
  height: 100%;
}
html,body,#cesiumContainer{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>