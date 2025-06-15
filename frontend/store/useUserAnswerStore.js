import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useUserAnswerStore = create((set) => ({
  answers: [],
  isLoading: false,

  submitAnswer: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/user-answer", data);
      set((state) => ({ answers: [...state.answers, res.data] }));
      toast.success("Answer submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAnswersByEmailAndMockId: async (email, mockIdRef) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/useranswer/${email}/${mockIdRef}`);
      set({ answers: res.data });
    } catch (error) {
      toast.error("Failed to fetch user answers");
    } finally {
      set({ isLoading: false });
    }
  }


}));
