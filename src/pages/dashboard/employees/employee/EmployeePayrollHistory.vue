<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, provide, reactive, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, sameAs } from "@vuelidate/validators";
import ButtonBlue from "../../../../components/buttons/ButtonBlue.vue";
import EmptyState from "../../../../components/EmptyState.vue";
import Grade from "../../../../components/dropdowns/grades.vue";
import {
  IEyeOpened,
  ICaretUpDown,
  IMenuVertical,
  IUserThree,
  IArrowDown,
} from "../../../../core/icons";
import SuccessAlert from "../../../../components/alerts/SuccessAlert.vue";
import { request } from "../../../../composables/request.composable";
import handleError from "../../../../composables/handle_error.composable";
import handleSuccess from "../../../../composables/handle_success.composable";
import spinner from "../../../../components/timer/Spinner.vue";
import {
  useEmployeeStore,
  useUserStore,
  useWalletStore,
  usePayrollStore
} from "../../../../store/index";
import {
  stringValidate,
  numberValidate,
} from "../../../../validations/validate";
import html2pdf from 'html2pdf.js';

import { formatNumber, dateFormat, formatDate, formatDatee } from "../../../../core/helpers/actions"

import { useRoute } from "vue-router";
import { getItem } from "../../../../core/utils/storage.helper";

// initialize route
const route = useRoute();

// initialize store
const employeeStore = useEmployeeStore();
const payrollStore = usePayrollStore();
const userStore = useUserStore();
const walletStore = useWalletStore();
const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));

// variables
const disabled = ref(true);
const showBank = ref(false);
const loading = ref(false);
const fetchLoading = ref(false);
const valid = ref(false);
const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
const organisationId = parsedUserInfo?.customerInfo?.organisationId;
let data = ref<{
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  telephone: number | null;
  active: number | null;
  group_id: number | null;
  grade_id: number | null;
  account_details: {
    bank: string | null;
    account_name: string | null;
    account_number: number | null;
  };
}>({
  firstname: null,
  lastname: null,
  email: null,
  telephone: null,
  active: 1,
  group_id: null,
  grade_id: null,
  account_details: {
    bank: null,
    account_name: null,
    account_number: null,
  },
});
const grades = ref<any[]>([]);
const payments:any = ref([
  {
    payroll: {
      created_at: "",
    },
    meta: {
      salary: {
        gross: 0,
        total: 0,
      },
      breakdown: {
        tax: 0,
        bonus: 0,
        deduction: 0,
      }
    }
  }
]);

const departmentName = ref("");
const showDepartment = ref(false);
const gradeName = ref("");
const showGrade = ref(false);
const banks = ref<string[]>([]);

const showSuccess = ref(false);

const errorResponse = ref("");
const responseData = ref<any>({ data: null, message: "" });
const userId = ref<number | null>(null);
const payrollData = ref<any[]>([]); 

const slip = ref({
  name: "",
  narration: "",
  paymentDate: "",
  grossPay: 0,
  bonus: 0,
  deductions: 0,
  tax: 0,
  netPay: 0,
})

// provide and inject
provide("showDepartment", showDepartment);
provide("selectedDepartment", [data, departmentName]);
provide("showGrade", showGrade);
provide("selectedGrade", [data, gradeName]);
// emits
const emit = defineEmits<{
  (e: "setSingleEmployeeName", name: string): void;
  (e: "doNotEdit", value: boolean): void;
}>();

// computed
const employeeId = computed(() => {
  return route.params.id as string;
});
console.log("====", employeeId.value)
// methods

const parseBank = (item: any) => {
  return item.bankName;
};
const fetchBank = async () => {
  const response = await request(walletStore.getBanks());

  // handleError(response, userStore);
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    // console.log(successResponse.data);

    banks.value = successResponse.data.data;
  }
};
const setGrades = (value: any[]) => {
  // console.log("set grade fired");
  gradeName.value = "";
  grades.value = value;
  showGrade.value = false;
};

const onInput = (phone: number, phoneObject: any, input: any) => {
  if (phoneObject?.formatted) {
    data.value.telephone = phoneObject.number;
    valid.value = phoneObject.valid;
  }
};

const validatePhone = () => {
  return valid.value;
};




// fetchBank();
// validations rule
const rules = computed(() => {
  return {
    email: {
      email: helpers.withMessage("Must be a valid email", email),
    },

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
    telephone: {
      validatePhone: helpers.withMessage("Invalid Phone Number", validatePhone),
    },
    account_details: {
      account_number: {
        numberValidate: helpers.withMessage(
          "Account number can only include numbers",
          () =>
            numberValidate(
              data.value.account_details.account_number as number
            ) as any
        ),
      },
    },
    // active: {
    //   numberValidate: helpers.withMessage(
    //     "Active line can only include numbers",
    //     () => numberValidate(data.value.active as number) as any
    //   ),
    // },

    // group_id: {
    //   numberValidate: helpers.withMessage(
    //     "GroupId line can only include numbers",
    //     () => numberValidate(data.value.group_id as number) as any
    //   ),
    // },
    // grade_id: {
    //   numberValidate: helpers.withMessage(
    //     "GradeId line can only include numbers",
    //     () => numberValidate(data.value.grade_id as number) as any
    //   ),
    // },

    // bank: {
    //   stringValidate: helpers.withMessage(
    //     "Bank name can only include alphabets",
    //     () => stringValidate(data.value.account_details.bank as string) as any
    //   ),
    // },
  };
});

const v$ = useVuelidate(rules as any, data);
const capitalizeFirstLetter = (name: string | null) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
// define emits
defineExpose({
  // saveChanges,
  disabled,
  loading,
  v$,
});

const exportToPDF = () => {
  slip.value = {
        name: "Adebayoowa Temifayowa",
        narration: "October Payslip",
        paymentDate: "20/08/2024",
        grossPay: 0,
        bonus: 30000,
        deductions: 5000,
        tax: 500,
        netPay: 24500,
    };
    var element = document.getElementById('element-to-print');
    var opt = {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts:true,
        floatPrecision: 16,
        image: { type: 'jpeg', quality: 1.50 },
        html2canvas:  { scale: 4 },
    };
    html2pdf().set(opt).from(element).save(`${slip.value.name}-${slip.value.paymentDate}`);
    // html2pdf().set(opt).from(element).save(`${responseData.value.data.data.firstname+' '+responseData.value.data.data.lastname+slip.value.narration}-${slip.value.paymentDate}`);
}

const getProfile = async () => {
  console.log(employeeId.value);
  const response = await request(
    employeeStore.show(employeeId.value, organisationId),
    fetchLoading
  );
  const successResponse = handleSuccess(response);

  if (successResponse && typeof successResponse !== "undefined") {
    const employeeData = successResponse.data.data.employee;
    console.log("*****", employeeData);
    data.value.firstname = capitalizeFirstLetter(employeeData.user.firstname);
    data.value.lastname = capitalizeFirstLetter(employeeData.user.lastname);
    responseData.value.data = successResponse.data;
    userId.value = employeeData.userId;
    await fetchPayrollHistory();
    console.log("/////", userId.value);

    emit(
      "setSingleEmployeeName",
      `${data.value.firstname} ${data.value.lastname}`
    );
  } else {
    errorResponse.value = response.data.data.message;
  }
};

const fetchPayrollHistory = async () => {
    if (userId.value) {
      fetchLoading.value = true; 
        try {
            const response = await payrollStore.getPayrollHistory(userId.value);
            payrollData.value = response.data.data.pageItems; 
        } catch (error) {
            console.error("Error fetching payroll history:", error);
        } finally {
            fetchLoading.value = false; 
        }
    } else {
        console.error("User ID is not available.");
    }
};

const downloadPayslip = async () => {
    const startDate = "2025-01-06T07:58:29.599Z"; 
    const endDate = "2025-01-06T07:58:29.599Z"; 
    try {
        const payslipData = await payrollStore.generatePayslip(Number(employeeId.value), organisationId, startDate, endDate);

        console.log("Payslip generated successfully:", payslipData);
    } catch (error) {
        console.error("Error generating payslip:", error);
    }
};

// const slipInfo = (item:any) => {
//   slip.value = {
//     name: responseData.value.data.data.firstname+' '+responseData.value.data.data.lastname,
//     narration: item.narration,
//     paymentDate: item.payroll ? dateFormat(item.payroll.created_at) : '--/--/---- --:-- --',
//     grossPay: item.meta ? formatNumber(item.meta.salary.gross) : 0,
//     bonus: item.meta ? formatNumber(item.meta.breakdown.bonus) : 0,
//     deductions: item.meta ? formatNumber(item.meta.breakdown.deductions) : 0,
//     tax: item.meta ? formatNumber(item.meta.breakdown.tax) : 0,
//     netPay: item.meta ? formatNumber(item.meta.salary.total) : 0,
//   }

//   exportToPDF();
// }
const slipInfoo = (item:any) => {
  slip.value = {
    name: responseData.value.data.data.firstname+' '+responseData.value.data.data.lastname,
    narration: item.narration,
    paymentDate: item.payroll ? dateFormat(item.payroll.created_at) : '--/--/---- --:-- --',
    grossPay: item.meta ? formatNumber(item.meta.salary.gross) : 0,
    bonus: item.meta ? formatNumber(item.meta.breakdown.bonus) : 0,
    deductions: item.meta ? formatNumber(item.meta.breakdown.deductions) : 0,
    tax: item.meta ? formatNumber(item.meta.breakdown.tax) : 0,
    netPay: item.meta ? formatNumber(item.meta.salary.total) : 0,
  }

  exportToPDF();
}

const slipInfo = async (item: any) => {
    const startDate = "2025-01-06T07:58:29.599Z";
    const endDate = "2025-01-06T07:58:29.599Z";

    try {
        const payslipData = await payrollStore.generatePayslip(Number(employeeId.value), organisationId, startDate, endDate);

        slip.value = {
            name: payslipData.data.firstname + ' ' + payslipData.data.lastname, 
            narration: item.narration,
            paymentDate: payslipData.data.paymentDate || '--/--/---- --:-- --', 
            grossPay: formatNumber(payslipData.data.salary.gross || 0), 
            bonus: formatNumber(payslipData.data.breakdown.bonus || 0), 
            deductions: formatNumber(payslipData.data.breakdown.deductions || 0), 
            tax: formatNumber(payslipData.data.breakdown.tax || 0), 
            netPay: formatNumber(payslipData.data.salary.total || 0) 
        };

        exportToPDF();
    } catch (error) {
        console.error("Error generating payslip:", error);
    }
};


getProfile();

const router = useRouter()
</script>
<template>
  <spinner
    v-if="fetchLoading == true"
    class="flex justify-center items-center lg:h-[400px] h-[300px]"
  />
  <div v-else class="w-full overflow-auto">
    <EmptyState v-if="!fetchLoading && !payrollData.length">
      <template #icon>
        <IUserThree />
      </template>
      <template #heading> Payment details </template>
      <template #desc> No payroll records found for this employee. </template>
    </EmptyState>
    <div class="align-middle inline-block min-w-full">
      <div class="overflow-hidden sm:rounded-lg">
        <table class="min-w-full table-fixed">
          <thead v-if="payrollData.length" class="text-black-200 text-sm text-left">
            <tr class="whitespace-nowrap">
              <th scope="col" class="py-4 font-normal text-left items-center space-x-3">
                <span> Payroll </span>
              </th>
              <th scope=" col" class="py-4 font-normal text-left">
                Payment Date
              </th>
              <th scope="col" class="py-4 font-normal text-left">Gross Pay</th>
              <th scope="col" class="py-4 font-normal text-left">Bonus</th>
              <th scope="col" class="py-4 font-normal text-left">Deductions</th>
              <th scope="col" class="py-4 font-normal text-left">Tax</th>
              <th scope="col" class="py-4 font-normal text-left">Net Pay</th>
              <th scope="col" class="py-4 font-normal text-left">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-grey-200">
            <tr v-for="(item, index) in payrollData" :key="index" class="text-black-100">
            <!-- <tr class="text-black-100"> -->
              <td class="py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <div class="flex flex-col">
                    <!-- <span class="text-sm font-semimedium">{{ item.narration }}</span> -->
                    <span class="text-sm font-semimedium">{{ item.payroll ? formatDate(item.payroll.createdAt) : '--' }}</span>
                    <span class="text-xs text-gray-rgba-3">₦{{ item.payroll ? item.payroll.totalSalaries : '--' }}/yr</span>
                  </div>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="text-left flex flex-col">
                  <!-- <span class="text-sm font-semimedium">{{ item.payroll ? dateFormat(item.payroll.created_at) : '--/--/---- --:-- --' }}</span> -->
                  <!-- <span class="text-sm font-semimedium">Jan 12, 2022 15:32</span> -->
                  <span class="text-sm font-semimedium">{{ item.transaction ? formatDatee(item.transaction.createdAt) : '--' }}</span>
                  <span class="text-xs text-green">{{ item.transaction ? capitalizeFirstLetter(item.transaction.transactionType) : '--' }}</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <!-- <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.salary.gross) : 0 }}</span> -->
                  <span class="text-sm font-semimedium">₦{{ formatNumber(item.employeeDetails?.grossPay) || 0 }}</span>
                </div>
              </td>
              <td class="py-4 whitespace-nowrap">
                <div class="font-normal text-left flex flex-col">
                  <!-- <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.breakdown.bonus) : 0 }}</span> -->
                  <span class="text-sm font-semimedium">₦{{ formatNumber(item.employeeDetails?.bonus?.amount) || 0 }}</span>
                  <span class="text-xs text-gray-rgba-3">{{ capitalizeFirstLetter(item.employeeDetails?.bonus?.reason) || " " }}</span>
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="font-normal flex flex-col">
                  <!-- <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.breakdown.deductions) : 0 }}</span> -->
                  <span class="text-sm font-semimedium">₦{{ formatNumber(item.employeeDetails?.deduction?.amount) || 0 }}</span>
                  <span class="text-xs text-gray-rgba-3">{{ capitalizeFirstLetter(item.employeeDetails?.deduction?.reason) || " " }}</span>
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="font-normal flex flex-col">
                  <!-- <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.breakdown.tax) : 0 }}</span> -->
                  <span class="text-sm font-semimedium">₦{{ formatNumber(item.employeeDetails?.taxAmount) || 0 }}</span>
                  <span class="text-xs text-gray-rgba-3">PAYEE</span>
                </div>
              </td>
              <td class="py-4 text-left whitespace-nowrap">
                <div class="font-normal flex flex-col">
                  <!-- <span class="text-sm font-semimedium">₦{{ item.meta ? formatNumber(item.meta.salary.total) : 0 }}</span> -->
                  <span class="text-sm font-semimedium">₦{{ formatNumber(item.employeeDetails?.netPay) || 0 }}</span>
                </div>
              </td>
              <td class="py-4 px-8 text-left whitespace-nowrap w-[18%]">
                <div class="flex items-center justify-between">
                  <!-- <button @click="slipInfo(item)"
                  class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full">
                  Download Payslip
                </button> -->
                  <button @click="exportToPDF"
                    class="text-[#003b3d] bg-red-light text-sm text-bold px-4+1 py-2 rounded-full">
                    Download Payslip
                  </button>
                  <!-- <button>
                    <IMenuVertical />
                  </button> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Pagination -->

    <div class="px-6 mt-20 hidden items-center justify-between">
      <span class="opacity-50 text-sm font-semimedium whitespace-nowrap">Showing 1-6 of 30 items</span>

      <div class="flex items-center space-x-2">
        <span
          class="text-white bg-[#003b3d] text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full">1</span>
        <span class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50">2</span>
        <span class="text-sm w-8 h-8 flex items-center justify-center rounded-full border opacity-50">3</span>
      </div>
    </div>

    <!-- <div class="">
      <div class="bg-[#dcf7e6]" id="element-to-print">
        <div class="grid place-content-center h-[100px] w-full px-[60px] bg-[#ffffff]">
          <div class="mx-auto pt-[30px]">
            <img src="/images/png/logo.png" alt="logo" class="w-[200px]">
          </div>
        </div>
        <div class="mb-5 text-center bg-[#003b3d] p-2 pb-6">
          <h3 class="text-white text-[2.5em] uppercase">{{ slip.name }}</h3>
          <p class="text-md text-white/80 uppercase">{{ slip.narration }}</p>
          <p class="text-sm text-white/80 uppercase">{{ slip.paymentDate }}</p>
        </div>
        <div class="px-[60px] mb-4">
          <h3 class="text-black-rgba text-2xl font-black">NGN {{ slip.grossPay }}</h3>
          <span class="text-sm text-gray-rgba-3">Gross salary</span>
        </div>
        <div class="divide-grey-200 divide-y px-[70px]">
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Basic/Net</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.netPay }}</span>
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Bonus</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.bonus }}</span>
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Deductions</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.deductions }}</span>
          </div>
          <div class="text-base flex items-center justify-between py-4">
            <span class="font-semi-medium text-gray-rgba-3">Tax</span>
            <span class="text-black-100 font-semi-medium">N{{ slip.tax }}</span>
          </div>
        </div>
      </div>
    </div> -->
    <div class="hidden">
      <div id="element-to-print">   
        <div class="p-6 bg-white shadow-md rounded-md w-full max-w-3xl mx-auto">
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 mb-4">
            <img src="/images/png/logo.png" alt="logo" class="h-12">
            <div class="text-left text-sm">
              <p class="font-bold">String-Land</p>
              <p>P20a Alakinde Street, Osogbo</p>
              <p>Osun</p>
            </div>
          </div>
      
          <!-- Payslip Title -->
          <h1 class="text-2xl text-center font-bold mb-6">Payslip</h1>
      
          <!-- Employee Details -->
          <div class="flex justify-between px-8 mb-4">
            <div>
              <p class="font-semibold py-1">Employee Name</p>
              <p class="font-semibold py-1">Employment Status</p>
              <p class="font-semibold py-1">Month</p>
              <p class="font-semibold py-1">Pay Date</p>
            </div>
            <div class="text-left">
              <p class="py-1">Adebayoowa Temifayowa</p>
              <p class="py-1">Full Time</p>
              <p class="py-1">October</p>
              <p class="py-1">20/08/2024</p>
            </div>
          </div>
      
          <!-- Payment Details -->
          <div class="flex justify-between mx-5 px-3 py-2 font-semibold bg-white-smoke">
            <span>Description</span>
            <span class="mr-4">Amount</span>
          </div>
          <div class="flex justify-between px-8">
            <div>
              <p class="py-2">Gross Pay</p>
              <p class="py-2">Bonus</p>
              <p class="py-2">Deduction</p>
              <p class="py-2">Tax</p>
              <p class="py-2">Pension</p>
            </div>
            <div class="text-left">
              <p class="py-2">₦0</p>
              <p class="py-2">₦30,000</p>
              <p class="py-2">₦5,000</p>
              <p class="py-2">₦500</p>
              <p class="py-2">₦0</p>
            </div>
          </div>
          <div class="flex justify-between mx-5 px-3 py-2 mb-4 font-semibold bg-white-smoke">
            <span>Net Pay</span>
            <span>₦24,500</span>
          </div>
          <!-- Payment Details -->
          <!-- <div class="bg-gray-200 px-8 py-4 mb-4 text-left">
            <div class="flex justify-between">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div class="flex justify-between py-2">
              <span>Gross Pay</span>
              <span>₦200,000</span>
            </div>
            <div class="flex justify-between py-2">
              <span>Bonus</span>
              <span>₦0.00</span>
            </div>
            <div class="flex justify-between py-2">
              <span>Deductions</span>
              <span>₦0.00</span>
            </div>
            <div class="flex justify-between py-2">
              <span>Tax</span>
              <span>₦10,000</span>
            </div>
            <div class="flex justify-between py-2">
              <span>Pension</span>
              <span>₦10,000</span>
            </div>
            <div class="flex justify-between font-bold py-2">
              <span>Net Pay</span>
              <span>₦198,000</span>
            </div>
          </div> -->
      
          <!-- Account Details -->
          <div class="px-8 mb-4 mt-5">
            <h3 class="font-bold">Account Details</h3>
            <p>Account Name: Adebayoowa Temifayowa</p>
            <p>Account Number: 1234567890</p>
            <p>Bank Name: Opay</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
