import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useEmotionsStore = create((set) => ({
    emotions: [],
    isLoading: false,

    recordEmotion: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/emotions/record-emotions", data);
            set((state) => ({ emotions: [...state.emotions, res.data] }));
        } catch (error) {
            toast.error("Emotion recording failed");
        } finally {
            set({ isLoading: false });
        }
    },

    fetchEmotions: async (mockIdRef) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/emotions/${mockIdRef}`);
            set({ emotions: res.data });
        } catch (error) {
            toast.error("Failed to fetch emotions");
        } finally {
            set({ isLoading: false });
        }
    },
}));
