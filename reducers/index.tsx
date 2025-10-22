export const imageInitialState: ImageState = {
  preview: null,
  filename: null,
  file: null,
  size: null,
  type: "--",
  width: null,
  height: null,
  date: "--",
};

export const imageReducer = (
  state: ImageState,
  action: ImageStateAction
): ImageState => {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "RESET":
      return imageInitialState;
    default:
      return state;
  }
};

// ---
export const initialAccordionState: AccordionItem[] = [
  { id: crypto.randomUUID(), checked: false, title: "", message: "" },
];

export const accordionReducer = (
  state: AccordionItem[],
  action: AccordionStateAction
): AccordionItem[] => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: crypto.randomUUID(), checked: false, title: "", message: "" },
      ];

    case "REMOVE":
      if (state.length === 1) return state;
      return state.filter((item) => item.id !== action.id);

    case "UPDATE_CHECK":
      return state.map((item) =>
        item.id === action.id ? { ...item, checked: action.value } : item
      );

    case "UPDATE_TITLE":
      return state.map((item) =>
        item.id === action.id ? { ...item, title: action.value } : item
      );

    case "UPDATE_MESSAGE":
      return state.map((item) =>
        item.id === action.id ? { ...item, message: action.value } : item
      );

    default:
      return state;
  }
};
