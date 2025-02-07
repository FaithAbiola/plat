<script setup lang="ts">
import { ref, inject } from "vue";

const props = defineProps<{
  data: {
    city: string;
    state: keyof typeof Cities; // Ensure state is a valid key of Cities
  };
}>();
// provide and inject
const showCity = inject<any>("showCity");
let selectedCity = inject<any>("selectedCity");
// methods
// const selectCity = (City: string) => {
//   selectedCity.value = City;
//   showCity.value = false;
//   // console.log(selectedCity);
// };


const selectCity = (city: string) => {
  selectedCity.value = city;
  props.data.city = city; // Update the city in data
  showCity.value = false;
};

// variables
const Cities = {
  FederalCapitalTerritory: ["Abuja"],
  Abia: ["Aba", "Arochukwu", "Umuahia"],
  Adamawa: ["Jimeta", "Mubi", "Numan", "Yola"],
  AkwaIbom: ["Ikot Abasi", "Ikot Ekpene", "Oron", "Uyo"],
  Anambra: ["Awka", "Onitsha"],
  Bauchi: ["Azare", "Bauchi", "Jama′are", "Katagum", "Misau"],
  Bayelsa: ["Brass"],
  Benue: ["Makurdi"],
  Borno: ["Biu", "Dikwa", "Dikwa"],
  CrossRiver: ["Calabar", "Ogoja"],
  Delta: ["Asaba", "Burutu", "Koko", "Sapele", "Ughelli", "Warri"],
  Ebonyi: ["Abakaliki"],
  Ekiti: ["Ado-Ekiti", "Effon-Alaiye", "Ikere-Ekiti"],
  Enugu: ["Enugu", "Nsukka"],
  Edo: ["Benin City"],
  Gombe: ["Deba Habe", "Gombe", "Kumo"],
  Imo: ["Owerri", "Okigwe", "Orlu"],
  Jigawa: ["Birnin Kudu", "Dutse", "Gumel", "Hadejia", "Kazaure"],
  Kaduna: ["Jemaa", "Kaduna", "Zaria"],
  Kano: ["Kano"],
  Katsina: ["Daura", "Katsina"],
  Kebbi: ["Argungu", "Birnin Kebbi", "Gwandu", "Yelwa"],
  Kogi: ["Idah", "Kabba", "Lokoja", "Okene"],
  Kwara: ["Ilorin", "Jebba", "Offa", "Lafiagi", "Pategi"],

  Lagos: ["Badagry", "Epe", "Ikeja", "Ikorodu", "Lagos", "Mushin", "Shomolu"],

  Niger: ["Agaie", "Baro", "Bida", "Kontagora", "Lapai", "Minna", "Suleja"],

  Nasarawa: ["Keffi", "Lafia", "Nasarawa"],
  Ogun: ["Abeokuta", "Ijebu-Ode", "Ilaro", "Shagamu"],
  Ondo: ["Akure", "Ikare", "Oka-Akoko", "Ondo", "Owo"],

  Osun: [
    "Ede",
    "Ikire",
    "Ikirun",
    "Ila",
    "Ile-Ife",
    "Ilesha",
    "Ilobu",
    "Inisa",
    "Iwo",
    "Oshogbo",
  ],

  Oyo: ["Ibadan", "Iseyin", "Ogbomosho", "Oyo", "Saki"],
  Plateau: ["Bukuru", "Jos", "Vom", "Wase"],
  Rivers: ["Bonny", "Degema", "Okrika", "Port Harcourt"],
  Sokoto: ["Sokoto"],
  Taraba: ["Ibi", "Jalingo", "Muri"],
  Yobe: ["Damaturu", "Nguru"],
  Zamfara: ["Gusau", "Kaura Namoda"],
} as const;
// const props = defineProps<{ state: keyof Object }>();
</script>
<template>
  <div
    class="space-y-5 p-6 shadow-rgba bg-white text-sm cursor-pointer font-bold rounded-lg"
  >
    <p
      v-for="city in Cities[props.data.state]"
      :key="city"
      @click="selectCity(city)"
    >
      {{ city }}
    </p>
  </div>
</template>
