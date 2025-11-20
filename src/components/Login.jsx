import React from "react";
import { useExtension } from "../context/ExtensionContext";
import { GlassCard } from "@developer-hub/liquid-glass";

export default function Login() {
  const { login } = useExtension();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="w-full mx-auto overflow-hidden rounded-[25px]">
      <GlassCard cornerRadius={25} style={{ width: "100%", padding: "15px" }}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 text-center w-full p-6 box-border"
        >
          {/* --- HEADER --- */}{" "}
          <div className="space-y-2">
            {/* Chữ màu đen theo yêu cầu */}{" "}
            <h3 className="text-3xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
              Welcome Back{" "}
            </h3>{" "}
            <p className="text-sm font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] uppercase tracking-widest">
              Naver Extension AI{" "}
            </p>{" "}
          </div>
          {/* --- INPUTS --- */}{" "}
          <div className="w-full space-y-3">
            {" "}
            <input
              type="text"
              placeholder="Email"
              className="w-full py-3 px-5 rounded-full 
                       bg-white border border-gray-300
                       text-black placeholder-gray-500 font-medium
                       outline-none shadow-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200 box-border"
            />{" "}
            <input
              type="password"
              placeholder="Password"
              className="w-full py-3 px-5 rounded-full 
                       bg-white border border-gray-300
                       text-black placeholder-gray-500 font-medium
                       outline-none shadow-md
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200 box-border"
            />{" "}
          </div>
          {/* --- BUTTON --- */}{" "}
          <button
            type="submit"
            className="w-full py-3 rounded-full 
                     bg-blue-600 hover:bg-blue-700
                     text-white font-bold text-lg shadow-lg
                     transform transition hover:scale-[1.02] active:scale-95
                     cursor-pointer"
          >
            Login{" "}
          </button>
          {/* ĐÃ XÓA FOOTER */}{" "}
        </form>{" "}
      </GlassCard>{" "}
    </div>
  );
}
