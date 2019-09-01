import React from "react";

export default ({ size = 150, src }) => (
  <img alt="User portrait" src={src} height={size} width={size} />
);
