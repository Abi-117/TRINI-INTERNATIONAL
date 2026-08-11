const Navbar = () => {
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-xl font-semibold">
        Admin Dashboard
      </h2>

      <button
        onClick={logout}
        className="rounded-lg bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;