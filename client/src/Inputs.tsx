import React from "react";
import type { ButtonProps, InputProps } from "./types";

const Input: React.FC<InputProps> = ({ label, ...props }) =>
  label ? (
    <>
      <label htmlFor={props.id}>{label}</label>
      <input {...props} />
    </>
  ) : (
    <input {...props} />
  );

export const TextInput: React.FC<InputProps> = ({ label, ...props }) => (
  <Input {...props} type="text" />
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
