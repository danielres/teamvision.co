import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost"; // or you can use `import gql from 'graphql-tag';` instead
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import classnames from "classnames";

import { useAuth } from "../auth";
import IconBurger2 from "./IconBurger";

const c = {
  link: "text-sm block md:inline-block md:mt-0 hover:text-white mr-4",
  link_active: "text-white",
  button:
    "px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white leading-none text-sm"
};

const Hr = () => <div className="border-b border-teal-400 my-4" />;

export default () => {
  const { logout } = useAuth();
  const [isBurgerNavOpen, setIsBurgerNavOpen] = useState(false);

  const { loading, error, data } = useQuery(
    gql`
      {
        userInfo {
          email
          email_verified
          picture
        }
      }
    `
  );

  if (error) return <pre>{JSON.stringify(error)}</pre>;
  if (loading) return null;

  const onBurgerClick = () => setIsBurgerNavOpen(!isBurgerNavOpen);

  return (
    <nav className="flex items-baseline justify-between flex-wrap bg-teal-500 p-6 shadow-md">
      <div className="flex flex-shrink-0 text-white mr-6">
        {/* TODO: insert svg logo here */}
        <Link to="/" className="font-semibold text-xl">
          uptal
        </Link>
      </div>

      <div className="md:hidden">
        <button onClick={onBurgerClick} className={c.button}>
          <IconBurger2 />
        </button>
      </div>
      <div
        className={classnames(
          { hidden: isBurgerNavOpen },
          "md:flex w-full block flex-grow md:w-auto"
        )}
      >
        <div className="md:flex-grow text-teal-200">
          <NavLink
            to="/persons"
            className={classnames(c.link, "mt-4")}
            activeClassName={c.link_active}
          >
            Persons
          </NavLink>

          <NavLink
            to="/tags"
            className={classnames(c.link, "mt-4")}
            activeClassName={c.link_active}
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
