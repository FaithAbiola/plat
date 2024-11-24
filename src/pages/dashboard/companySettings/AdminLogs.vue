<script setup lang="ts">
import ButtonBlue from "../../../components/buttons/ButtonBlue.vue";
import ButtonLightBlue from "../../../components/buttons/ButtonLightBlue.vue";
import ButtonColorless from "../../../components/buttons/ButtonColorless.vue";
// icons
import { IIncDec, IArrowDown } from "../../../core/icons";
</script>
<template>
  <div>
    <div class="bg-white h-full relative rounded-lg space-y-5">
      <div class="px-5 py-2 flex justify-between">
        <div class="">
          <!-- <div class="flex space-x-2">
            <span class="text-sm pt-1 font-semimedium text-black-200"
              >Sort by Date</span
            >
            <span class="pt-2">
              <IIncDec />
            </span>
          </div> -->
        </div>
      </div>
      <div class="space-y-10 overflow-auto scrollbar-hide">
        <!-- table -->
        <div class="border-t border-grey">
          <div class="py-6">
            <div class="align-middle inline-block min-w-full">
              <div class="overflow-hidden sm:rounded-lg">
                <table class="min-w-full table-fixed">
                  <thead class="text-black-200 text-sm text-left">
                    <tr>
                      <th
                        scope="col"
                        class="py-4 text-left flex items-center space-x-3 whitespace-nowrap"
                      >
                        <!-- <CheckBox customClasses="indeterminate-check" /> -->
                        <span> Name </span>
                      </th>
                      <th scope=" col" class="py-4 text-left">Action</th>
                      <th scope="col" class="py-4 text-left">Date & Time</th>
                      <th scope="col" class="py-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-grey-200">
                    <tr
                      v-for="(i, index) in 5"
                      :key="index"
                      class="text-black-100 whitespace-nowrap"
                    >
                      <td class="py-4">
                        <div class="flex flex-col">
                          <span class="text-sm font-semimedium"
                            >Ighayere Ehondor Jemima</span
                          >
                          <span class="text-xs text-gray-rgba-3"
                            >Super admin</span
                          >
                        </div>
                      </td>
                      <td class="py-4">
                        <div class="text-left flex flex-col mb-4">
                          <span class="text-sm font-semimedium"
                            >Created new department</span
                          >
                        </div>
                      </td>
                      <td class="whitespace-nowrap">
                        <div class="font-normal text-left flex mb-4">
                          <!-- <span class="text-sm font-semimedium"
                            >Jan 12, 2022 15:32</span
                          > -->
                          <span class="text-sm font-semimedium"
                            >&nbsp;</span
                          >
                        </div>
                      </td>
                      <td class="whitespace-nowrap">
                        <div class="font-normal flex text-left mb-4">
                          <ButtonLightBlue>
                            <template v-slot:placeholder>View log</template>
                          </ButtonLightBlue>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- end of table -->
        <div
          class="hidden justify-between px-6 text-sm text-gray-rgba-3 items-center lg:space-x-0 space-x-3 whitespace-nowrap"
        >
          <span> Showing 1-6 of 30 items</span>
          <div class="flex space-x-3">
            <ButtonBlue>
              <template v-slot:placeholder>1</template>
            </ButtonBlue>
            <ButtonColorless>
              <template v-slot:placeholder>2</template>
            </ButtonColorless>
            <ButtonColorless>
              <template v-slot:placeholder>3</template>
            </ButtonColorless>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
