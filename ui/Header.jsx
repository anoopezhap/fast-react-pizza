import { Link } from "react-router-dom";
import SearchOrder from "../src/features/order/SearchOrder";

function Header() {
  return (
    <header>
      <Link to="/">Fast React Company</Link>
      <SearchOrder />
    </header>
  );
}

export default Header;
