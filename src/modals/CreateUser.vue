<script setup lang="ts">
import { reactive, inject, ref, computed } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";
import { request } from "../composables/request.composable";
import handleSuccess from "../composables/handle_success.composable";
import handleError from "../composables/handle_error.composable";
import { useAuthStore, useUserStore } from "../store/index";
import spinner from "../components/timer/Spinner.vue";
import { stringValidate, numberValidate } from "../validations/validate";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { IClose } from "../core/icons";
import { IArrowDown } from "../core/icons";

// initialize store
const authStore = useAuthStore();
const userStore = useUserStore();

// variables
const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref<any>({ message: "Signup successful" });
const valid = ref(false);

const data = reactive<{
  email: string | null;

  password: string | null;
  confirmPassword: string | null;
  firstname: string | null;
  lastname: string | null;
  telephone: number | null;
  role_id: number | null;
}>({
  email: null,
  password: null,
  firstname: null,
  confirmPassword: null,
  lastname: null,
  telephone: null,
  role_id: null,
});

// emit
const emit = defineEmits<{ (e: "fetchUsers"): void }>();

// inject
const openCreateUser = inject<any>("openCreateUser");

// methods

const onInput = (phone: number, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.telephone = phoneObject.number;
    valid.value = phoneObject.valid;
  }
};

const validatePhone = () => {
  return valid.value;
};

const handleCreate = async (): Promise<void> => {
  // check if form is formattted correctly
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect == true) {
    const dataObj = {
      email: v$.value.email.$model as string,
      password: v$.value.password.$model as string,
      confirmPassword: v$.value.confirmPassword.$model as string,
      // role_id: data.role_id as number,
      firstname: v$.value.firstname.$model as string,
      lastname: v$.value.lastname.$model as string,
      telephone: v$.value.telephone.$model as number,

      // company: { name: v$.value.company.name.$model as string },
    };

    loading.value = true;
    const response = await request(userStore.create(dataObj), loading);
    handleError(response, userStore);

    const successResponse = handleSuccess(response, showSuccess);
    // console.log(showSuccess.value);

    if (successResponse && typeof successResponse !== "undefined") {
      responseData.value = successResponse;
      openCreateUser.value = false;
      emit("fetchUsers");
    }
  }
};

const firstValidation = () => stringValidate(data.firstname);
const lastValidation = () => stringValidate(data.lastname);

// validations rule
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Email address is required", required),
      email: helpers.withMessage("Must be a valid email", email),
    },

    password: {
      required: helpers.withMessage("Password is required", required),
      min: helpers.withMessage(
        "Password cannot be less than 8 characters",
        minLength(8)
      ),
    },

    confirmPassword: {
      required: helpers.withMessage(" Confirm Password is required", required),
      sameAsPassword: sameAs(data.password, "password"),
    },
    firstname: {
      required: helpers.withMessage("First name  is required", required),

      firstValidate: helpers.withMessage(
        "First name can only include alphabets",
        firstValidation as any
      ),
    },
    lastname: {
      required: helpers.withMessage("Last name  is required", required),

      lastValidate: helpers.withMessage(
        "Last name can only include alphabets",
        lastValidation as any
      ),
    },
    telephone: {
      required: helpers.withMessage("Telephone is required", required),
      validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
    },
    // role_id: {
    //   required: helpers.withMessage("Role id is required", required),
    // },
  };
});

const v$ = useVuelidate(rules as any, data);
</script>

<template>
  <Transition
    name="edit-pension-modal"
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight"
    :duration="400"
  >
    <form @submit.prevent="handleCreate">
      <successAlert
        v-if="showSuccess == true"
        @closeSuccess="showSuccess = false"
        :showSuccess="showSuccess"
      >
        <template #otherMessage>CLOSE</template>
        {{ responseData.message }}
      </successAlert>
      <div class="w-screen z-50 bg-[#000000A3] min-h-screen h-full fixed">
        <div class="flex justify-center">
          <div
            class="lg:p-9 p-5 lg:w-1/3 rounded-lg inline-block align-middle bg-white mt-2 space-y-7"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-black-rgba font-medium text-2xl">
                  Create new user
                </h3>
                <span class="text-sm font-semimedium text-black-rgba-100"
                  >Enter details</span
                >
              </div>
              <button
                @click="openCreateUser = false"
                class="bg-blue-lighter rounded-full top-12 right-12 p-3"
              >
                <IClose />
              </button>
            </div>
            <!--  -->
            <div class="space-y-6">
              <!--  -->
              <div>
                <div
                  class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border text-gray-rgba-3 mb-1"
                >
                  <input
                    type="text"
                    v-model="data.firstname"
                    class="rounded-lg text-sm placeholder-strong text-black bg-transparent outline-none border-none h-full focus:outline-none focus:border-none"
                    placeholder="First name"
                  />
                </div>
                <div v-if="v$.firstname.$error" class="text-red-600 text-xs">
                  {{ "* " + v$.firstname.$errors[0].$message }}
                </div>
              </div>
              <!--  -->
              <!--  -->
              <div>
                <div
                  class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border text-gray-rgba-3 mb-1"
                >
                  <input
                    type="text"
                    v-model="data.lastname"
                    class="rounded-lg text-sm placeholder-strong text-black bg-transparent outline-none border-none h-full focus:outline-none focus:border-none"
                    placeholder="Last name"
                  />
                </div>
                <div v-if="v$.lastname.$error" class="text-red-600 text-xs">
                  {{ "* " + v$.lastname.$errors[0].$message }}
                </div>
              </div>
              <!--  -->

              <!-- <div
                class="font-normal text-left rounded-xl px-4 h-[48px] relative text-gray-rgba-3 border text-black"
              >
                <div class="flex justify-between items-center h-full">
                  <span class="text-sm text-grey-rgba-3"
                    >Select access role</span
                  >
                  <span>
                    <IArrowDown />
                  </span>
                </div>
              </div> -->
              <div>
                <div
                  class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border text-gray-rgba-3 mb-1"
                >
                  <input
                    type="email"
                    v-model="data.email"
                    class="rounded-lg text-sm placeholder-strong text-black bg-transparent outline-none border-none h-full focus:outline-none focus:border-none"
                    placeholder="Email"
                  />
                </div>
                <div v-if="v$.email.$error" class="text-red-600 text-xs">
                  {{ "* " + v$.email.$errors[0].$message }}
                </div>
              </div>
              <!--  -->
              <div>
                <!-- <div class="relative">
                  <vue-tel-input
                    :value="data.telephone"
                    @input="onInput"
                    class="text-black text-sm border py-2 telinput"
                  ></vue-tel-input>

                  <div v-if="v$.telephone.$error" class="text-red-600 text-xs">
                    {{ "* " + v$.telephone.$errors[0].$message }}
                  </div>
                </div> -->
              </div>
              <!--  -->
              <div>
                <div
                  class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border text-gray-rgba-3 mb-1"
                >
                  <input
                    type="password"
                    v-model="data.password"
                    class="rounded-lg text-sm placeholder-strong text-black outline-none border-none h-full focus:outline-none focus:border-none"
                    placeholder="Password"
                  />
                </div>
                <div v-if="v$.password.$error" class="text-red-600 text-xs">
                  {{ "* " + v$.password.$errors[0].$message }}
                </div>
              </div>
              <!--  -->
              <div>
                <div
                  class="font-normal text-left rounded-xl pl-4 h-[48px] my-4 border text-gray-rgba-3 mb-1"
                >
                  <input
                    type="password"
                    v-model="data.confirmPassword"
                    class="rounded-lg text-sm placeholder-strong text-black outline-none border-none h-full focus:outline-none focus:border-none"
                    placeholder="Password"
                  />
                </div>
                <div
                  v-if="v$.confirmPassword.$error"
                  class="text-red-600 text-xs"
                >
                  {{ "* " + v$.confirmPassword.$errors[0].$message }}
                </div>
              </div>
              <!--  -->
            </div>
            <div class="flex pb-5">
              <ButtonBlue>
                <template v-slot:placeholder>
                  <spinner v-if="loading == true" />
                  <span v-else>Create User</span>
                </template>
              </ButtonBlue>
            </div>
          </div>
        </div>
      </div>
    </form>
  </Transition>
</template>

<style scoped>
.telinput {
  border-radius: 14px;
}
</style>
