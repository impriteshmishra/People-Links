
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3500/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        //   console.log("Testing hooks get all post", res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};
export default useGetUserProfile;
