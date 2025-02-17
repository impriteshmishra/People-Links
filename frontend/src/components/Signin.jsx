import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Signin = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const URL = import.meta.env.VITE_APP_URL_BACKEND;
  const URL = 'https://people-links.onrender.com'

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signinHandler = async (e) => {
    e.preventDefault(); // I am using this to prevent refreshing the page that avoid data.
    // console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(`${URL}/api/v1/user/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signinHandler}
        className="shadow-lg flex flex-col gap-5 p-8 border border-blue-700 rounded-lg"
      >
        <div>
          <h1 className="text-center font-bold text-xl  text-blue-500 italic">People-Link</h1>
          <p className="text-sm text-center">Sign in to explore the world.</p>
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button className="bg-blue-500 hover:bg-white hover:text-blue-500 hover:border border-blue-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait.
          </Button>
        ) : (
          <Button type="submit" className="bg-blue-500 hover:bg-white hover:text-blue-500 hover:border border-blue-500">Sign in</Button>
        )}
        <span className="text-center">
          New to People-Link?{" "}
          <Link to="/signup" className="text-blue-600 font-bold">
            Join now
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signin;
