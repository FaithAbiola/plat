<script setup lang="ts">
import { ref, computed, provide, reactive, onMounted, inject } from "vue";
import { useRouter } from "vue-router";
import { IArrowDown } from "../../../core/icons";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import errorType from "../../../constants/ErrorTypes";
import SuccessAlert from "../../../components/alerts/SuccessAlert.vue";
import State from "../../../components/dropdowns/states.vue";
import Industries from "../../../components/dropdowns/industries.vue";
import City from "../../../components/dropdowns/cities.vue";
import { stringValidate, numberValidate } from "../../../validations/validate";
import { State as StateEnum } from "../../../interface/enums.interface";
import { Industry as IndustryEnum } from "../../../interface/enums.indutries";
// import {  } from "../../../interface/enums.interface";
import {
  useCompanyStore,
  useUserStore,
  useAuthStore,
} from "../../../store/index";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";

const router = useRouter();

// initialize store
const companyStore = useCompanyStore();
const userStore = useUserStore();
const authStore = useAuthStore();
// variables

const showSuccess = ref(false);
const loading = ref(false);
const showState = ref(false);
const showIndustries = ref(false);
const showCity = ref(false);
const disabled = ref(true);
const profile = ref<any>();
const defaultCompanyId = ref("");
const responseData = ref({ message: "action successful" });
const render = inject<any>("render");

// let data = ref<any>({
//   name: "",
//   email: "",
//   telephone: "",
//   city: "",
//   country: "Nigeria",
//   address: "",
//   industry: "",
//   currency: 1,
// });
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
  telephone: string | null;
  email: string | null;
  organisationName?: string; 
  country?: string;
  city: string;
  state: StateType;
  street?: string;
}>({
  telephone: null,
  email: null,
  organisationName: undefined,
  country: undefined,
  city: "",
  state: "Lagos",
  street: undefined,
});
const valid = ref(false);

const state = ref<StateEnum>();
const industryState = ref<StateEnum>();
const city = ref();
// provide and inject
provide("showState", showState);
provide("selectedState", state);
provide("showIndustries", showIndustries);
provide("selectedIndustries", industryState);
provide("showCity", showCity);
provide("selectedCity", city);

// emits
const emit = defineEmits<{
  (e: "loadingTrue"): void;
  (e: "loadingFalse"): void;
}>();
// methods

const onInput = (phone: number, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.value.telephone = phoneObject.number;
    valid.value = phoneObject.valid;
  }
};

const validatePhone = (phone: string) => {
  if (!phone) return true; 
  const phoneRegex = /^\+\d{1,3}\d{9,14}$/; 
  return phoneRegex.test(phone);
};



const capitalizeFirstLetter = (name: string | null) => {
  if (!name) return "";
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
        email: userData.email || "", 
        telephone: telephone || "", 
        organisationName: capitalizeFirstLetter(organisationData.organisationName || ""),
        street: organisationData.address.street || "",
        city: organisationData.address.city || "", 
        state: organisationData.address.state || "", 
        country: organisationData.address.country || "", 
      };

      state.value = data.value.state as StateEnum;
      city.value = data.value.city;
      console.log("Updated Data:", data.value);
    } else {
      console.error("Invalid response data:", successResponse);
    }
  }
};


fetchUserDetails();

// const saveChanges = async () => {
//   const isFormCorrect = await v$.value.$validate();

//   if (isFormCorrect == true) {
//     const sendData = {
//       email: v$.value.email.$model as string,
//       city: city.value as string,
//       country: data.value.country as string,
//       state: state.value as StateEnum,
//       industry: industryState.value as string,
//       currency: data.value.currency as number,
//       address: v$.value.address.$model as string,
//       telephone: v$.value.telephone.$model as number,
//       name: v$.value.name.$model as string,
//     };

//     loading.value = true;
//     emit("loadingTrue");

//     // if there is no default company
//     if (defaultCompanyId.value === "") {
//       const response = await request(companyStore.create(sendData), loading);
//       // console.log(response);
//       emit("loadingFalse");
//       handleError(response, userStore);
//       const successResponse = handleSuccess(response, showSuccess);

//       if (successResponse && typeof successResponse !== "undefined") {
//         getProfile();
//         responseData.value = successResponse;
//         responseData.value.message = "Company information added successfully";
//         // console.log(successResponse.data);
//       }

//       // loading.value = false;
//       // emit("loadingFalse");
//       // userStore.error.type = errorType.userError;
//       // userStore.error.message =
//       //   "There is no default company associated with this account.Try setting a default company by switching";
//       // return (userStore.error.value = true);
//     } else {
//       const response = await request(
//         companyStore.update(sendData, defaultCompanyId.value),
//         loading
//       );
//       // console.log(response);
//       emit("loadingFalse");
//       handleError(response, userStore);
//       const successResponse = handleSuccess(response, showSuccess);

//       if (successResponse && typeof successResponse !== "undefined") {
//         responseData.value = successResponse;
//         responseData.value.message = "Company information updated successfully";
//         // console.log(successResponse.data);
//       }
//     }
//   }
// };


const updateProfile = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    const phoneNumber = v$.value.telephone.$model as string;

    // Extract country code and actual phone number
    const countryCode = phoneNumber.match(/^\+\d{1,3}/)?.[0] || '';
    const actualNumber = phoneNumber.replace(countryCode, '').trim();
    const formattedNumber = actualNumber.startsWith('0') ? actualNumber : '0' + actualNumber;
    const userId = Number(localStorage.getItem('userId'));

    const dataObj = {
      userId: userId,
      organisationName: data.value.organisationName, 
      email: v$.value.email.$model as string,
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

// validations rule
const rules = computed(() => {
  return {
    email: {
      email: helpers.withMessage("Must be a valid email", email),
    },

    telephone: {
      // required: helpers.withMessage("Telephone is required", required),
      validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
    },

    // name: {
    //   stringValidate: helpers.withMessage(
    //     "First name can only include alphabets",
    //     () => stringValidate(data.value.organisationName as string) as any
    //   ),
    // },
    address: {
      // required: helpers.withMessage("Company address is required", required),
    },
    // city: {
    //   required: helpers.withMessage("City is required", required),
    //   stringValidate: helpers.withMessage(
    //     "City can only include alphabets",
    //     () => stringValidate(data.city as string) as any
    //   ),
    // },
    // country: {
    //   required: helpers.withMessage("Country is required", required),
    //   stringValidate: helpers.withMessage(
    //     "Country can only include alphabets",
    //     () => stringValidate(data.country as string) as any
    //   ),
    // },
    // state: {
    //   required: helpers.withMessage("State is required", required),
    //   stringValidate: helpers.withMessage(
    //     "State can only include alphabets",
    //     () => stringValidate(data.state as string) as any
    //   ),
    // },
    // currency: {
    //   required: helpers.withMessage("Currency is required", required),
    //   stringValidate: helpers.withMessage(
    //     "Currency can only include alphabets",
    //     () => stringValidate(data.currency as string) as any
    //   ),
    // },
  };
});

// getProfile();
const v$ = useVuelidate(rules as any, data);

// define expose
defineExpose({
  updateProfile,
  disabled,
  v$,
});
</script>
<template>
  <div class="lg:px-0 lg:flex !px-6 w-full">
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ responseData.message }}</successAlert
    >
    <div class="space-y-5 md:!w-[70%]">
      <div class="">
        <div class="space-y-1">
          <p class="text-base font-medium">Company information</p>
          <p class="text-sm text-gray-rgba-3">
            Edit details as registered with CAC
          </p>
        </div>
      </div>
      <div class="space-y-8">
        <div class="pt-7 space-y-2">
          <p class="text-base font-medium text-black-rgba-100">Contact</p>

          <div class="grid sm:grid-cols-2 gap-4">
            <div class="relative">
              <input
                type="text"
                @click="disabled = false"
                v-model="data.organisationName"
                id="NameofCompany"
                maxlength="55"
                class="input-float peer pr-10.5"
              />
              <label
                for="NameofCompany"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Name Of Company</label
              >
              <!-- <div v-if="v$.name.$error" class="text-red-600 text-xs">
                {{ "* " + v$.name.$errors[0].$message }}
              </div> -->
            </div>

            <div class="relative">
              <input
                type="email"
                @click="disabled = false"
                v-model="data.email"
                id="emailAddress"
                maxlength="55"
                class="input-float peer pr-10.5"
              />
              <label
                for="emailAddress"
                class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
              >
                Email Address</label
              >
              <div v-if="v$.email.$error" class="text-red-600 text-xs">
                {{ "* " + v$.email.$errors[0].$message }}
              </div>
            </div>

            <div>
              <div class="relative">
                <!-- <vue-tel-input
                  :value="data.telephone"
                  @input="onInput"
                  class="text-black text-sm border py-2 telinput"
                ></vue-tel-input> -->
                <input
                  type="tel"
                  id="Telephone"
                  v-model="data.telephone"
                  maxlength="14"
                  class="input-float text-black peer pr-10.5"
                  placeholder="+2348145951347"
                />
                <label
                  for="Telephone"
                  class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
                >
                  Telephone (with country code)</label
                >
                <div v-if="v$.telephone.$error" class="text-red-600 text-xs">
                  {{ "* " + v$.telephone.$errors[0].$message }}
                </div>
              </div>
            </div>

            <!-- <div class="relative w-auto">
              <div
                class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
              >
                <input
                  type="text"
                  :value="industryState"
                  @click="[(showIndustries = true), (disabled = false)]"
                  class="rounded-lg text-sm text-black outline-none py-4 border-none focus:outline-none docus:border-none"
                  placeholder="Select Industry"
                />
                <span @click="showIndustries = !showIndustries">
                  <IArrowDown />
                </span>
              </div>
              <div
                class="absolute z-50 h-56 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
                v-if="showIndustries == true"
              >
                <div>
                  <component :is="Industries"></component>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
      <!--  -->
      <div class="pt-7 space-y-2">
        <p class="text-base font-medium text-black-rgba-100">
          Company Location
        </p>

        <div class="grid lg:grid-cols-2 gap-4">
          <div class="relative w-auto">
            <div
              class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
            >
              <input
                @click="[(showState = true), (disabled = false)]"
                :value="data.state"
                type="text"
                class="rounded-lg text-black text-sm outline-none py-4 border-none focus:outline-none focus:border-none"
                placeholder="Select State"
              />
              <span @click="showState = !showState">
                <IArrowDown />
              </span>
            </div>
            <div
              class="absolute z-50 h-56 shadow-lg scrollbar-hide overflow-auto top-15 w-full"
              v-if="showState == true"
            >
              <div>
                <component :is="State" :data="data"></component>
              </div>
            </div>
          </div>

          <div class="relative w-auto">
            <div
              class="cursor-pointer font-normal items-center text-left rounded-lg px-2 border text-gray-rgba-3 flex justify-between"
            >
              <input
                @click="[(showCity = true), (disabled = false)]"
                :value="city"
                type="text"
                class="rounded-lg text-black text-sm outline-none py-4 border-none focus:outline-none focus:border-none"
                placeholder="Select City"
              />
              <span @click="showCity = !showCity">
                <IArrowDown />
              </span>
            </div>
            <div
              class="absolute z-50 max-h-56 h-auto shadow-lg scrollbar-hide overflow-auto top-15 w-full"
              v-if="showCity == true"
            >
              <div>
                <component :is="City" :data="data" :state="data.state"></component>
              </div>
            </div>
          </div>
          <div class="relative">
            <textarea
              v-model="data.street"
              @click="disabled = false"
              id="companyAddress"
              class="input-float peer h-[12rem] pr-10.5"
            ></textarea>
            <label
              for="companyAddress"
              class="input-float-label peer-focus:text-black-100 peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2"
            >
              Company Address</label
            >
            <div v-if="v$.address.$error" class="text-red-600 text-xs">
              {{ "* " + v$.address.$errors[0].$message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.telinput {
  border: 1px solid black;
  border-radius: 7px;
}
</style>
