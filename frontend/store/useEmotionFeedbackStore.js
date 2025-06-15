import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useEmotionFeedbackStore = create((set) => ({
  feedbacks: [],
  isLoading: false,

  submitFeedback: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/emotionfeedback/submit-emotion-feedback", data);
      set((state) => ({ feedbacks: [...state.feedbacks, res.data] }));
      toast.success("Emotion feedback submitted");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeedbackByMockId: async (mockIdRef) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/emotionfeedback/fetch-feedback/${mockIdRef}`);
      set({ feedbacks: res.data });
    } catch (error) {
      toast.error("Failed to fetch feedback");
    } finally {
      set({ isLoading: false });
    }
  },
}));
