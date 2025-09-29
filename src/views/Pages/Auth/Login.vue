<script setup>
import InputError from "@/components/InputError.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { attemtLogin, attemtLogout } from "@/service/AuthService";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/service/ApiClientService";

const state = reactive({
  submitted: false,
  authError: null,
  tryingToLogIn: false,
  isAuthError: false,
  processing: false,
  particleConfig: {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 1000,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 4,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 130,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "top",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: false,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
      },
    },
    retina_detect: true,
  },
});

const authStore = useAuthStore();
const message = ref(null);
const loading = ref(false);
const { errors, handleSubmit, defineField, setErrors } = useForm({
  validationSchema: yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
  }),
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  loading.value = true;
  try {
    await attemtLogin(values);
    resetForm();
    message.value = null;
  } catch (exception) {
    console.info("exception submit triggered", exception);
    message.value = exception.message;
    setErrors(exception.errors);
  } finally {
    loading.value = false;
  }
});

const router = useRouter();
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");


const isLogged = async () => {
  try {
    const data = await apiClient.get("/auth/profile", {
      withCredentials: true,
    });
    if (data.status) {
      router.push("/dashboard");
    }
  } catch (err) {
    authStore.reset();
    router.push("/auth/login");
  }
};

onMounted(async () => {
  if (authStore.access_token) {
    await isLogged();
  }
});
</script>
<template>
  <div class="auth-page-wrapper pt-5">
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <vue-particles
        id="tsparticles"
        class="bg-overlay"
        :options="state.particleConfig"
      />
      <div class="shape">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120"
        >
          <path
            d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"
          ></path>
        </svg>
      </div>
    </div>

    <div class="auth-page-content">
      <div class="container-sm">
        <div class="row">
          <div class="col">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link
                  :to="{ name: 'auth.login' }"
                  class="d-inline-block auth-logo"
                >
                  <img src="@/assets/images/logo-naisly.webp" alt="" height="85" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div class="card mt-4">
              <div class="p-4">
                <div class="p-0 mt-0">
                  <div
                    v-if="message"
                    class="alert alert-danger mt-0 alert-dismissible text-center"
                    role="alert"
                  >
                    <i class="ri-information-2-line"></i> {{ message }}
                  </div>

                  <form @submit="onSubmit">
                    <div class="mb-3">
                      <label for="email" class="form-label"
                        ><i class="ri-user-3-line align-bottom me-1"></i
                        >email</label
                      >
                      <input
                        id="email"
                        type="email"
                        v-model="email"
                        class="form-control"
                        autofocus
                        placeholder="Please enter email"
                        :class="{ 'is-invalid': errors.email }"
                        autocomplete="email"
                        v-bind:class="emailAttrs"
                      />
                      <InputError :message="errors.email" />
                    </div>

                    <div class="mb-3">
                      <label for="password" class="form-label"
                        ><i class="ri-key-line align-bottom me-1"></i
                        >password</label
                      >
                      <input
                        id="password"
                        type="password"
                        v-model="password"
                        class="form-control"
                        autofocus
                        placeholder="Please enter password"
                        :class="{ 'is-invalid': errors.password }"
                        autocomplete="password"
                        v-bind:class="passwordAttrs"
                      />
                      <InputError :message="errors.password" />
                    </div>

                    <div class="mt-4">
                      <button
                        class="btn btn-success w-100 btn-load"
                        type="submit"
                        :disabled="loading"
                      >
                        <span
                          v-if="loading === true"
                          class="d-flex align-items-center"
                          ><span class="flex-grow-1 me-2"> Please wait... </span
                          ><span
                            class="spinner-border flex-shrink-0"
                            role="status"
                            ><span class="visually-hidden"
                              >Please wait...</span
                            ></span
                          ></span
                        >
                        <span v-else>
                          {{ loading ? "Please wait..." : "Sign in" }}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <p class="mb-0">
                <i class="ri-copyright-line"></i>
                {{ new Date().getFullYear() }} Naisly - App by IT GBNA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
