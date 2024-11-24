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

const route = useRoute();
const router = useRouter();

// variables
const month = ref();
const saving = ref(false);
const group = ref();
const successMessage = ref("");
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const showSuccess = ref(false);

const loading = ref(false);
const payrollData = ref<any>([]);
const draftData = ref<any>([]);
  const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;

const organisationId = parsedUserInfo?.customerInfo?.organisationId;
// methods

// methods
const fetchPayroll = async () => {
  loading.value = true;
  const totalPayrollCached = cache("total_payroll");

  if (typeof totalPayrollCached !== "undefined") {
    loading.value = false;
    payrollData.value = totalPayrollCached;
  }
  const response = await request(payrollStore.index(), loading);

  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);
    payrollData.value = successResponse.data.data;
    cache("total_payroll", successResponse.data.data);

    // console.log(successResponse.data);
  }
};

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

// fetchPayroll();

// fetchDraft();
fetchDraftPayrollCount();
</script>
<template>
  <div class="px-6 py-9 space-y-6">
    <div
      class="w-full flex justify-between lg:space-x-0 space-x-3 overflow-auto scrollbar-hide"
      v-if="route.meta?.showPayrollCards"
    >
      <div class="flex space-x-3 pt-2">
        <h3 class="font-bold lg:text-2xl text-xl">Payroll</h3>
        
      </div>
      <!-- buttons -->
      <div class="flex space-x-4 flex-shrink-0">
        <ButtonBlueOutline @click="router.push('/dashboard/payroll/settings')">
          <template v-slot:placeholder>Payroll Settings</template>
        </ButtonBlueOutline>
        <!-- <ButtonBlue @click="router.push('/dashboard/payroll/add-new')">
          <template v-slot:placeholder>
            <span>Create Payroll </span>
          </template>
        </ButtonBlue> -->
      </div>
    </div>

    <!-- cards -->
    <div v-if="route.meta?.showPayrollCards" class="grid lg:grid-cols-3 gap-6">
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
    </div>

    <!-- end of cards -->
    <router-view />
  </div>
</template>

<style></style>
