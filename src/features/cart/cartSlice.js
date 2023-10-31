import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  //   cart: [
  //     {
  //       pizzaId: 12,
  //       name: "Pizza pizza",
  //       quantity: 2,
  //       unitPrice: 16,
  //       totalPrice: 32,
  //     },
  //   ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      //payload should be new item
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      //payload is pizza id
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      //payload if pizza id
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity = item.quantity + 1;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      //payload if pizza id
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity = item.quantity - 1;
      item.totalPrice = item.quantity * item.unitPrice;

      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getTotalCartQuantity = (store) =>
  store.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (store) =>
  store.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCart = (store) => store.cart.cart;

export const getCurrentQuantityById = (id) => (store) =>
  store.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
