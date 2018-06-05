import React from "react";
import FilterLink from "./FilterLink";
import { VisibilityFilters } from "../redux/actions";

const Footer = () => (
  <p>
    show: <FilterLink filter={VisibilityFilters.SHOW_ALL}>ALL</FilterLink> ,
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>ACTIVE</FilterLink> ,
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>COMPLETED</FilterLink>
  </p>
);

export default Footer;
