import { create } from "zustand";

interface Props {
  country: string;
  setCountry: (country: string) => void;
}

const useCountry = create<Props>((set) => ({
  country: "",
  setCountry: (country: string) => set({ country: country.toLowerCase() }),
}));

export default useCountry;
