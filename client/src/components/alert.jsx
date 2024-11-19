import React from "react";

const Alert = ({ msg}) => {

  return (
    <div className="alert alert-light" role="alert">
      {msg}
    </div>
  );
};

export default Alert;
