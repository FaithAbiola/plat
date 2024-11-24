<script setup lang="ts">
import { ref, provide, watch, onMounted, nextTick, reactive } from "vue";
import successAlert from "../../../components/alerts/SuccessAlert.vue";
import spinner from "../../../components/timer/Spinner.vue";

import { Create, EmployeePayroll } from "../../../service/payroll/interface/payroll.interface";
import {
  IIncDec,
  IMenuVertical,
  IUserThree,
  ITablePencil,
} from "../../../core/icons";
import Departments from "../../../components/dropdowns/department.vue";

import ButtonBlueOutline from "../../../components/buttons/ButtonBlueOutline.vue";
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import general from "../../../components/dropdowns/general.vue";

import AddBonus from "../../../modals/AddBonus.vue";
import AddDeduction from "../../../modals/AddDeduction.vue";
import EmptyState from "../../../components/EmptyState.vue";
import { useRouter } from "vue-router";
import { request } from "../../../composables/request.composable";
import handleError from "../../../composables/handle_error.composable";
import handleSuccess from "../../../composables/handle_success.composable";
import {
  usePayrollStore,
  useEmployeeStore,
  useUserStore,
} from "../../../store/index";
import cache from "../../../composables/swr_cache";
import { getItem } from "../../../core/utils/storage.helper";

// initialize router
const router = useRouter();

// initialize store
const payrollStore = usePayrollStore();
const userStore = useUserStore();
const employeeStore = useEmployeeStore();

// variables

const departmentName = ref("");
const showDepartment = ref(false);
const data = ref({ department: "all" });

const showSuccess = ref(false);
const editInput = ref(false);
const loading = ref(false);
const saving = ref(false);
const showBonus = ref(false);
const showDeduction = ref(false);
const employeeId = ref("");
const employeeAmount = ref(0);
const dataObj = ref<any>({});
const responseData = ref<any>({ data: [], message: "" });
const payrollData = ref<EmployeePayroll[]>([]); // Specify that this is an array of Payroll
const employeeMap = ref<Record<string, string>>({}); // Declare employeeMap here
const successMessage = ref("Action successful");
const showDropDown = ref(false);
const grandTotal = ref({
  grossPay: 0,
  bonus: 0,
  deductions: 0,
  taxAmount: 0,
  netPay: 0,
})

const dataObjj = reactive({
    employees: []
});

const getPayrollData = (id: number, field: string) => {
    const payrollItem = payrollData.value.find(item => item.employeeId === id);
    console.log("$$$$$", payrollData.value)
    return payrollItem ? payrollItem[field] : null;
};

const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10); 
const totalItems = ref(0);

const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;

// const savingDraft = ref(false);
const edit = ref(false);
// const draft = ref({
//   month: "",
//   year: "",
//   department: null,
//   start_date: "",
//   end_date: "",
//   draft: true,
// });
// inject and provide
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("employeeMap", employeeMap);
// method

// const saveAsDraft = async () => {
//   savingDraft.value = true;

//   const day = new Date(Date.now()).getDate() as unknown as string;
//   const year = new Date(Date.now()).getFullYear() as unknown as string;
//   const month = new Date(Date.now()).toLocaleString("default", {
//     month: "long",
//   });
//   let numberMonth: any = new Date(Date.now()).getMonth() + 1;

//   if (numberMonth < 10) {
//     numberMonth = `0${numberMonth}`;
//   }

//   draft.value.year = year;
//   draft.value.month = month;
//   draft.value.start_date = `${year}-${numberMonth}-${day}`;

//   const response = await request(
//     payrollStore.create(draft.value as any),
//     savingDraft
//   );

//   console.log(response);
//   handleError(response, userStore);
//   const successResponse = handleSuccess(response, showSuccess);

//   if (successResponse && typeof successResponse !== "undefined") {
//     console.log(successResponse.data);
//   }
// };

const add = (id: any, valueId: string) => {
  editInput.value = true;
  const target: HTMLInputElement = document.getElementById(
    valueId
  ) as HTMLInputElement;

  let encounteredId = false;

  const data = {
    id: null,
    payment_extras: {
      bonus: null,
      deductions: null,
      leave_allowance: false,
    },
  };

  data.id = id;

  data.payment_extras[valueId.split(id)[1] as keyof Object] =
    target.value as any;

  dataObj.value.employees = [];
  if (dataObj.value?.employees[0]) {
    for (let i = 0; i < dataObj.value.employees.length; i++) {
      if (
        dataObj.value.employees[i].id &&
        dataObj.value.employees[i].id === id
      ) {
        // console.log("encountered ooo");
        encounteredId = true;
        data.payment_extras.bonus != null &&
          (dataObj.value.employees[i].payment_extras.bonus =
            data.payment_extras.bonus);

        data.payment_extras.deductions != null &&
          (dataObj.value.employees[i].payment_extras.deductions =
            data.payment_extras.deductions);

        dataObj.value.employees[i].payment_extras.leave_allowance =
          data.payment_extras.leave_allowance;
        // console.log(dataObj.value);
        return;
      }
    }
    if (encounteredId == false) {
      dataObj.value.employees.push(data);
      // console.log(dataObj.value);
    }
  } else {
    // console.log(data);
    dataObj.value?.employees.push(data);
    // console.log(dataObj.value);
    return;
  }
};

const formatNumber = (number:number) => {
  return number.toLocaleString();
}
const fetchEmployees = async (page = 1) => {
  loading.value = true;

  const totalEmployeeCached = cache("total_employees");
  if (typeof totalEmployeeCached !== "undefined") {
    loading.value = false;
    responseData.value.data = totalEmployeeCached;
  }

  const response = await request(employeeStore.index(organisationId, 10, page), loading);
  const successResponse = handleSuccess(response);

  if (successResponse) {
    const employees = successResponse.data.data.pageItems;
    responseData.value.data = employees;
    console.log("$$$$$", employees)

    // Populate the mapping
    employees.forEach((employee: { firstName: any; lastName: any; id: string | number; }) => {
      // Combine firstName and lastName to create the full name
      const fullName = `${employee.firstName} ${employee.lastName}`;
      employeeMap.value[employee.id] = fullName; // Map ID to full name
      console.log("", fullName)
      console.log("Mapped Employee:", employee.id, fullName);
    });

    cache("total_employees", employees);
    currentPage.value = successResponse.data.data.currentPage;
    totalPages.value = successResponse.data.data.numberOfPages;
    totalItems.value = responseData.value.data.length; 
    return employees; 
  }
};


// Fetch payroll data for each employee
const fetchAllPayrolls = async () => {
  const employees = await fetchEmployees();

  if (!employees) return;

  payrollData.value = []; // Reset payroll data array
  for (const employee of employees) {
    const payrollResponse = await payrollStore.fetchEmployeePayroll(organisationId, employee.id);
    
    if (payrollResponse.succeeded && Array.isArray(payrollResponse.data.pageItems)) {
      const payrollItems = payrollResponse.data.pageItems as EmployeePayroll[];

      payrollItems.forEach(payroll => {
        const employeeName = employeeMap.value[employee.id];
        if (employeeName) {
          payroll.employeeName = employeeName; // Assign employee name to the payroll item
          payrollData.value.push(payroll); // Add payroll items to the main payroll data array
        }
      });
    }
  }

  calculateGrandTotals(); // Calculate grand totals after fetching all payrolls
};

// Calculate grand totals from payroll data
const calculateGrandTotals = () => {
  grandTotal.value.grossPay = payrollData.value.reduce((acc, item) => acc + item.grossPay, 0);
  grandTotal.value.bonus = payrollData.value.reduce((acc, item) => acc + (item.bonus?.amount || 0), 0);
  grandTotal.value.deductions = payrollData.value.reduce((acc, item) => acc + (item.deduction?.amount || 0), 0);
  grandTotal.value.taxAmount = payrollData.value.reduce((acc, item) => acc + item.taxAmount, 0);
  grandTotal.value.netPay = payrollData.value.reduce((acc, item) => acc + item.netPay, 0);
};





fetchEmployees();
fetchAllPayrolls();

</script>
<template>
  <div class="bg-white h-full rounded-t-lg py-6 space-y-5 overflow-auto scrollbar-hide">
    <!-- modals -->
    <AddBonus
      :employeeId="employeeId"
      :employeeAmount="employeeAmount"
      v-if="showBonus == true"
      @close_bonus="showBonus = false"
      @payroll_init="fetchPayroll"
    />
    <AddDeduction
      :employeeId="employeeId"
      v-if="showDeduction == true"
      :employeeAmount="employeeAmount"
      @payroll_init="fetchPayroll"
      @close_deduction="showDeduction = false"
    />
    <!-- successAlert -->
    <successAlert
      :showSuccess="showSuccess"
      @closeSuccess="showSuccess = false"
      v-if="showSuccess == true"
    >
      <template #otherMessage>CLOSE</template>
      {{ successMessage }}</successAlert
    >
    <div class="px-5 py-2">
      <div class="space-y-6">
        <div class="flex justify-between">
          <div>
            <h3 class="font-bold text-2xl">Create new Payroll</h3>
            <p class="text-sm pt-1 font-semimedium">
              <span class="text-black-200">Payroll period: </span>
              <span>&nbsp;</span>
            </p>
          </div>
          <div>
            <ButtonBlue @click="router.push('/dashboard/payroll/preview')">
              <template v-slot:placeholder>
                <span>Save & Continue</span></template
              >
            </ButtonBlue>
          </div>
        </div>

        <div class="relative w-20">
          <div class="flex space-x-2">
            <span
              @click="showDepartment = !showDepartment"
              class="text-sm pt-1 font-semimedium text-black-200 whitespace-nowrap cursor-pointer"
            >
              {{ departmentName === "" ? "Sort by Department" : departmentName }}</span
            >
            <span class="pt-2">
              <IIncDec @click="showDepartment = !showDepartment" />
            </span>
          </div>

          <div
            class="absolute z-50 max-h-56 shadow-lg scrollbar-hide overflow-auto top-8 w-auto"
            v-if="showDepartment == true"
          >
            <div class="">
              <component :is="Departments"></component>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-10">
      <spinner
        v-if="loading == true"
        class="flex justify-center items-center lg:h-[400px] h-[300px]"
      />
      <!-- table -->
      <div v-else>
        <div class="border-t border-grey">
          <div class="py-6">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <table id="data-table" class="min-w-full table-fixed">
                  <thead
                    class="text-black-200 text-sm text-left"
                  >
                    <tr>
                      <!-- <th scope="col" class="">
                        <span> S/N </span>
                      </th> -->
                      <th scope="col" class="py-4 text-left flex items-center space-x-3">
                        <span> Name </span>
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Gross Pay
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Bonus
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Deductions
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Tax
                      </th>
                      <th scope="col" class="py-4 text-left whitespace-nowrap">
                        Net Pay
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-grey-200">
                    <tr
                      v-for="(employee, index) in responseData && responseData.data"
                      :key="employee.id"
                      class="text-black-100"
                    >
                      <!-- <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium">{{ index + 1 }}</span>
                          </div>
                        </div>
                      </td> -->
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium">{{ employee.firstName }} {{ employee.lastName }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-semimedium">
                            {{ getPayrollData(employee.id, 'grossPay') || 0 }}
                          </span>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil
                            @click="
                              [
                                (showBonus = true),
                                (employeeId = employee.id),
                                (employeeAmount = getPayrollData(employee.id, 'bonus') || 0),
                                (edit = true),
                              ]
                            "
                          />
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">{{ getPayrollData(employee.id, 'bonus')?.amount || 0 }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 flex whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil
                            @click="
                              [
                                (showDeduction = true),
                                (employeeId = employee.id),
                                (employeeAmount = getPayrollData(employee.id, 'deduction') || 0),
                                (edit = true),
                              ]
                            "
                          />
                          <div class="font-normal text-left flex flex-col">
                            <span class="text-sm font-semimedium">{{ getPayrollData(employee.id, 'deduction')?.amount || 0 }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil
                            @click="
                                [
                                  (employeeId = employee.id),
                                  (employeeAmount = getPayrollData(employee.id, 'taxAmount') || 0),
                                  (edit = true),
                                ]
                              " 
                            />
                          <div class="font-normal flex flex-col">
                            <span class="text-sm font-semimedium">{{ getPayrollData(employee.id, 'taxAmount') || 0 }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex space-x-2">
                          <ITablePencil />
                          <div class="flex w-full justify-between">
                            <div class="text-left flex flex-col">
                              <span class="text-sm font-semimedium">{{ getPayrollData(employee.id, 'netPay') || 0 }}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr class="text-black-100">
                      <!-- <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-semimedium"></span>
                          </div>
                        </div>
                      </td> -->
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex items-center space-x-3">
                          <div class="flex flex-col">
                            <span class="text-sm font-bold">Total</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="text-left flex flex-col">
                          <span class="text-sm font-bold">{{ formatNumber(grandTotal.grossPay) }}</span>
                        </div>
                      </td>
                      <td class="py-4 whitespace-nowrap">
                        <div class="flex space-x-2">
                          <span class="text-sm font-bold">{{ formatNumber(grandTotal.bonus) }}</span>
                        </div>
                      </td>
                      <td class="py-4 flex whitespace-nowrap">
                        <div class="flex space-x-2">
                          <span class="text-sm font-bold">{{ formatNumber(grandTotal.deductions) }}</span>
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex space-x-2 pl-2">
                          <span class="text-sm font-bold">{{ formatNumber(grandTotal.taxAmount) }}</span>
                        </div>
                      </td>
                      <td class="py-4 text-left whitespace-nowrap">
                        <div class="flex space-x-2">
                          <div class="flex w-full justify-between">
                            <div class="text-left flex flex-col">
                              <span class="text-sm font-bold">{{ formatNumber(grandTotal.netPay) }}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
