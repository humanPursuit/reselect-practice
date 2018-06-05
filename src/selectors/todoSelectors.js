import { createSelector } from "reselect";

const getVisibilityFilter = (state, props) => {
  console.log(props);
  return state.visibilityFilter;
};
const getTodos = (state, props) => {
  console.log(props);
  return state.todos;
};

export const getVisibleTodos = createSelector(
  [getTodos, getVisibilityFilter],
  (todos, visibilityFilter) => {
    switch (visibilityFilter) {
      case "SHOW_ALL":
        return todos;
      case "SHOW_COMPLETED":
        return todos.filter(t => t.completed);
      case "SHOW_ACTIVE":
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }
);
