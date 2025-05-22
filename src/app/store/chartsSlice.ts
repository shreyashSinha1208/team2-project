import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChartData {
  qna: string[];
  timeline: string;
  list: string[];
  hierarchy: string;
}

interface ChartsState {
  data: ChartData;
  loading: boolean;
  error: string | null;
  selectedTemplate: string;
}

const initialState: ChartsState = {
  data: {
    qna: [],
    timeline: '',
    list: [],
    hierarchy: '',
  },
  loading: false,
  error: null,
  selectedTemplate: '',
};

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action: PayloadAction<string>) => {
      state.selectedTemplate = action.payload;
    },
    setQnAData: (state, action: PayloadAction<string[]>) => {
      state.data.qna = action.payload;
    },
    setTimelineData: (state, action: PayloadAction<string>) => {
      state.data.timeline = action.payload;
    },
    setListData: (state, action: PayloadAction<string[]>) => {
      state.data.list = action.payload;
    },
    setHierarchyData: (state, action: PayloadAction<string>) => {
      state.data.hierarchy = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedTemplate,
  setQnAData,
  setTimelineData,
  setListData,
  setHierarchyData,
  setLoading,
  setError,
} = chartsSlice.actions;

export default chartsSlice.reducer;