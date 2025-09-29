<template>
  <div class="col-sm-12 col-md-5">
    <div class="dataTables_info text-uppercase text-muted" style="font-size: 11px">
      Showing {{ thousandSeparator(pagination.from) || 0 }} to
      {{ thousandSeparator(pagination.to) || 0 }} of
      {{ thousandSeparator(pagination.total) || 0 }} entries
    </div>
  </div>
  <div class="col-sm-12 col-md-7">
    <div class="dataTables_paginate paging_simple_numbers" id="datatable_paginate">
      <ul class="pagination flex-wrap">
        <li
          v-for="(link, index) in pagination.links"
          :key="index"
          class="paginate_button page-item"
          :class="{
            active: link.active,
            disabled: !link.url || link.label === '...'
          }"
        >
          <button
            v-if="link.url"
            @click="redirect(link.url)"
            type="button"
            class="page-link"
            v-html="link.label"
          ></button>
          <span v-else class="page-link" v-html="link.label"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import thousandSeparator from '@/utils/thousandSeparator'

defineProps(['pagination'])
const emit = defineEmits(['link', 'prev', 'next'])

const changer = (data) => {
  let newUrl = data.replace('http://', 'https://')
  return newUrl
}

const redirect = (url) => {
  let URL = changer(url)
  emit('link', URL)
}
</script>

<style>
.active {
  color: #405189;
}
</style>