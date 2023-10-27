import { Outlet, useNavigation } from "react-router-dom";
import CartOverview from "../src/features/cart/CartOverview";
import Header from "./header";
import Loader from "./Loader";

function AppLayout() {
  //to find if the page is still loading
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="layout">
      {isLoading && <Loader />}
      <Header />

      <main>
        <Outlet />
      </main>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
