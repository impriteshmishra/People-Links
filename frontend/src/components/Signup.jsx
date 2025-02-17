import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const URL = import.meta.env.VITE_APP_URL_BACKEND;

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault(); // I am using this to prevent refreshing the page that avoid data.
    // console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(`${URL}/api/v1/user/register`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/signin");
        toast.success(res.data.message);
        setInput({
          username: "",
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
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8 border border-blue-700 rounded-lg"
      >
        <div>
          <h1 className="text-center font-bold text-xl text-blue-500 italic">People-Link</h1>
          <p className="text-sm text-center">Join People-Link.</p>
        </div>
        <div>
          <Label className="font-medium">Name</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
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
          <Button type="submit" className="bg-blue-500 hover:bg-white hover:text-blue-500 hover:border border-blue-500">Join now</Button>
        )}
        <span className="text-center">
          Already on People-Link?{" "}
          <Link to="/signin" className="text-blue-600 font-bold">
            Sign in
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
