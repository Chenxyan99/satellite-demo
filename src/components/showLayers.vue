<template>
  <div id="entities">
    <el-dropdown trigger="click" :hide-on-click="false">
      <el-button type="primary">
        显示/隐藏图层<el-icon>
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <el-checkbox id="checkbox" v-model="checked0" label="卫星" @change="showSatellite(checked0)"></el-checkbox>
            <el-button :icon="Setting" circle></el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox id="checkbox" v-model="checked1" label="轨迹" @change="showOrbit(checked1)"></el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox id="checkbox" v-model="checked2" label="任务" @change="showSegments(checked2)"></el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox id="checkbox" v-model="checked3" label="历史波束" @change="showHistoryBeam(checked3)"></el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox id="checkbox" v-model="checked4" label="实时波束" @change="showBeam(checked4)"></el-checkbox>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-checkbox id="checkbox" v-model="checked5" label="星座网格" @change="showDashLine(checked5)"></el-checkbox>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { Setting } from "@element-plus/icons-vue";

const props = defineProps({
  satellite_entities: Array,
  segments_entities: Array,
  entity_yz: Object,
  entity_yz_arr: Array,
  dashLine_entities: Array,
});

let satellite_entities = reactive(props.satellite_entities);
let segments_entities = reactive(props.segments_entities);
let entity_yz = reactive(props.entity_yz);
let entity_yz_arr = reactive(props.entity_yz_arr);
let dashLine_entities = reactive(props.dashLine_entities);

let checked0 = ref(true);
let checked1 = ref(false);
let checked2 = ref(true);
let checked3 = ref(true);
let checked4 = ref(true);
let checked5 = ref(true);

// 卫星
function showSatellite(check) {
  satellite_entities.forEach((element) => {
    if (check) {
      element.model.show = true;
    } else {
      element.model.show = false;
    }
  });
}

// 轨道
function showOrbit(check) {
  satellite_entities.forEach((element) => {
    if (check) {
      element.path.show = true;
    } else {
      element.path.show = false;
    }
  });
}

// 任务
function showSegments(check) {
  segments_entities.forEach((segments) => {
    segments.forEach((segment) => {
      if (check) {
        segment.polyline.show = true;
        segment.label.show = true;
      } else {
        segment.polyline.show = false;
        segment.label.show = false;
      }
    });
  });
}

// 历史波束
function showHistoryBeam(check) {
  if (check) window.config.flag = true;
  else window.config.flag = false;

  entity_yz_arr.forEach((element) => {
    if (check) {
      element.show = true;
    } else {
      element.show = false;
    }
  });
}

// 实时波束
function showBeam(check) {
  if (check) {
    entity_yz.show = true;
  } else {
    entity_yz.show = false;
  }
}

//星座网格
function showDashLine(check) {
  dashLine_entities.forEach((element) => {
    if (check) {
      element.show = true;
    } else {
      element.show = false;
    }
  });
}

</script>

<style>
#entities {
  top: 50px;
  left: 50px;
  position: absolute;
  opacity: 0.8;
}

#checkbox {
  margin-left: 8px;
  margin-top: 10px;
}

.el-dropdown {
  vertical-align: top;
}

.el-dropdown+.el-dropdown {
  margin-left: 15px;
}

.el-dropdown-menu {
  background-color: rgb(238, 238, 238, 0.8);
  width: 130px;
}
.el-dropdown-menu__item i {
  margin: 0;
}
</style>
