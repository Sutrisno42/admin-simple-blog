<script setup>
const props = defineProps({
    title: {
        type: String,
    },
    avatar: {
        type:String,
    },
    color:{
        type:String,
    },
    route:{
        type:String,
    },
})
</script>
<template>
    <div class="card mb-0">
        <div class="card-body">
            <div class="d-flex align-items-center">
                <div v-if="props.avatar" class="avatar-sm flex-shrink-0 hide-xs me-3">
                    <span :class="'avatar-title bg-' + props.color + ' text-white rounded-circle fs-3'">
                        <i :class="props.avatar"></i>
                    </span>
                </div>
                <div id="spendValue" class="flex-grow-1">
                    <span class="text-uppercase fw-semibold">
                        {{ props.title }}
                    </span>
                </div>
                <!-- <div class="flex-grow-1" id="spendValue">
                    <span v-if="props.isBadgeTop" class="float-end text-muted">
                        <span :class="'badge bg-' + props.colorBadge + ' fs-10'">{{ props.titleBadge }}</span>
                    </span>
                    <p :class="'text-uppercase fw-semibold fs-' + props.fs + ' text-muted mb-1'">
                        {{ props.title }}
                    </p>
                    <span v-if="props.isBadgeFQY" class="float-end"><span
                            class="badge bg-info bg-opacity-10 text-info fs-10">FQY: {{ props.valFQY || 0
                            }}</span></span>
                    <span v-if="props.isBadgeCTR" class="float-end"><span
                            class="badge bg-info bg-opacity-10 text-info fs-10">CTR: {{ props.valCTR || 0
                            }}</span></span>

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
                </div> -->
                <!-- <div v-if="props.isRight" class="flex-shrink-0 mb-0 text-uppercase text-end">
                    <p class="text-uppercase fw-semibold fs-11 text-muted mb-1">{{ props.titleRight }}</p>
                    <h6 class="nowrap mb-0">
                        {{ thousandSeparator(props.valRight) || 0 }}
                        <span v-if="props.rightPercent" class="text-muted">%</span>
                        <span v-else class="text-muted">IDR</span>
                    </h6>
                </div> -->
            </div>
        </div>
    </div>
</template>