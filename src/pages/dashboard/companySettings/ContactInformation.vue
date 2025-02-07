<script setup lang="ts">
import { IArrowDown } from "../../../core/icons";
import { ref, computed, provide, reactive, onMounted, inject } from "vue";
import { request } from "../../../composables/request.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import handleError from "../../../composables/handle_error.composable";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { stringValidate, numberValidate } from "../../../validations/validate";

import {
  useCompanyStore,
  useUserStore,
  useAuthStore,
} from "../../../store/index";


const userStore = useUserStore();
const authStore = useAuthStore();



const loading = ref(false);
const showSuccess = ref(false);
const responseData = ref({ message: "action successful" });
const render = inject<any>("render");

type StateType = 
  | "Bauchi" 
  | "Enugu" 
  | "Gombe" 
  | "Kaduna" 
  | "Kano" 
  | "Katsina" 
  | "Lagos" 
  | "Nasarawa" 
  | "Ondo" 
  | "Oyo" 
  | "Sokoto" 
  | "FederalCapitalTerritory" 
  | "Abia" 
  | "Adamawa" 
  | "AkwaIbom" 
  | "Bayelsa" 
  | "Benue" 
  | "Borno" 
  | "CrossRiver" 
  | "Delta" 
  | "Ebonyi" 
  | "Ekiti" 
  | "Imo" 
  | "Jigawa" 
  | "Kebbi" 
  | "Kogi" 
  | "Kwara" 
  | "Niger" 
  | "Ogun" 
  | "Osun" 
  | "Plateau" 
  | "Rivers" 
  | "Taraba" 
  | "Yobe" 
  | "Zamfara";

let data = ref<{
  firstname: string | null;
  lastname: string | null;
  country?: string;
  city?: string;
  state?: StateType;
  street?: string;
  telephone: string | null;
}>({
  firstname: null,
  lastname: null,
  telephone: null,
  country: undefined,
  city: "",
  state: "Lagos",
  street: undefined,
});

const disabled = ref(true);

const capitalizeFirstLetter = (name: string | null) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const fetchUserDetails = async () => {
  const userId = Number(localStorage.getItem('userId'));
  console.log("User ID:", userId); 
  
  if (userId) {
    const response = await request(userStore.show(userId)); 
    console.log("API Response:", response);
    
    const successResponse = handleSuccess(response);
    
    if (successResponse && successResponse.data && successResponse.data.data) {
      const userData = successResponse.data.data.organisation.user; 
      const organisationData = successResponse.data.data.organisation; 
      const countryCode = userData.phone.countryCode || ""; 
      const phoneNumber = userData.phone.number || ""; 
      const formattedNumber = phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber; 
      const telephone = `${countryCode}${formattedNumber}`;
      
      data.value = {
        firstname: capitalizeFirstLetter(userData.firstname || ""), 
        lastname: capitalizeFirstLetter(userData.lastname || ""),
        telephone: telephone || "",
        street: organisationData.address.street || "",
        city: organisationData.address.city || "", 
        state: organisationData.address.state || "", 
        country: organisationData.address.country || "", 
      };

      console.log("Updated Data:", data.value);
    } else {
      console.error("Invalid response data:", successResponse);
    }
  }
};


const updateProfile = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    const phoneNumber = data.value.telephone as string;

    // Extract country code and actual phone number
    const countryCode = phoneNumber.match(/^\+\d{1,3}/)?.[0] || '';
    const actualNumber = phoneNumber.replace(countryCode, '').trim();
    const formattedNumber = actualNumber.startsWith('0') ? actualNumber : '0' + actualNumber;
    // const userId = Number(localStorage.getItem('userId'));

    const userId = Number(localStorage.getItem('userId'));

    const dataObj = {
      userId: userId,
      firstName: v$.value.firstname.$model as string,
      lastName: v$.value.lastname.$model as string,
      countryCode: countryCode,
      phoneNumber: formattedNumber, 
      country: data.value.country, 
      city: data.value.city, 
      state: data.value.state, 
      street: data.value.street,
    };
console.log("===========", dataObj)
    loading.value = true;
    try {
    const response = await request(authStore.updateProfile(dataObj), loading);

    handleError(response, userStore);
    const successResponse = handleSuccess(response, showSuccess);

    if (successResponse && successResponse.data && successResponse.data.succeeded) {
      // Handle success response
      responseData.value = {
        message: successResponse.data.message,
      };
      showSuccess.value = true; 
      render.value = true;
      
      await fetchUserDetails();
    }
    } catch (error) {
      console.error("Error updating profile:", error);
      responseData.value.message = "An error occurred while updating the profile.";
    } finally {
      loading.value = false;
    }
  }
};

fetchUserDetails();
const rules = computed(() => {
  return {
   
    firstname: {
      stringValidate: helpers.withMessage(
        "First name can only include alphabets",
        () => stringValidate(data.value.firstname as string) as any
      ),
    },
    lastname: {
      stringValidate: helpers.withMessage(
        "Last name can only include alphabets",
        () => stringValidate(data.value.lastname as string) as any
      ),
    },
  }
});


const v$ = useVuelidate(rules as any, data);

defineExpose({
  updateProfile,
  disabled,
  v$,
});

</script>
<template>
  <div class="lg:px-0 lg:flex justify-center px-6 w-full">
    <div class="space-y-5">
      <div class="lg:w-[75%]">
        <div class="space-y-1">
          <p class="text-base font-medium">Contact information</p>
          <p class="text-sm text-gray-rgba-3">
            Details of company representative
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="pt-7 space-y-2">
          <p class="text-base font-medium text-black-rgba-100">Contact</p>

          <div class="grid sm:grid-cols-2 gap-4">
            <div
              class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
            >
              <input
                type="text"
                class="rounded-lg text-black  text-sm py-4 outline-none border-none focus:outline-none docus:border-none"
                placeholder="Select Industry"
              />
              <span>
                <IArrowDown />
              </span>
            </div>

            <div class="relative">
              <input
                type="text"
                id="Emalrole"
                maxlength="55"
                class="input-float peer pr-10.5"
              />
              <label
                for="Emalrole"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Emal role</label
              >
            </div>

            <div class="relative">
              <input
                type="text"
                id="Name"
                @click="disabled = false"
                v-model="data.firstname"
                maxlength="55"
                class="input-float text-black peer pr-10.5"
                placeholder=""
              />
              <label
                for="Name"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                First Name</label
              >
              <div v-if="v$.firstname.$error" class="text-red-600 text-xs">
                {{ "* " + v$.firstname.$errors[0].$message }}
              </div>
            </div>

            <div class="relative">
              <input
                type="text"
                @click="disabled = false"
                v-model="data.lastname"
                id="lastName"
                maxlength="55"
                class="input-float text-black peer pr-10.5"
                placeholder=""
              />
              <label
                for="lastname"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Last name</label
              >
              <div v-if="v$.lastname.$error" class="text-red-600 text-xs">
                {{ "* " + v$.lastname.$errors[0].$message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
