import { createSelector } from "reselect";
import { connect } from "net";

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
// const getVisibilityFilter = state => state.visibilityFilter;
// const getTodos = state => state.todos;

// multiple instance with different props
const getVisibilityFilter = (state, props) =>
  state.todoList[props.listId].visibilityFilter;
const getTodos = (state, props) => state.todoList[props.listId].todos;

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

const getKeywords = (state, props) => state.todoList[props.listId].keywords;

// compose selectors
const getVisibleTodosFilteredByKeyword = createSelector(
  [getVisibleTodos, getKeywords],
  (visibleTodos, keyword) =>
    visibleTodos.filter(todo => todo.text.include(keyword))
);

const mapStateToProps = (state, props) => {
  return {
    // 组件多实例的时候 默认的selector缓存会失效, 因为每次props.listId不同
    // 缓存默认只缓存一个历史的computed state, 在一系列args没变的时候返回缓存
    todos: getVisibleTodos(state, props)
  };
};

/*
  多组件实例 共享selectors计算属性
*/

// 方案一
// react-redux: ^4.3.0
const makeGetVisibleTodos = () => {
  // 每次返回一个新的selector
  return getVisibilityFilter();
};

const makeMapStateToProps = () => {
  const getVisibleTodos = makeGetVisibleTodos();
  const mapStateToProps = (state, props) => {
    return getVisibleTodos(state, props);
  };
  return mapStateToProps;
};

// 传递makeStateToProps到connect函数，每个container实例都会得到一个拥有自己`getVisibleTodos` selectors的mapStateToProps函数，缓存还是正常使用的
// connect(makeMapStateToProps)();

// 方案二
// re-reselect
import createCachedSelector from "re-reselect";

// const getVisibilityFilter = (state, props) => state.todoList[props.listId].visibilityFilter;
// const getTodos = (state, props) => state.todoList[props.listId].todos;

const getCachedVisibleTodos = createCachedSelector(
  [getTodos, getVisibilityFilter],
  (todos, visibilityFilter) => {
    switch (visibilityFilter) {
      case "SHOW_ALL":
        return todos;
      case "SHOW_COMPLETED":
        return todos.filter(t => t.completed);
      case "SHOW_ACTIVE":
        return todos.filter(t => !t.completed);
    }
  }
)((state, props) => props.listId);
