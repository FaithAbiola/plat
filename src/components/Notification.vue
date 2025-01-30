<script lang="ts" setup>
import { computed, ref } from "vue";
import { INotification } from "../core/icons";
import { ComponentPosition as NotificationPosition } from "../interface/enums.interface";
import { getItem } from "../core/utils/storage.helper";
import { useUserStore } from "../store/index";
import handleError from "../composables/handle_error.composable";

withDefaults(
  defineProps<{
    position?: NotificationPosition;
  }>(),
  {
    position: NotificationPosition.HOMEPAGE,
  }
);

const userStore = useUserStore();
// variables
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const loading = ref(false);
const responseData = ref<any>({ data: [], message: "" });

// const userInfo = ref(getItem(import.meta.env.VITE_USERDETAILS));
// const parsedUserInfo = typeof userInfo.value === 'string' ? JSON.parse(userInfo.value) : userInfo.value;
// const userId = parsedUserInfo?.customerInfo?.userId;
const userId = Number(localStorage.getItem('userId'));
console.log("~~~~~~~~~~~~~:", userId);


const unreadCount = computed(() => {
  return responseData.value.data.filter((notification: { isRead: any; }) => !notification.isRead).length;
});
const isNotificationsVisible = ref(false);


//DO NOT COPY THIS CODE, USE YOUR BRAIN AND DON'T BE LAZY ======== DO NOT COPY THIS CODE, USE YOUR BRAIN AND DON'T BE LAZY 

const fetchNotifications = async (page: number) => {

//DO NOT COPY THIS CODE, USE YOUR BRAIN AND DON'T BE LAZY 
  loading.value = true;
  try {
    const response = await userStore.getNotifications(userId, pageSize.value, page);
    if (response.data) {
      responseData.value.data = response.data.data.pageItems;
      currentPage.value = response.data.data.currentPage;
      totalPages.value = response.data.data.numberOfPages;
      totalItems.value = response.data.data.pageSize * totalPages.value;
    }
  } catch (error) {
    handleError(error, "Error fetching notifications");
  } finally {
    loading.value = false;
  }
};



//DO NOT COPY THIS CODE, USE YOUR BRAIN AND DON'T BE LAZY ======== DO NOT COPY THIS CODE, USE YOUR BRAIN AND DON'T BE LAZY 

//DO NOT COPY THIS CODE, USE YOUR BRAIN AND DON'T BE LAZY ======== DO NOT COPY THIS CODE, USE YOUR BRAIN AND DON'T BE LAZY 


const toggleNotifications = () => {
  isNotificationsVisible.value = !isNotificationsVisible.value;
};

const updatePage = (page: number) => {
  fetchNotifications(page);
};

// Initial fetch
fetchNotifications(currentPage.value);
</script>

<template class="">
  <div class="dropdown dropdown-end">
    <label
      tabindex="0"
      class="relative flex items-center bg-grey-100 lg:p-2.5 p-3.5 rounded-full space-x-3 cursor-pointer"
      :class="[
        position === NotificationPosition.HOMEPAGE
          ? 'bg-clip-rgba text-white'
          : 'bg-grey-100',
      ]"
      @click="toggleNotifications"
    >
      <span>
        <INotification
          :color="
            position === NotificationPosition.HOMEPAGE ? 'white' : 'black'
          "
        />
      </span>
      <span class="font-semimedium text-sm lg:block"
        >Your notifications</span
      >
      <span
        class="text-xxs p-1 rounded-full lg:relative absolute lg:top-[0px] lg:right-[0px] top-[-4px] right-[-13px]"
        :class="[
          position === NotificationPosition.HOMEPAGE
            ? 'text-white bg-red'
            : 'text-red bg-red-rgba',
        ]"
        >{{ unreadCount }}</span
      >
    </label>

    <!-- content -->
    <ul
      v-if="isNotificationsVisible"
      tabindex="0"
      class="dropdown-content menu p-6 shadow-rgba bg-white rounded-lg lg:w-[445px] mt-4 divide-y divide-grey-200"
      :class="[
        position === NotificationPosition.HOMEPAGE ? '-left-56' : '-left-44',
      ]"
    >
    <li v-for="notification in responseData.data" :key="notification.id">
      <div class="flex flex-col items-start space-y-1 p-4">
        <a class="text-sm text-black font-bold">{{ notification.message }}</a>
        <p class="text-sm text-gray-rgba-4 font-semimedium">
          {{ notification.isRead ? 'Read' : 'New' }} - {{ notification.message }}
          <!-- {{ new Date(notification.createdAt).toLocaleString() }} -->
        </p>
      </div>
    </li>
    </ul>
  </div>
</template>
