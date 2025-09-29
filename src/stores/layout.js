import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useLayoutStore = defineStore({
  id: 'layout',
  state: () => ({
    layoutValue: useStorage('layoutValue', {
      layoutType: 'vertical',
      layoutWidth: 'fluid',
      sidebarSize: 'lg',
      topbar: 'light',
      mode: 'light',
      position: 'fixed',
      sidebarView: 'default',
      sidebarColor: 'light',
      sidebarImage: 'none',
      preloader: 'disable',
      visibility: 'show'
    })
  }),
  getters: {
    getLayoutValue: (state) => () => {
      state.layoutValue.layoutType = state.layoutValue.layoutType
        ? state.layoutValue.layoutType
        : 'vertical'
      return {
        ...state
      }
    }
  },
  actions: {
    changeLayoutType({ layoutType }) {
      // let documentLayoutType = document.documentElement.getAttribute('data-layout')
      this.layoutType.layoutType = layoutType
      switch (this.layoutType.layoutType) {
        case 'horizontal':
          document.documentElement.setAttribute('data-layout', 'horizontal')
          break
        case 'vertical':
          document.documentElement.setAttribute('data-layout', 'vertical')
          break
        case 'twocolumn':
          document.documentElement.setAttribute('data-layout', 'twocolumn')
          break
        case 'semibox':
          document.documentElement.setAttribute('data-layout', 'semibox')
          break
      }
      // this.layoutValue.layoutType = document.documentElement.getAttribute('data-layout')
      document.body.removeAttribute('style')
    },

    changeLayoutWidth({ layoutWidth }) {
      // let documentLayoutWidth = document.documentElement.getAttribute('data-layout-width')
      this.layoutValue.layoutWidth = layoutWidth
      switch (this.layoutValue.layoutWidth) {
        case 'fluid':
          document.documentElement.setAttribute('data-layout-width', 'fluid')
          break
        case 'boxed':
          document.documentElement.setAttribute('data-layout-width', 'boxed')
          break
      }
    },

    changeSidebarSize({ sidebarSize }) {
      // let documentSidebarSize = document.documentElement.getAttribute('data-sidebar-size')
      this.layoutValue.sidebarSize = sidebarSize
      switch (this.layoutValue.sidebarSize) {
        case '':
          document.documentElement.setAttribute('data-sidebar-size', '')
          break
        case 'sm-hover-active':
          document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active')
          break
        case 'sm-hover':
          document.documentElement.setAttribute('data-sidebar-size', 'sm-hover')
          break
        case 'sm':
          document.documentElement.setAttribute('data-sidebar-size', 'sm')
          break
        case 'md':
          document.documentElement.setAttribute('data-sidebar-size', 'md')
          break
        case 'lg':
          document.documentElement.setAttribute('data-sidebar-size', 'lg')
          break
      }
    },

    changeTopbar() {
      let documentMode = document.documentElement.getAttribute('data-topbar')
      if (documentMode == 'dark') {
        document.documentElement.setAttribute('data-topbar', 'light')
      } else {
        document.documentElement.setAttribute('data-topbar', 'dark')
      }
      this.layoutValue.topbar = document.documentElement.getAttribute('data-topbar')
    },

    changeMode() {
      let documentMode = document.documentElement.getAttribute('data-bs-theme')
      let documentModeSb = document.documentElement.getAttribute('data-sidebar')

      // Hapus style kustom yang ada (jika ada)
      const existingStyle = document.head.querySelector('style[data-custom-style]')
      if (existingStyle) {
        existingStyle.remove()
      }
      if (documentMode === 'dark' && documentModeSb === 'dark') {
        // Beralih ke mode terang
        document.documentElement.setAttribute('data-sidebar', 'light')
        document.documentElement.setAttribute('data-bs-theme', 'light')

        const styleLight = document.createElement('style')
        styleLight.setAttribute('data-custom-style', '')
        styleLight.textContent = `
          .style-chooserup .vs__selected {
            color: #000;
          }
          .style-chooserup .vs__dropdown-menu {
            // background-color: #f3f6f9;
            color: #000;
          }
          .style-chooser .vs__selected {
            color: #000;
          }
          .style-chooser .vs__dropdown-menu {
            background-color: #f3f6f9;
            color: #3d3d3d;
            font-size: 11px;
          }
        `
        document.head.appendChild(styleLight)
      } else {
        // Beralih ke mode gelap
        document.documentElement.setAttribute('data-sidebar', 'dark')
        document.documentElement.setAttribute('data-bs-theme', 'dark')

        const styleDark = document.createElement('style')
        styleDark.setAttribute('data-custom-style', '')
        styleDark.textContent = `
          .style-chooserup .vs__selected {
            color: #ced4da;
          }
          .style-chooserup .vs__dropdown-menu {
            background-color: #282b2e;
            color: #ced4da;
          }
          .style-chooser .vs__selected {
            color: #ced4da;
          }
          .style-chooser .vs__dropdown-menu {
            background-color: #282b2e;
            color: #ced4da;
            font-size: 11px;
          }
        `
        document.head.appendChild(styleDark)
      }

      this.layoutValue.sidebarColor = document.documentElement.getAttribute('data-sidebar')
      this.layoutValue.mode = document.documentElement.getAttribute('data-bs-theme')
    },

    changePosition({ position }) {
      this.layoutValue.position = position
      switch (this.layoutValue.position) {
        case 'fixed':
          document.documentElement.setAttribute('data-layout-position', 'fixed')
          break
        case 'scrollable':
          document.documentElement.setAttribute('data-layout-position', 'scrollable')
          break
      }
    },

    changeSidebarView({ sidebarView }) {
      this.layoutValue.sidebarView = sidebarView
      switch (this.layoutValue.sidebarView) {
        case 'detached':
          document.documentElement.setAttribute('data-layout-style', 'detached')
          break
        case 'default':
          document.documentElement.setAttribute('data-layout-style', 'default')
          break
      }
    },

    changeSidebarColor({ sidebarColor }) {
      this.layoutValue.sidebarColor = sidebarColor
      switch (this.layoutValue.sidebarColor) {
        case 'dark':
          document.documentElement.setAttribute('data-sidebar', 'dark')
          break
        case 'light':
          document.documentElement.setAttribute('data-sidebar', 'light')
          break
        case 'gradient':
          document.documentElement.setAttribute('data-sidebar', 'gradient')
          break
        case 'gradient-2':
          document.documentElement.setAttribute('data-sidebar', 'gradient-2')
          break
        case 'gradient-3':
          document.documentElement.setAttribute('data-sidebar', 'gradient-3')
          break
        case 'gradient-4':
          document.documentElement.setAttribute('data-sidebar', 'gradient-4')
          break
      }
    },

    changeSidebarImage({ sidebarImage }) {
      this.layoutValue.sidebarImage = sidebarImage
      switch (this.layoutValue.sidebarImage) {
        case 'img-1':
          document.documentElement.setAttribute('data-sidebar-image', 'img-1')
          break
        case 'img-2':
          document.documentElement.setAttribute('data-sidebar-image', 'img-2')
          break
        case 'img-3':
          document.documentElement.setAttribute('data-sidebar-image', 'img-3')
          break
        case 'img-4':
          document.documentElement.setAttribute('data-sidebar-image', 'img-4')
          break
        case 'none':
          document.documentElement.setAttribute('data-sidebar-image', 'none')
          break
      }
    },

    changePreloader() {
      let documentMode = document.documentElement.getAttribute('data-preloader')
      if (documentMode == 'disable') {
        document.documentElement.setAttribute('data-preloader', 'enable')
      } else {
        document.documentElement.setAttribute('data-preloader', 'disable')
      }
      this.layoutValue.preloader = document.documentElement.getAttribute('data-preloader')
      useStorage('data-preloader', document.documentElement.getAttribute('data-preloader'))
    },

    changeVisibility({ visibility }) {
      this.layoutValue.visibility = visibility
      switch (this.layoutValue.visibility) {
        case 'show':
          document.documentElement.setAttribute('data-sidebar-visibility', 'show')
          break
        case 'hidden':
          document.documentElement.setAttribute('data-sidebar-visibility', 'hidden')
          break
      }
    }
  }
})
