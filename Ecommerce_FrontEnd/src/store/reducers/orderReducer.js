const initialState = {
  adminOrder: null,
  pagination: {},
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ADMIN_ORDERS":
      return {
        ...state,
        adminOrder: action.payload,
        pagination: {
          ...state.pagination,
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          lastPage: action.lastPage,
          totalPages: action.totalPages,
        },
      };

    default:
      return state;
  }
};
