<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6">
          <router-link :to="{ name: 'dashboard' }"><i class="las la-home"></i> {{ new Date().getFullYear() }} Naisly - App by IT GBNA
          </router-link>
        </div>
        <!-- <div class="col-sm-6">
          <div class="text-sm-end d-none d-sm-block">{{ new Date().getFullYear() }} by Pandawa ERP</div>
        </div> -->
      </div>
    </div>
  </footer>
</template>
