<script setup>
import thousandSeparator from '@/utils/thousandSeparator'

const props = defineProps({
  title: {
    type: String,
  },
  value: {
    type: String,
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
  },
  valPrev: {
    type: String,
  },
  isCurrency: {
    type: Boolean,
    default: false,
  },
  isPercent: {
    type: Boolean,
    default: false,
  },
  isBadgeFQY: {
    type: Boolean,
    default: false,
  },
  isBadgeCTR: {
    type: Boolean,
    default: false,
  },
  isBadgeTop: {
    type: String,
  },
  valFQY: {
    type: String,
  },
  valCTR: {
    type: String,
  },
  titlePrev: {
    type: String,
  },
  wrapperClass: {
    type: String,
    default: 'col-lg-3'
  },
  noWrapper: {
    type: Boolean,
    default: false
  },
  fs: { type: String, default: '12' },
  fsColor: { type: String, default: '' },
  fsH6: { type: Boolean, default: false },
  footPrev: { type: Boolean, default: true },
  isRight: { type: Boolean, default: false },
  rightPercent: { type: Boolean, default: false },
  titleBadge: { type: String },
  colorBadge: { type: String },
  colorValue: { type: String },
  titleRight: { type: String },
  valRight: { type: String },
})
</script>
<template>
  <div :class="props.noWrapper ? '' : props.wrapperClass">
    <div class="card mb-0">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div v-if="props.icon" class="avatar-sm flex-shrink-0 hide-xs me-3">
            <span :class="'avatar-title bg-' + props.color + ' text-white rounded-circle fs-3'">
              <i :class="props.icon"></i>
            </span>
          </div>
          <div class="flex-grow-1" id="spendValue">
            <span v-if="props.isBadgeTop" class="float-end text-muted">
              <span :class="'badge bg-' + props.colorBadge + ' fs-10'">{{ props.titleBadge }}</span>
            </span>
            <p :class="'text-uppercase fw-semibold fs-' + props.fs + ' text-muted mb-1'">
              {{ props.title }}
            </p>
            <span v-if="props.isBadgeFQY" class="float-end"><span
                class="badge bg-info bg-opacity-10 text-info fs-10">FQY: {{ props.valFQY || 0 }}</span></span>
            <span v-if="props.isBadgeCTR" class="float-end"><span
                class="badge bg-info bg-opacity-10 text-info fs-10">CTR: {{ props.valCTR || 0 }}</span></span>

            <h6 v-if="props.fsH6" class="nowrap mb-0">
              <span :class="'text-' + props.fsColor + ' me-1'">
                {{ thousandSeparator(props.value) || 0 }}
              </span>
              <span v-if="props.isCurrency" class="text-muted">IDR</span>
              <span v-if="props.isPercent" class="text-muted">%</span>
            </h6>
            <h5 v-else :class="'nowrap mb-0 text-' + props.colorValue">
              {{ thousandSeparator(props.value) || 0 }}
              <span v-if="props.isCurrency" class="text-muted">IDR</span>
            </h5>
          </div>
          <div v-if="props.isRight" class="flex-shrink-0 mb-0 text-uppercase text-end">
            <p class="text-uppercase fw-semibold fs-11 text-muted mb-1">{{ props.titleRight }}</p>
            <h6 class="nowrap mb-0">
              {{ thousandSeparator(props.valRight) || 0 }}
              <span v-if="props.rightPercent" class="text-muted">%</span>
              <span v-else class="text-muted">IDR</span>
            </h6>
          </div>
        </div>
      </div>
      <div class="progress progress-sm">
        <div :class="'progress-bar bg-' + props.color" role="progressbar" style="width: 100%"></div>
      </div>

      <!-- <div v-if="props.footPrev" class="card-footer bg-light pb-2 pt-2 border-bottom">
        <span class="float-end"
          ><strong>{{ thousandSeparator(props.valPrev) || 0 }}</strong>
          <span class="text-muted"> IDR</span>
        </span>
        <div class="mb-0 text-muted">{{ props.titlePrev }}:</div>
      </div> -->
    </div>
  </div>
</template>
