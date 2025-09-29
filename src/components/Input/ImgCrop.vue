<script setup>
import { ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import Swal from 'sweetalert2'

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  route_id: {
    type: [Number],
    required: true
  },
  onUpload: {
    type: Function,
    required: true
  }
})
const emit = defineEmits(['reload'])
const cropper = ref(null)
const image = ref(null) 
const croppedImage = ref(null)
const inputRef = ref(null)

const cropImage = () => {
  if (cropper.value) {
    croppedImage.value = cropper.value.getCroppedCanvas().toDataURL()
  }
}
const rotate = (degree) => {
  if (cropper.value) {
    cropper.value.rotate(degree)
  }
}

const reset = () => {
  if (cropper.value) {
    cropper.value.reset()
  }
}
const showFileChooser = () => {
  inputRef.value.click()
} 

const uploadPhoto = async () => {
  if (!props.route_id) {
    return;
  }

  cropImage();
  if (cropper.value)
  cropper.value.getCroppedCanvas().toBlob((blob) => {
      if (!blob) {
        Swal.fire("Error", "Image is empty or failed to crop", "error");
        return
      }

      const formData = new FormData();
      formData.append('image', blob);

      props.onUpload(formData); // 🔥 call function from parent
      emit('reload');
    });
};


const handleImageUpload = (e) => {
  const target = e.target
  const file = target.files?.[0]

  if (file && file.type.indexOf('image/') === -1) {
    alert('Please select an image file')
    return
  }

  if (file && typeof FileReader === 'function') {
    const reader = new FileReader()

    reader.onload = (event) => {
      image.value = event.target?.result
      if (cropper.value && event.target?.result) {
        cropper.value.replace(event.target.result)
      }
    }

    reader.readAsDataURL(file)
  } else {
    alert('Sorry, FileReader API not supported')
  }
}
</script>
<template>
  <input 
  id="input"
  ref="inputRef"
  type="file"
  accept="image/*"
  @change="handleImageUpload"
  style="display: none;"
  >
  <div>
    <div class="content">
      <section class="cropper-area">
        <div class="img-cropper">
          <div class="row">
            <div class="col border-2 border-dashed rounded d-flex justify-content-center align-items-center"
              v-if="!image">
              <span style="font-size: 20px">
                <i class="las la-cloud-upload-alt" style="font-size: 30px"></i>
                Upload Image First
              </span>
            </div>
            <div class="col" v-if="image && imageUrl">
              <vue-cropper
              ref="cropper"
              :src="image || imageUrl"
              :aspect-ratio="1 / 1"
              preview=".preview"
              style="max-height: 250px; max-width: 250px"
              />
            </div>
            <div class="col" :style="!image ? 'height: 250px' : ''">
              <div v-if="image">
                <p>Preview</p>
                <div class="d-flex gap-5">
                  <div class="preview border-5 border-primary" />
                  <div class="preview border-5 border-primary rounded-circle" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col">
            <div class="d-flex gap-2">
              <button @click="showFileChooser" class="btn btn-primary">
                <i class="las la-cloud-upload-alt" style="font-size: 20px"></i>
                Upload Photo
              </button>
              <button class="btn btn-primary" @click.prevent="rotate(90)">
                <i class="las la-redo-alt"></i> Rotate
              </button>
              <a href="#" role="button" class="btn btn-primary" @click.prevent="reset"> Reset </a>
            </div>
          </div>
          <div class="col d-flex align-items-end justify-content-end">
            <button class="btn btn-primary" @click="uploadPhoto">Save</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<style>
.preview-area {
  width: 307px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}

.preview-avatar {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 3px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>