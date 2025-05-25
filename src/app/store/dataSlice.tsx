import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SWOTState {
  items: string[]; // Existing SWOT items
  timelineData: string; // Timeline data
  listViewData: string; // List view data
  flashcardData: string; // Flashcard data
  mindfullnessData: string;
  qnaData: string[]; // Q&A data
  barChartData: string; // Bar Chart data
  pieChartData: string; // Pie Chart data
  doughnutChartData: string; // Doughnut Chart data
}

const initialState: SWOTState = {
  items: [],
  timelineData: `
    1990: Founded the company
    1995: Launched first product
    2000: Expanded to international markets
    2005: Reached 1 million customers
    2010: Introduced new technology
    2015: Acquired a competitor
    2020: Celebrated 30 years in business
    2025: Planned future innovations
  `,
  listViewData: "",
  flashcardData: `
    What is React?:A JavaScript library for building user interfaces
    What is JSX?:A syntax extension for JavaScript that allows writing HTML-like code
    What is a Component?:A reusable piece of UI that can accept props and manage state
    What is State?:An object that holds data that may change over time in a component
  `,
  mindfullnessData: "",
  qnaData: [],
  barChartData: `Norway: 99
United_States: 89
India: 54
Nigeria: 50
South_Africa: 72
Germany: 93
Brazil: 78`,
  pieChartData: `Samsung: 22.1
Apple: 17.1
Huawei: 18.2
Xiaomi: 9.3
Oppo: 7.7
Vivo: 6.4
Others: 19.2`,
  doughnutChartData: `Chrome: 64.5
Safari: 18.2
Firefox: 3.4
Edge: 3.2
Opera: 2.1
Others: 8.6`,
};

const swotSlice = createSlice({
  name: "swot",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<string[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<string>) {
      state.items.push(action.payload);
    },
    clearItems(state) {
      state.items = [];
    },
    setTimelineData(state, action: PayloadAction<string>) {
      state.timelineData = action.payload;
    },
    setListViewData(state, action: PayloadAction<string>) {
      state.listViewData = action.payload;
    },
    setFlashcardData(state, action: PayloadAction<string>) {
      state.flashcardData = action.payload;
    },
    setMindfullnessData(state, action: PayloadAction<string>) {
      state.mindfullnessData = action.payload;
    },
    setBarChartData(state, action: PayloadAction<string>) {
      state.barChartData = action.payload;
    },
    setPieChartData(state, action: PayloadAction<string>) {
      state.pieChartData = action.payload;
    },
    setDoughnutChartData(state, action: PayloadAction<string>) {
      state.doughnutChartData = action.payload;
    },
    // QnA Actions
    setQnAData(state, action: PayloadAction<string[]>) {
      state.qnaData = action.payload;
    },
    addQnAItem(state, action: PayloadAction<string>) {
      state.qnaData.push(action.payload);
    },
    editQnAItem(
      state,
      action: PayloadAction<{ index: number; newValue: string }>
    ) {
      if (state.qnaData[action.payload.index]) {
        state.qnaData[action.payload.index] = action.payload.newValue;
      }
    },
    deleteQnAItem(state, action: PayloadAction<number>) {
      state.qnaData.splice(action.payload, 1);
    },
  },
});

export const {
  setItems,
  addItem,
  clearItems,
  setTimelineData,
  setListViewData,
  setFlashcardData,
  setMindfullnessData,
  setBarChartData,
  setPieChartData,
  setDoughnutChartData,
  setQnAData,
  addQnAItem,
  editQnAItem,
  deleteQnAItem,
} = swotSlice.actions;

export default swotSlice.reducer;
