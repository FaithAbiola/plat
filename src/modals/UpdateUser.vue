<script setup lang="ts">
import { inject } from "vue";
import ButtonBlue from "../components/buttons/ButtonBlue.vue";
import { IClose } from "../core/icons";
import { IArrowDown } from "../core/icons";

const openUpdateUser = inject("openUpdateUser");
</script>

<template>
  <Transition
    name="edit-pension-modal"
    enter-active-class="animate__animated animate__fadeInRight"
    leave-active-class="animate__animated animate__fadeOutRight"
    :duration="400"
  >
    <div class="w-screen z-50 bg-[#000000A3] min-h-screen h-full fixed">
      <div class="flex justify-center">
        <div
          class="lg:p-9 p-5 lg:w-1/3 rounded-lg inline-block align-middle bg-white lg:mt-24 mt-10 space-y-12"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-black-rgba font-medium text-2xl">
                Ighayere Ehondor Jemima
              </h3>
              <span class="text-sm font-semimedium text-black-rgba-100"
                >Edit details</span
              >
            </div>
            <button
              @click="openUpdateUser = false"
              class="bg-blue-lighter rounded-full top-12 right-12 p-3"
            >
              <IClose />
            </button>
          </div>
          <!--  -->
          <div class="space-y-6">
            <div
              class="font-normal text-left rounded-xl px-4 py-4 relative border text-black"
            >
              <p
                class="absolute -top-2 font-normal text-xs left-5 text-[#000000] bg-white"
              >
                First name
              </p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-black">Ighayere</span>
              </div>
            </div>
            <!--  -->

            <div
              class="font-normal text-left rounded-xl pl-4 py-4 my-4 border text-gray-rgba-3 mb-1"
            >
              <input
                type="text"
                class="rounded-lg text-black placeholder-strong sm:text-sm text-xs outline-none border-none focus:outline-none docus:border-none"
                placeholder="Ehondor-Jemima"
              />
            </div>
            <!--  -->

            <div
              class="font-normal text-left rounded-xl px-4 py-4 relative text-gray-rgba-3 border text-black"
            >
              <div class="flex justify-between items-center">
                <span class="text-sm text-black">Super Admin</span>
                <span>
                  <IArrowDown />
                </span>
              </div>
            </div>
          </div>
          <div class="flex pb-5">
            <ButtonBlue>
              <template v-slot:placeholder>Save Changes</template>
            </ButtonBlue>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
