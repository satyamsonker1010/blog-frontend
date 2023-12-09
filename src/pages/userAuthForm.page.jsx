import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";
const UserAuthForm = ({ type }) => {
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  //When form submit
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type === "sign-in" ? "/signin" : "/signup";
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let form = new FormData(formDetailsId);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { fullname, email, password } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        toast.error("Fullname must br at least 3 letters long");
        return;
      }
    }

    if (!email.length) {
      toast.error("Enter email");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Email adddress is not correct.");
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password should be 6 to 20 characters long with a number, 1 lowercase and 1 uppercase letters."
      );
      return;
    }

    //call the function for creating the account
    userAuthThroughServer(serverRoute, formData);
  };

  //Login with google
  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let serverRoutePath = "/google-auth";
        let formData = {
          access_token: user.accessToken,
        };
        userAuthThroughServer(serverRoutePath, formData);
      })
      .catch((err) => {
        toast.error("Trouble login through google");
        return console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formDetailsId" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center">
            {type === "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              id="full-name"
              value={""}
              icon={"fi-rr-user"}
            />
          ) : (
            ""
          )}
          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            id="email-id"
            value={""}
            icon={"fi-rr-envelope"}
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            id="password"
            value={""}
            icon={"fi-rr-key"}
          />
          <button
            className="btn-dark center mt-14"
            type={"submit"}
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>
          <div className="relative w-full flex item-center  gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="mt-2.5 w-1/2 border-black" />
            <p className="">or</p>
            <hr className="mt-2.5 w-1/2 border-black" />
          </div>
          <button
            className="btn-dark flex items-center 
        justify-center w-[90%] center "
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5 mr-2" />
            continue with google
          </button>
          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?{" "}
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Create Account
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?{" "}
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
