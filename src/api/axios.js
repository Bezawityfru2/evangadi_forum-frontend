import axios from "axios";

const instance = axios.create({
  baseURL: "https://api-node-payment-4djf.onrender.com/api",
});

export default instance;
