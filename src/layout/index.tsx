import React from "react";
import { ILayout } from "./types";
import "./index.less";

const Layout: React.FC<ILayout> = ({ children }) => {
  return <div className="layout">{children}</div>;
};

export default Layout;
