import React from "react";
import Link from "next/link";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Menú</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/usuario">Usuario</Link>
          </li>
          <li>
            <Link href="/historial">Historial</Link>
          </li>
          <li>
            <Link href="/juegos">Juegos</Link>
          </li>
          <li>
            <Link href="/wallet">Wallet</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
