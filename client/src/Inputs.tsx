import React from "react";
import type { ButtonProps, InputProps } from "./types";

const Input: React.FC<InputProps> = ({ label, ...props }) =>
  label && props.id ? (
    <div className="p-2">
      <label className="mx-1 p-1 text-white" htmlFor={props.id}>
        {label}
      </label>
      <br />
      <input {...props} />
    </div>
  ) : (
    <input {...props} />
  );

export const TextInput: React.FC<InputProps> = ({ label, ...props }) => (
  <Input label={label} {...props} type="text" />
);

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  const classNames = "focus:border-2 focus:outline-2 focus:ring-2";
  return (
    <button
      {...props}
      className={
        props.className ? props.className + " " + classNames : classNames
      }
    >
      {children}
    </button>
  );
};
