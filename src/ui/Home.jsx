import { useSelector } from "react-redux";
import CreateUser from "./../features/user/CreateUser";
import Button from "./Button";

function Home() {
  const userName = useSelector((store) => store.user.userName);

  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-4 text-center text-xl font-semibold text-stone-700 md:text-3xl">
        The best pizza. Ever
        <span className="text-yellow-500">
          <br />
          Straight out of the oven, straight to you.
        </span>
      </h1>
      {userName === "" ? (
        <CreateUser />
      ) : (
        <Button to="/menu" type="primary">
          {" "}
          Continue ordering , {userName}{" "}
        </Button>
      )}
    </div>
  );
}

export default Home;
