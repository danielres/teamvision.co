import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import classnames from "classnames";

import { useAuth } from "../../../providers/auth";
import IconBurger2 from "./IconBurger";

const c = {
  link:
    "text-sm block md:inline-block md:mt-0 hover:text-white mr-4 font-semibold ",
  link_active: "text-white",
  button:
    "px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white leading-none text-sm"
};

const Hr = () => <div className="border-b border-teal-400 my-4" />;

export default () => {
  const { logout } = useAuth();
  const [isBurgerNavOpen, setIsBurgerNavOpen] = useState(false);
  const close = () => setIsBurgerNavOpen(false);

  const onBurgerClick = () => setIsBurgerNavOpen(!isBurgerNavOpen);

  return (
    <nav className="flex items-baseline justify-between flex-wrap bg-teal-500 px-6 py-2 shadow-md">
      <div className="flex flex-shrink-0 text-teal-200 mr-6">
        {/* TODO: insert svg logo here */}
        <Link to="/" className={classnames(c.link, "text-lg")}>
          Teamvision
        </Link>
      </div>

      <div className="md:hidden">
        <button onClick={onBurgerClick} className={c.button}>
          <IconBurger2 />
        </button>
      </div>
      <div
        className={classnames(
          { hidden: !isBurgerNavOpen },
          "md:flex w-full block flex-grow md:w-auto"
        )}
      >
        <div className="md:flex-grow text-teal-200">
          <NavLink
            to="/persons"
            className={classnames(c.link, "mt-4")}
            activeClassName={c.link_active}
            onClick={close}
          >
            Persons
          </NavLink>

          <NavLink
            to="/tags"
            className={classnames(c.link, "mt-4")}
            activeClassName={c.link_active}
            onClick={close}
          >
            Tags
          </NavLink>
        </div>

        <Hr />

        <div className="flex justify-between items-baseline text-teal-200 ">
          <NavLink
            to="/profile"
            className={c.link}
            activeClassName={c.link_active}
            onClick={close}
          >
            Profile
          </NavLink>
          <button className={c.button} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
