import axios from "axios";
import { storage } from "../utils/storage";

export default axios.create({
  baseURL: "https://www.sheltie.app",
  headers: {
    Authorization: `Bearer ${storage.getString("authtoken")}`,
  },
});
