import { createSelector } from "reselect";

const initialState = {
  shop: {
    taxPercent: 8,
    items: [{ name: "apple", value: 1.2 }, { name: "orange", value: 0.95 }]
  }
};

// get items
const shopItemsSelector = state => state.shop.items;
// get taxPercent
const taxPercentSelector = state => state.shop.taxPercent;

// sum items total price
const subTotalSelector = createSelector(shopItemsSelector, items =>
  items.reduce((acc, item) => acc + item.value, 0)
);

// get total tax
const taxSelector = createSelector(
  subTotalSelector,
  taxPercentSelector,
  (subTotal, taxPercent) => subTotal * (taxPercent / 100)
);

// tax + total
export const totalSelector = createSelector(
  subTotalSelector,
  taxSelector,
  (subTotal, tax) => ({ total: subTotal + tax })
);

console.log(subTotalSelector(initialState));
console.log(taxSelector(initialState));
console.log(totalSelector(initialState));

// Todolist example
// const getVisibleTodos = (todos, filter) => {
//   switch (filter) {
//     case "SHOW_ALL":
//       return todos;
//     case "SHOW_COMPLETED":
//       return todos.filter(t => t.completed);
//     case "SHOW_ACTIVE":
//       return todos.filter(t => !t.completed);
//   }
// };

// extract state
const getVisibilityFilter = state => state.visibilityFilter;
const getTodos = state => state.todos;
const getKeywords = state => state.keywords;

const getVisibleTodos = createSelector(
  [getVisibilityFilter, getTodos],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case "SHOW_ALL":
        return todos;
      case "SHOW_COMPLETED":
        return todos.filter(t => t.completed);
      case "SHOW_ACTIVE":
        return todos.filter(t => !t.completed);
    }
  }
);

// compose selectors
const getVisibleTodosFilteredByKeyword = createSelector(
  [getVisibleTodos, getKeywords],
  (visibleTodos, keyword) =>
    visibleTodos.filter(todo => todo.text.include(keyword))
);
