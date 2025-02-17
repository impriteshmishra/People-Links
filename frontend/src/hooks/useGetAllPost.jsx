import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const URL = 'https://people-links.onrender.com'

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`${URL}/api/v1/post/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        //   console.log("Testing hooks get all post", res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};
export default useGetAllPost;
