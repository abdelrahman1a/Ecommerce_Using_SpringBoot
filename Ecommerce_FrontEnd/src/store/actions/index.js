import api from "../../api/api";

export const fetchProducts = (queryString) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/public/products?${queryString}`);
    dispatch({
      type: "FETCH_PRODUCTS",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      lastPage: data.lastPage,
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed To Get Products",
    });
    console.log(error);
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "CATEGORY_LOADER" });
    const { data } = await api.get(`/public/categories`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      lastPage: data.lastPage,
    });
    dispatch({ type: "IS_ERROR" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const addToCart =
  (data, qty = 1, toast) =>
  (dispatch, getState) => {
    // 1 - find product
    const { products } = getState().products;
    const getProduct = products.find(
      (item) => item.productId === data.productId,
    );

    // check in stocks
    const isQunatityExist = getProduct.quantity >= qty;

    // if in stock add
    if (isQunatityExist) {
      dispatch({ type: "ADD_CART", payload: { ...data, quantity: qty } });
      toast.success(`${data?.productName} added to the cart`);
      localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    } else {
      toast.error("Out of stock");
    }
  };

export const increaseCartQunatity =
  (data, toast, currentQuantity, setCurrentQuantity) =>
  (dispatch, getState) => {
    const { products } = getState().products;
    console.log(products);

    const getProduct = products.find(
      (item) => item.productId === data.productId,
    );
    console.log(getProduct);

    const isQunatityExist = getProduct.quantity > currentQuantity + 1;

    if (isQunatityExist) {
      const newQunatity = currentQuantity + 1;
      setCurrentQuantity(newQunatity);
      dispatch({
        type: "ADD_CART",
        payload: { ...data, quantity: newQunatity },
      });
      localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    } else {
      toast.error("Quantity Reached to Limit");
    }
  };

export const decreaseCartQuantity =
  (data, newQuantity) => (dispatch, getState) => {
    dispatch({
      type: "ADD_CART",
      payload: { ...data, quantity: newQuantity },
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
  };

export const removeFromCart = (data, toast) => (dispatch, getState) => {
  dispatch({ type: "REMOVE_CART", payload: data });
  toast.success(`${data.productName} removed from cart`);
  localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
};

export const authenticateSignInUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      const { data } = await api.post("/auth/signin", sendData);
      dispatch({ type: "LOGIN_USER", payload: data });
      localStorage.setItem("auth", JSON.stringify(data));
      reset();
      toast.success("Login Success");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const registerNewUser =
  (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      const { data } = await api.post("/auth/signup", sendData);
      toast.success(data?.message || "User Registered Successfully");
      navigate("/login");
      reset();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.password ||
          "Internal Server Error",
      );
    } finally {
      setLoader(false);
    }
  };

export const logOutUser = (navigate) => async (dispatch) => {
  dispatch({ type: "LOG_OUT" });
  localStorage.removeItem("auth");
  navigate("/login");
};

export const addUpdateUserAddress =
  (sendData, toast, addressId, setOpenAddressModal) =>
  async (dispatch, getState) => {
    dispatch({ type: "BUTTON_LOADER" });

    try {
      if (!addressId) {
        const { data } = await api.post("/addresses", sendData);
      } else {
        await api.put(`/addresses/${addressId}`, sendData);
      }
      dispatch(getUserAddresses());
      toast.success("Address saved successfully");
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
      dispatch({ type: "IS_ERROR", payload: null });
    } finally {
      setOpenAddressModal(false);
    }
  };

export const getUserAddresses = () => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get("/addresses");
    dispatch({ type: "USER_ADDRESS", payload: data });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch user addresses",
    });
  }
};

export const selectUserCheckoutAddress = (address) => {
  localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
  return { type: "SELECT_CHECKOUT_ADDRESS", payload: address };
};

export const deleteUserAddress =
  (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
      dispatch({ type: "BUTTON_LOADER" });
      await api.delete(`/addresses/${addressId}`);
      dispatch({ type: "IS_SUCCESS" });
      dispatch(getUserAddresses());
      dispatch(clearCheckoutAddress());
      toast.success("Address deleted successfully");
    } catch (error) {
      console.log(error);
      dispatch({
        type: "IS_ERROR",
        payload: error?.response?.data?.message || "Some Error Occured",
      });
    } finally {
      setOpenDeleteModal(false);
    }
  };

export const clearCheckoutAddress = () => {
  return { type: "REMOVE_CHECKOUT_ADDRESS" };
};

export const addPaymentMethod = (method) => {
  return {
    type: "ADD_PAYMENT_METHOD",
    payload: method,
  };
};
export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    await api.post("/carts/create", sendCartItems);
    await dispatch(getUserCart());
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to create cart items",
    });
  }
};

export const getUserCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get("/carts/users/cart");
    console.log(data);
    dispatch({
      type: "GET_USER_CART_PRODUCTS",
      payload: data.products,
      totalPrice: data.totalPrice,
      cartId: data.cartId,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "IS_ERROR",
      payload: error?.response?.data?.message || "Failed to fetch cart items",
    });
  }
};

export const createStripePaymentSecret =
  (sendData) => async (dispatch, getState) => {
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.post("/order/stripe-client-secret", sendData);
      dispatch({ type: "CLIENT_SECRET", payload: data });
      localStorage.setItem("client-secret", JSON.stringify(data));
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      // toast.error(
      //   error?.response?.data?.message || "Failed to create client secret",
      // );
    }
  };

export const stripePaymentConfirmation =
  (sendData, setErrorMesssage, setLoadng, toast) =>
  async (dispatch, getState) => {
    try {
      const response = await api.post("/order/users/payments/online", sendData);
      if (response.data) {
        localStorage.removeItem("CHECKOUT_ADDRESS");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("client-secret");
        dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS" });
        dispatch({ type: "CLEAR_CART" });
        toast.success("Order Accepted");
      } else {
        setErrorMesssage("Payment Failed. Please try again.");
      }
    } catch (error) {
      setErrorMesssage("Payment Failed. Please try again.");
    }
  };

export const analyticsAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get("/admin/app/analytics");
    dispatch({ type: "FETCH_ANALYTICS", payload: data });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message || "Failed to fetch analytics data",
    });
  }
};

export const getOrdersForDashboard =
  (queryString, isAdmin) => async (dispatch) => {
    try {
      dispatch({ type: "IS_FETCHING" });
      const endpoint = isAdmin ? "/admin/orders" : "/seller/orders";
      const { data } = await api.get(`${endpoint}?${queryString}`);
      dispatch({
        type: "GET_ADMIN_ORDERS",
        payload: data.content,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        lastPage: data.lastPage,
      });
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "IS_ERROR",
        payload:
          error?.response?.data?.message || "Failed to fetch orders data",
      });
    }
  };

export const updateOrderStatusFromDashboard =
  (orderId, orderStatus, toast, setLoader, isAdmin) => async (dispatch) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
      const { data } = await api.put(`${endpoint}${orderId}/status`, {
        status: orderStatus,
      });
      toast.success(data.message || "Order updated successfully");
      await dispatch(getOrdersForDashboard());
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoader(false);
    }
  };

export const dashboardProductsAction =
  (queryString, isAdmin) => async (dispatch) => {
    try {
      dispatch({ type: "IS_FETCHING" });
      const endpoint = isAdmin ? "/admin/products" : "/seller/products";
      const { data } = await api.get(`${endpoint}?${queryString}`);
      dispatch({
        type: "FETCH_PRODUCTS",
        payload: data.content,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        lastPage: data.lastPage,
      });
      dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
      console.log(error);

      dispatch({
        type: "IS_ERROR",
        payload:
          error?.response?.data?.message ||
          "Failed to fetch dashboard products",
      });
    }
  };

export const dashboardCategoriesAction = (queryString) => async (dispatch) => {
  try {
    dispatch({ type: "IS_FETCHING" });
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data.content,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      lastPage: data.lastPage,
    });
    dispatch({ type: "IS_SUCCESS" });
  } catch (error) {
    console.log(error);

    dispatch({
      type: "IS_ERROR",
      payload:
        error?.response?.data?.message ||
        "Failed to fetch dashboard categories",
    });
  }
};

export const updateProductForDashboard =
  (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
      await api.put(`${endpoint}${sendData.id}`, sendData);
      toast.success("Product update successful");
      reset();
      setLoader(false);
      setOpen(false);
      await dispatch(dashboardProductsAction());
    } catch (error) {
      toast.error(
        error?.response?.data?.description || "Product update failed",
      );
    }
  };

export const deleteProduct =
  (setLoader, productId, toast, setOpenDeleteModal, isAdmin) =>
  async (dispatch, getState) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
      await api.delete(`${endpoint}${productId}`);
      toast.success("Product deleted successfully");
      setLoader(false);
      setOpenDeleteModal(false);
      await dispatch(dashboardProductsAction());
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Some Error Occured");
    }
  };

export const updateProductImageFromDashboard =
  (formData, productId, toast, setLoader, setOpen, isAdmin) =>
  async (dispatch) => {
    try {
      setLoader(true);
      const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
      await api.put(`${endpoint}${productId}/image`, formData);
      toast.success("Image upload successful");
      setLoader(false);
      setOpen(false);
      await dispatch(dashboardProductsAction());
    } catch (error) {
      toast.error(
        error?.response?.data?.description || "Product Image upload failed",
      );
    }
  };

export const addNewProductFromDashboard =
  (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch) => {
    try {
      const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
      console.log(sendData.categoryId);
      console.log(sendData.id);
      await api.post(`${endpoint}${sendData.categoryId}/product`, sendData);
      toast.success("Product created successfully");
      reset();
      setOpen(false);
      await dispatch(dashboardProductsAction());
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.description || "Product creation failed",
      );
    } finally {
      setLoader(false);
    }
  };

export const addNewCategoryFromDashboard =
  (sendData, toast, reset, setLoader, setOpen) => async (dispatch) => {
    try {
      console.log(sendData.id);
      await api.post(`/admin/categories`, sendData);
      toast.success("Category created successfully");
      reset();
      setOpen(false);
      await dispatch(dashboardCategoriesAction());
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.description || "Category creation failed",
      );
    } finally {
      setLoader(false);
    }
  };

export const updateCategoryFromDashboard =
  (sendData, toast, reset, setLoader, setOpen) => async (dispatch) => {
    try {
      setLoader(true);
      await api.put(`/admin/update/${sendData.categoryId}`, sendData);
      toast.success("Category updated successfully");
      reset();
      setLoader(false);
      setOpen(false);
      await dispatch(dashboardCategoriesAction());
    } catch (error) {
      toast.error(
        error?.response?.data?.description || "Category update failed",
      );
    }
  };

export const deleteCategory =
  (setLoader, cateoryId, toast, setOpenDeleteModal) =>
  async (dispatch, getState) => {
    try {
      setLoader(true);
      await api.delete(`admin/delete/${cateoryId}`);
      toast.success("Category deleted successfully");
      setLoader(false);
      setOpenDeleteModal(false);
      await dispatch(dashboardCategoriesAction());
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Some Error Occured");
    }
  };

export const getAllSellersDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/auth/sellers?${queryString}`);
      dispatch({
        type: "GET_SELLERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch sellers data",
      });
    }
  };

export const addNewDashboardSeller =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      await api.post("/auth/signup", sendData);
      reset();
      toast.success("Seller registered successfully!");

      await dispatch(getAllSellersDashboard());
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error",
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };
