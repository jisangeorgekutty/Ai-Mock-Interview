import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useMockInterviewStore = create((set) => ({
  interviews: [],
  isLoading: false,

  fetchInterviews: async (email) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`mockinterview/fetchinterviews/${email}`);
      set({ interviews: res.data });
    } catch (error) {
      toast.error("Failed to fetch mock interviews");
    } finally {
      set({ isLoading: false });
    }
  },


  createMockInterview: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("mockinterview/mock-interview", data);
      set((state) => ({ interviews: [...state.interviews, res.data] }));
      toast.success("Mock interview created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating interview");
    } finally {
      set({ isLoading: false });
    }
  },


  getMockInterviewById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`mockinterview/get-mock-interview/${id}`);
      return res.data;
    } catch (error) {
      toast.error("Failed to fetch mock interview");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
