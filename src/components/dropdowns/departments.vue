<script setup lang="ts">
import { provide, ref, inject } from "vue";
import { useGroupStore, useUserStore } from "../../store/index";
import { request } from "../../composables/request.composable";
import handleError from "../../composables/handle_error.composable";
import handleSuccess from "../../composables/handle_success.composable";
import cache from "../../composables/swr_cache";
import { getItem } from "../../core/utils/storage.helper";

// Initialize store
const groupStore = useGroupStore();
const userStore = useUserStore();

// Variables
const departments = ref<any>([]);
const stateMessage = ref<string>("");
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;

// Access the organisationId safely
const organisationId = parsedUserInfo?.customerInfo?.organisationId;
console.log("~~~~~~~~~~~~~:", organisationId);

// Emits
const emit = defineEmits<{ (e: "setGrades", grades: any[]): void }>();

// Provide and inject
const showDepartment = inject<any>("showDepartment");
// let selectedDepartment = inject<any>("selectedDepartment");
const selectedDepartments = ref(Array(5).fill({ departmentId: null, name: "" })); // Array for selected departments

provide("selectedDepartmentss", selectedDepartments); // Provide the array

// Methods
const selectDepartments = (department: any, index: number) => {
  selectedDepartments.value[index].departmentId = department.id; // Set departmentId for the specific index
  selectedDepartments.value[index].name = department.name; // Set department name
  showDepartment.value = false;

  emit("setGrades", department.grades);
};

// Methods
// const selectDepartment = (department: any) => {
//   selectedDepartment[0].value.departmentId = department.id; // Set departmentId
//   selectedDepartment[1].value = department.name;
//   showDepartment.value = false;

//   emit("setGrades", department.grades);
// };

const getDepartments = async () => {
  const cachedData = cache("departments");
  console.log("cachedData-----", cachedData);

  if (typeof cachedData !== "undefined") {
    departments.value = cachedData;
  }

  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    const response = await request(groupStore.index(organisationId, 10, page)); // Fetching 10 per page
    const successResponse = handleSuccess(response);

    if (successResponse && successResponse.data.data.pageItems.length > 0) {
      departments.value = [...departments.value, ...successResponse.data.data.pageItems];
      page++;
    } else {
      hasMoreData = false; // No more data to fetch
    }
  }

  cache("departments", departments.value);

  if (departments.value.length === 0) {
    stateMessage.value = "You do not have any departments at the moment";
  }
};

getDepartments();
</script>

<template>
  <div class="space-y-5 p-6 shadow-rgba text-black bg-white text-sm font-bold rounded-lg w-auto">
    <div v-if="departments.length > 0">
        <div v-for="(department, index) in departments" :key="department.id">
          <p @click="selectDepartments(department, index)" class="cursor-pointer">
            {{ department.name }}
          </p>
        </div>
      </div>
    <p v-else class="text-sm text-black text-center">
      {{ stateMessage }}
    </p>
  </div>
</template>

<style></style>