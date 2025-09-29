<template>
    <div class="dataTables_wrapper dt-bootstrap5 no-footer">
      <div class="row">
        <slot name="showingSearch"></slot>
      </div>
      <div class="row">
        <div class="col-sm-12 table-responsive">
          <table
            id="datatable"
            :class="
              tableClass
                ? tableClass
                : 'table table-hover align-middle text-nowrap dt-responsive nowrap dataTable no-footer'
            "
            style="width: 100%"
          >
            <thead class="align-middle">
              <tr :class="classRow">
                <th
                  v-for="column in columns"
                  :key="column.name"
                  @click="column.sortable ? $emit('sorting', column.name) : null"
                  :style="
                    'width:' +
                    column.width +
                    '; cursor:' +
                    (column.sortable ? ' pointer;' : ' default;')
                  "
                  :class="checkIcon(column) + ' ' + ArrowIconColor"
                  :hidden="column.hidden ? column.hidden : false"
                >
                  <span :style="'color:' + labelHeaderColor">
                    {{ column.label }}
                  </span>
                </th>
              </tr>
            </thead>
            <slot name="tBody"></slot>
          </table>
        </div>
      </div>
      <div class="row">
        <slot name="pagination"></slot>
      </div>
    </div>
  </template>
  <script>
  export default {
    props: [
      'columns',
      'arrows',
      'tableClass',
      'classRow',
      'headerBgColor',
      'labelHeaderColor',
      'ArrowIconColor',
    ],
    methods: {
      checkIcon(column) {
        if (column.sortable) {
          if (this.arrows.col === column.name) {
            if (this.arrows.arr === 'asc') {
              return 'sorting sorting_asc'
            } else {
              return 'sorting sorting_desc'
            }
          } else {
            return 'sorting'
          }
        } else {
          return ''
        }
      },
    },
  }
  </script>
  