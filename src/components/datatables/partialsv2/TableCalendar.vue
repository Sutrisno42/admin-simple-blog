<template>
    <div class="dataTables_wrapper dt-bootstrap5 no-footer">
        <div class="row">
            <slot name="showingSearch"></slot>
        </div>
        <FullCalendar :options="calendarOptions">
            <template>
                <div class="row">
                    <div class="col-sm-12 table-responsive">
                        <table id="datatable" :class="tableClass
                            ? tableClass
                            : 'table table-hover align-middle text-nowrap dt-responsive nowrap dataTable no-footer'
                            " style="width: 100%">
                            <thead class="align-middle">
                                <tr :class="classRow">
                                    <th v-for="(day, index) in week" :key="index">
                                        {{ day }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="7">
                                        {{ arg.dayNumberText }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </FullCalendar>
        <div class="row">
            <slot name="pagination"></slot>
        </div>
    </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';

export default {
    components: {
        FullCalendar,
    },
    props: ["tableClass", "classRow", "labelHeaderColor"],
    data() {
        return {
            week: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            calendarDates: [],
            calendarDate: {
                plugins: [dayGridPlugin],
                initialView: "dayGridMonth",
                headerToolbar: false,
                dayHeaderFormat: { weekday: 'long' },
                dayCellContent: false,
            },
            calendarOptions: {
                plugins: [
                    dayGridPlugin,
                    interactionPlugin
                ],
                headerToolbar: {
                    left: 'title',
                    center: '',
                    right: 'prev next'
                },
                initialView: 'dayGridMonth',
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                select: this.handleDateSelect,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
                dayHeaders: false,
                dayHeaderContent: (info) => this.week[info.date.getDay()], // Menggunakan week untuk mengganti dayHeaders
            },
        };
    },
};
</script>
