import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const {userData} = useSelector((state) => state.auth);
  console.log(`Auth status is ${authStatus}`);
  console.log(`Auth userData is ${userData}`);

  useEffect(() => {
    if (authStatus !== authentication) {
      navigate(authentication ? "/login" : "/");
      return;
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
