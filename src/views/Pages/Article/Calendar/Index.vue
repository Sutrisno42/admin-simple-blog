<script setup>
import Calendar from '@/components/Calendar.vue';
import TableCard from '@/components/cards/TableCard.vue';
import Layout from '@/layouts/Layout.vue';

</script>

<template>
    <Layout>
        <TableCard>
            <template #header>
                <h5 class="flex-grow-1 mb-0 text-muted text-uppercase">
                    <i class="las la-braille me-1"></i> Calendar
                </h5>
            </template>
            <template #default>
                <Calendar/>
            </template>
        </TableCard>
    </Layout>
</template>