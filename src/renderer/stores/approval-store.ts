import { create } from 'zustand';

export interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  type: 'workflow' | 'document' | 'request';
  priority: 'high' | 'medium' | 'low';
  requester: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovalState {
  items: ApprovalItem[];
  pendingCount: number;
  loading: boolean;
  setItems: (items: ApprovalItem[]) => void;
  approveItem: (id: string) => void;
  rejectItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useApprovalStore = create<ApprovalState>((set) => ({
  items: [],
  pendingCount: 0,
  loading: false,
  setItems: (items) =>
    set({
      items,
      pendingCount: items.filter((item) => item.status === 'pending').length,
    }),
  approveItem: (id) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, status: 'approved' as const } : item
      );
      return {
        items: newItems,
        pendingCount: newItems.filter((item) => item.status === 'pending').length,
      };
    }),
  rejectItem: (id) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, status: 'rejected' as const } : item
      );
      return {
        items: newItems,
        pendingCount: newItems.filter((item) => item.status === 'pending').length,
      };
    }),
  setLoading: (loading) => set({ loading }),
}));
