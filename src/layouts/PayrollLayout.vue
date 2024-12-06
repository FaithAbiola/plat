<script setup lang="ts">
import { ref } from "vue";
import Card from "../components/cards/Card.vue";
import SuccessAlert from "../components/alerts/SuccessAlert.vue";
import Spinner from "../components/timer/Spinner.vue";

import ButtonBlueOutline from "../components/buttons/ButtonBlueOutline.vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
// icons

import { IChartBar, IMemory, IPencil } from "../core/icons";
import { useRoute, useRouter } from "vue-router";

import { isActiveRoute } from "../core/router";

import { request } from "../composables/request.composable"; 
import handleError from "../composables/handle_error.composable";
import handleSuccess from "../composables/handle_success.composable"; 
import { usePayrollStore, useGroupStore, useUserStore } from "../store/index";
import cache from "../composables/swr_cache";
import { getItem } from "../core/utils/storage.helper";
// initialize store
const payrollStore = usePayrollStore();
const groupStore = useGroupStore();  
const userStore = useUserStore(); 
const showModal = ref(false); 
const csvInput = ref<HTMLInputElement | null>(null);
const route = useRoute();
const router = useRouter(); 
 
// variables 
const month = ref();
const saving = ref(false);
const group = ref(); 
const successMessage = ref("");
const showError:any = ref([]);
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const showSuccess = ref(false);

const loading = ref(false);
const payrollData = ref<any>([]);
const draftData = ref<any>([]);
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

// const scheduledMonth = ref(new Date().toISOString());
const scheduledMonth = ref(new Date().toISOString().slice(0, 7)); // Format as YYYY-MM

// methods

// methods
// const fetchPayroll = async () => {
//   loading.value = true;
//   const totalPayrollCached = cache("total_payroll");

//   if (typeof totalPayrollCached !== "undefined") {
//     loading.value = false;
//     payrollData.value = totalPayrollCached;
//   }
//   const response = await request(payrollStore.index(), loading);

//   const successResponse = handleSuccess(response);

//   if (successResponse && typeof successResponse !== "undefined") {
//     // console.log(successResponse.data);
//     payrollData.value = successResponse.data.data;
//     cache("total_payroll", successResponse.data.data);

//     // console.log(successResponse.data);
//   }
// };

const clearInput = () => {
  // console.log(csvInput)
  csvInput.value = null;
}

const fetchDraft = async () => {
  loading.value = true;
  const totalPayrollDraftCached = cache("total_payroll_draft");

  if (typeof totalPayrollDraftCached !== "undefined") {
    loading.value = false;
    draftData.value = totalPayrollDraftCached;
  }
  const response = await request(payrollStore.draft(), loading);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    draftData.value = successResponse.data.data;
    cache("total_payroll_draft", successResponse.data.data);

    // console.log(successResponse.data);
  }
};

// const handleCsvUpload = async (event: Event) => {
//   const file = (event.target as HTMLInputElement)?.files?.[0];

//   if (!file) {
//     console.error('No file selected!');
//     return;
//   }

//   if (!organisationId) {
//     console.error('Organisation ID not found!');
//     return;
//   }

//   console.log('Uploading file:', file.name);
//   try {
//     const response = await payrollStore.importCsvFile({
//       file,
//       organisationId,
//       scheduledMonth: scheduledMonth.value,
//     });

//     console.log('CSV uploaded successfully:', response.data || response);
//     showModal.value = false;
//     showSuccess.value = true;
//     successMessage.value = 'CSV imported successfully!';
//   } catch (error) {
//     console.error('Error uploading CSV:', error);
//     if (error.response) {
//       console.error('Error details:', error.response.data);
//     }
//     showError.value = true;
//   } finally {
//     clearInput();
//   }
// };

const uploadCsv = async () => {
  const fileInput = csvInput.value;
  if (fileInput && fileInput.files) {
    const file = fileInput.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    // const scheduledMonth = month.value; 
    if (!scheduledMonth) {
      console.error('Scheduled month is required');
      return;
    }

    try {
      const response = await payrollStore.uploadPayrollCsv(file, organisationId, scheduledMonth.value);
      console.log('CSV uploaded successfully:', response);
      showModal.value = false;
      showSuccess.value = true;
      successMessage.value = 'CSV imported successfully!';
    } catch (error) {
      console.error('Error uploading CSV:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
    clearInput();
  } else {
    console.error('File input is not available');
  }
};


const downloadCsvTemplate = async () => {
  loading.value = true;
  try {
    await payrollStore.downloadCsvTemplate();
    successMessage.value = "Template downloaded successfully!";
    showModal.value = false; 
    showSuccess.value = true;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};


const importCsv = async () => {
  showModal.value = true;

};
const fetchDraftPayrollCount = async () => {
  loading.value = true;
  const draftPayrollCountCached = cache("draft_payroll_count");

  if (typeof draftPayrollCountCached !== "undefined") {
    loading.value = false;
    draftData.value = draftPayrollCountCached;
  }

    const response = await payrollStore.fetchDraftPayrollCount(organisationId);
    const successResponse = handleSuccess(response);

    if (successResponse && typeof successResponse !== "undefined") {
      draftData.value = successResponse.data.data;
      console.log("AAAAAAAAA", draftData.value)
      cache("draft_payroll_count", successResponse.data.data);
    }
};

const fetchOrganisationPayrollCount = async () => {
  loading.value = true;
  const totalPayrollCached = cache("organisation_payroll_count");

  if (typeof totalPayrollCached !== "undefined") {
    loading.value = false;
    payrollData.value = totalPayrollCached;
    return;
  }

  try {
    const response = await payrollStore.fetchOrganisationPayrollCount(organisationId);
    const successResponse = handleSuccess(response);

    if (successResponse && typeof successResponse !== "undefined") {
      payrollData.value = successResponse.data.data;
      cache("organisation_payroll_count", successResponse.data.data);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

fetchOrganisationPayrollCount(); 

// fetchPayroll();

// fetchDraft();
fetchDraftPayrollCount();
</script>
<template>
  <div class="px-6 py-9 space-y-6">

    <div v-if="showModal" class="flex items-center justify-center fixed top-0 left-0 bg-black/20 h-screen w-screen z-[99999]">
      <div class="box bg-white rounded-md md:w-[500px] w-[95%] h-[360px]">
        <header class="flex flex-col p-4">
          <div class="flex items-center justify-center ml-auto w-[40px] h-[40px] rounded-full bg-grey cursor-pointer" @click="showModal = false">
            <svg width="20px" height="20px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 21.32L21 3.32001" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 3.32001L21 21.32" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </div>
          <div class="text-left mt-7 px-[35px]">
            <h3  class="font-bold text-2xl whitespace-nowrap">Make payment in bulk</h3>
            <p class="text-sm pt-1 font-semimedium">Please upload your file to initiate a bulk payment</p>
          </div>
          <div class="flex flex-col mt-7 gap-4 px-[35px]">
            <button @click="downloadCsvTemplate" class="bg-[#003b3d] text-center text-white px-4+1 py-2.5+1 rounded-full text-sm"
            >
              Download CSV Template
            </button>
            <label
              for="csvInput"
              class="bg-[#003b3d] text-center text-white px-4+1 py-2.5+1 rounded-full text-sm cursor-pointer"
            >
              <span >Import New CSV</span>
            </label>
            <input id="csvInput" ref="csvInput" type="file" accept=".csv" class="hidden" @change="uploadCsv">
          </div>
        </header>
      </div>
    </div>
    <div
      class="w-full flex justify-between lg:space-x-0 space-x-3 overflow-auto scrollbar-hide"
      v-if="route.meta?.showPayrollCards"
    >
      <div class="flex space-x-3 pt-2">
        <h3 class="font-bold lg:text-2xl text-xl">Payroll</h3>
        
      </div>
      <!-- buttons -->
      <div class="flex space-x-4 flex-shrink-0">
        
        <!-- <ButtonBlue @click="router.push('/dashboard/payroll/add-new')" :disabled="false">
          <template v-slot:placeholder>
            <span>Create Payroll</span>
          </template>
        </ButtonBlue> -->
        <ButtonBlue :disabled="false" @click="importCsv">
          <template v-slot:placeholder>
            <span>Bulk Payment</span>
          </template>
        </ButtonBlue>
        <ButtonBlueOutline @click="router.push('/dashboard/payroll/settings')">
          <template v-slot:placeholder>Payroll Settings</template>
        </ButtonBlueOutline>
      </div>
    </div>

    <!-- cards -->
    <!-- IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII -->

    <!-- <div v-if="route.meta?.showPayrollCards" class="grid lg:grid-cols-3 gap-6">
      <router-link to="/dashboard/payroll/history">
        <Card
          :activeColor="
            isActiveRoute('dashboard.payroll.history') ? 'bg-[#003b3d] bg-eclipse-svg-[#306652]' : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.payroll.history')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.payroll.history')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.payroll.history')
              ? 'bg-white/30'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Payroll History</template>
          <template v-slot:text>Total payroll ever had</template>
          <template v-slot:icon>
            <IChartBar />
          </template>
          <template v-slot:other-informations>{{
            payrollData ? payrollData.length : "0"
          }}</template>
        </Card>
      </router-link>
      <router-link to="/dashboard/payroll/drafts">
        <Card
          :activeText="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'bg-[#fff]/40'
              : 'bg-grey-100'
          "
          :activeColor="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'bg-[#074789] bg-eclipse-svg-white'
              : 'bg-white'
          "
        >
          <template v-slot:title>Drafts</template>
          <template v-slot:text>Continue saved payroll</template>
          <template v-slot:icon>
            <IMemory />
          </template>
          <template v-slot:other-informations>{{ draftData }}</template>
        </Card>
      </router-link>
      <router-link to="/dashboard/payroll/add-new">
        <Card
          :activeColor="
            isActiveRoute('dashboard.payroll.add')
            ? 'bg-black' : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.payroll.add')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.payroll.add') ? 'text-white' : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.payroll.add')
              ? 'bg-black-300'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>New Payroll</template>
          <template v-slot:text>Create new payroll</template>
          <template v-slot:icon>
            <IPencil />
          </template>
          <template v-slot:other-informations>{{
            new Date(Date.now()).toLocaleString("default", { month: "long" })
          }}</template>
        </Card>
      </router-link>
    </div> -->

    <!-- IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII -->

    <div v-if="route.meta?.showPayrollCards" class="grid lg:grid-cols-4 gap-2">
      <router-link to="/dashboard/payroll/add-new">
        <Card
          :activeColor="
            isActiveRoute('dashboard.payroll.add')
            ? 'bg-black' : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.payroll.add')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.payroll.add') ? 'text-white' : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.payroll.add')
              ? 'bg-black-300'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>New Payroll</template>
          <template v-slot:text>Create new payroll</template>
          <template v-slot:icon>
            <IPencil />
          </template>
          <template v-slot:other-informations>{{
            new Date(Date.now()).toLocaleString("default", { month: "long" })
          }}</template>
        </Card>
      </router-link>
      <router-link to="/dashboard/payroll/pending">
        <Card
          :activeText="
            isActiveRoute('dashboard.payroll.pending')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.payroll.pending')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.payroll.pending')
              ? 'bg-[#fff]/40'
              : 'bg-grey-100'
          "
          :activeColor="
            isActiveRoute('dashboard.payroll.pending')
              ? 'bg-[#074789] bg-eclipse-svg-white'
              : 'bg-white'
          "
        >
          <template v-slot:title>Pending Payroll</template>
          <template v-slot:text>Approve and decline a payroll</template>
          <template v-slot:icon>
            <IMemory />
          </template>
          <template v-slot:other-informations>0</template>
        </Card>
      </router-link>
      <router-link to="/dashboard/payroll/drafts">
        <Card
          :activeText="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'bg-[#fff]/40'
              : 'bg-grey-100'
          "
          :activeColor="
            isActiveRoute('dashboard.payroll.drafts')
              ? 'bg-[#074789] bg-eclipse-svg-white'
              : 'bg-white'
          "
        >
          <template v-slot:title>Drafts</template>
          <template v-slot:text>Continue saved payroll</template>
          <template v-slot:icon>
            <IMemory />
          </template>
          <template v-slot:other-informations>{{ draftData }}</template>
        </Card>
      </router-link>
      <router-link to="/dashboard/payroll/history">
        <Card
          :activeColor="
            isActiveRoute('dashboard.payroll.history') ? 'bg-[#003b3d] bg-eclipse-svg-[#306652]' : 'bg-white'
          "
          :activeText="
            isActiveRoute('dashboard.payroll.history')
              ? 'text-white'
              : 'text-black-rgba-100'
          "
          :activeOtherInfoColor="
            isActiveRoute('dashboard.payroll.history')
              ? 'text-white'
              : 'text-black'
          "
          :activeIconBg="
            isActiveRoute('dashboard.payroll.history')
              ? 'bg-white/30'
              : 'bg-grey-100'
          "
        >
          <template v-slot:title>Payroll History</template>
          <template v-slot:text>Total payroll ever had</template>
          <template v-slot:icon>
            <IChartBar />
          </template>
          <template v-slot:other-informations>{{ payrollData }}</template>
        </Card>
      </router-link>
    </div>

    <!-- end of cards -->
    <router-view />
  </div>
</template>

<style> </style>
