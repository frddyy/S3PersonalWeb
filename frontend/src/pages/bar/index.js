import { useState, Fragment } from "react";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Layout from "../layout"
import Sidebar from "../../components/global/Sidebar";
import Topbar from "../../components/global/Topbar";

const Bar = ({ children }) => {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <Layout>
        <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              {children}
            </main>
          </div>
    </Layout>
  );
};

export default Bar;
