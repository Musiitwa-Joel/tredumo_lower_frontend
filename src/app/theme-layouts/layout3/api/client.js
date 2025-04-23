import { create } from "apisauce";

const apiClient = create({
  baseURL: "http://localhost:9400/",
});

export default apiClient;
