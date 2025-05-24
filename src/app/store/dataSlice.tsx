// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface SWOTState {
//   items: string[];        // Existing SWOT items
//   timelineData: string;   // Timeline data
//   listViewData: string;   // List view data
//   flashcardData: string;  // Flashcard data
//   // items: string[];
//   // timelineData: string;
//   // listViewData: string;
//   qnaData: string[]; // Correct type
// }

// const initialState: SWOTState = {
//   items: [],
//   timelineData: `
//     1990: Founded the company
//     1995: Launched first product
//     2000: Expanded to international markets
//     2005: Reached 1 million customers
//     2010: Introduced new technology
//     2015: Acquired a competitor
//     2020: Celebrated 30 years in business
//     2025: Planned future innovations
//   `,
//   listViewData: '',
//   flashcardData: `
//     What is React?:A JavaScript library for building user interfaces
//     What is JSX?:A syntax extension for JavaScript that allows writing HTML-like code
//     What is a Component?:A reusable piece of UI that can accept props and manage state
//     What is State?:An object that holds data that may change over time in a component
//   `,
//   qnaData: [],
// };

// const swotSlice = createSlice({
//   name: 'swot',
//   initialState,
//   reducers: {
//     setItems(state, action: PayloadAction<string[]>) {
//       state.items = action.payload;
//     },
//     addItem(state, action: PayloadAction<string>) {
//       state.items.push(action.payload);
//     },
//     clearItems(state) {
//       state.items = [];
//     },
//     setTimelineData(state, action: PayloadAction<string>) {
//       state.timelineData = action.payload;
//     },
//     setListViewData(state, action: PayloadAction<string>) {
//       state.listViewData = action.payload;
//     },
//     setFlashcardData(state, action: PayloadAction<string>) {
//       state.flashcardData = action.payload;

//     // QnA Actions
//     setQnAData(state, action: PayloadAction<string[]>) {
//       state.qnaData = action.payload;
//     }
//     addQnAItem(state, action: PayloadAction<string>) {
//       state.qnaData.push(action.payload);
//     }
//     editQnAItem(state, action: PayloadAction<{ index: number; newValue: string }>) {
//       if (state.qnaData[action.payload.index]) {
//         state.qnaData[action.payload.index] = action.payload.newValue;
//       }
//     }
//     deleteQnAItem(state, action: PayloadAction<number>) {
//       state.qnaData.splice(action.payload, 1);
//     }
//   },
// });

// export const { 
//   // setItems, 
//   // addItem, 
//   // clearItems, 
//   // setTimelineData, 
//   // setListViewData,
//   setFlashcardData, 
// // export const {
//   setItems,
//   addItem,
//   clearItems,
//   setTimelineData,
//   setListViewData,
//   setQnAData,
//   addQnAItem,
//   editQnAItem,
//   deleteQnAItem
// } = swotSlice.actions;

// export default swotSlice.reducer;











import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SWOTState {
  items: string[];        // Existing SWOT items
  timelineData: string;   // Timeline data
  listViewData: string;   // List view data
  flashcardData: string;  // Flashcard data
  mindfullnessData: string;
  qnaData: string[];      // Q&A data
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
  listViewData: '',
  flashcardData: `
    What is React?:A JavaScript library for building user interfaces
    What is JSX?:A syntax extension for JavaScript that allows writing HTML-like code
    What is a Component?:A reusable piece of UI that can accept props and manage state
    What is State?:An object that holds data that may change over time in a component
  `,
  mindfullnessData:'',
  qnaData: [],
};

const swotSlice = createSlice({
  name: 'swot',
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
    // QnA Actions
    setQnAData(state, action: PayloadAction<string[]>) {
      state.qnaData = action.payload;
    },
    addQnAItem(state, action: PayloadAction<string>) {
      state.qnaData.push(action.payload);
    },
    editQnAItem(state, action: PayloadAction<{ index: number; newValue: string }>) {
      if (state.qnaData[action.payload.index]) {
        state.qnaData[action.payload.index] = action.payload.newValue;
      }
    },
    deleteQnAItem(state, action: PayloadAction<number>) {
      state.qnaData.splice(action.payload, 1);
    }
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
  setQnAData,
  addQnAItem,
  editQnAItem,
  deleteQnAItem
} = swotSlice.actions;

export default swotSlice.reducer;