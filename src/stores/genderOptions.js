import { defineStore } from "pinia";
import { ref } from "vue";

export const useGenderOptionsStore = defineStore('genderOptions', () => {
  const genderOptions = ref([
    {
      label: 'Nam',
      value: 'male'
    },
    {
      label: 'Nữ',
      value: 'female'
    },
    {
      label: 'Khác',
      value: 'other'
    }
  ]);

  return { genderOptions }
});
