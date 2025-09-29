<script setup>
import { useLayoutStore } from '../stores/layout'
import { useRoute } from 'vue-router'
import Vertical from './partials/Vertical.vue'
const layoutStore = useLayoutStore()
const router = useRoute()
const props = defineProps(['pageTitle'])

const routeString = router.name?.split('.') ?? []

</script>
<template>
  <div>
    <Vertical v-if="
      layoutStore.layoutValue.layoutType === 'vertical' ||
      layoutStore.layoutValue.layoutType === 'semibox'
    " :layout="layoutStore.layoutValue.layoutType">
      <div v-if="router.meta.title == null || router.meta.title == ''"></div>
      <div v-else class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h5 class="me-auto text-uppercase fw-bold">{{ props.pageTitle ?? router.meta.title }}</h5>
            <!-- <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li v-for="(name, index) in routeString" :key="index" class="breadcrumb-item"
                  :class="{ 'active': routeString.length > 1 && index == 0 }">
                <li class="breadcrumb-item" v-if="routeString.length > 1 && index == 0">{{ name.charAt(0).toUpperCase()
                  + name.slice(1) }}</li>
                <RouterLink :to="{ name: router.name }" v-if="routeString.length > 1 && index == 1">
                  {{ name.charAt(0).toUpperCase() + name.slice(1) }}
                </RouterLink>
                </li>
              </ol>
            </div> -->
          </div>
        </div>
      </div>
      <slot />
    </Vertical>
  </div>
</template>
