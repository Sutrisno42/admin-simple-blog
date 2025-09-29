<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card">
        <div v-if="$slots.customHeader">
          <slot name="customHeader" />
        </div>
        <div
          v-if="$slots.header"
          class="card-header d-flex align-items-center"
          style="position: sticky; top: 70px; z-index: 99"
        >
          <slot name="header" />
        </div>
        <div v-if="!noBody" class="card-body">
          <div class="row">
            <div class="col-md-9">
              <slot name="leftBody" />
            </div>
            <div class="col-md-3">
              <slot name="rightBody" />
            </div>
          </div>

          <slot name="contentBody" />
        </div>
        <div v-if="$slots.customFooter">
          <slot name="customFooter" />
        </div>
        <div :class="'card-footer ' + classFooter" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  classFooter: {
    type: String,
    default: "",
  },
  noBody: {
    type: Boolean,
    default: false,
  },
});
</script>
