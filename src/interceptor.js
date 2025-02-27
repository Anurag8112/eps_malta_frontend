import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SetupInterceptors from "./interceptor/axiosInterceptor";

const Interceptor = (props) => {
  let navigate = useNavigate();
  const [ran, setRan] = useState(false);

  {
    /* only run setup once */
  }
  if (!ran) {
    SetupInterceptors(navigate);
    setRan(true);
  }
  return <></>;
};

export default Interceptor;
