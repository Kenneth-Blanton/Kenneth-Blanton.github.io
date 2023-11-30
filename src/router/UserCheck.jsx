import { UserAuth } from "../data/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserCheck = () => {
  const { user } = UserAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) {
      navigate("/welcome");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return user;
};

export default UserCheck;
