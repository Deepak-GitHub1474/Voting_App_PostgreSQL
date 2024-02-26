import { Link } from "react-router-dom";
import { useUrl } from "../../context/urlContext";
import { BASE_URL } from "../../config/config";
import axios from "axios";
import { useEffect, useState } from "react";

function Header() {
  const { user } = useUrl();
  const [votingStatus, setVotingStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logout
  const handleLogout = () => {
    axios
      .get(`${BASE_URL}/logout`)
      .then((res) => {
        if (res.data.responseMsg === "Success") console.log(res);
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
  };

  // Get voting status
  useEffect(() => {
    axios
      .get(`${BASE_URL}/voting/status`, { withCredentials: true })
      .then((res) => {
        setVotingStatus(res.data.votingStatus[0]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <header className="h-[10vh] p-4 bg-gray-800 w-full shadow-[0_0_2px_#0000ff] flex items-center justify-center gap-6 fixed left-0 right-0 z-50">
      <Link to="/">
        <h1 className="w-24 bg-slate-100 hover:bg-slate-200 py-2 px-1 font-semibold text-center">
          Home
        </h1>
      </Link>

      <>
        {!user.email ? (
          <>
            <Link to="/login">
              <button className=" w-24 bg-slate-100 hover:bg-slate-200 py-2 px-1 font-semibold">
                LogIn
              </button>
            </Link>
            <Link to="/register">
              <button className=" w-24 bg-slate-100 hover:bg-slate-200 py-2 px-1 font-semibold">
                Register
              </button>
            </Link>
          </>
        ) : (
          <>
            <>
              {loading ? (
                ""
              ) : (
                <>
                  {!user.isadmin && votingStatus?.is_voting_on && 
                  (
                      <Link to="/votingPage">
                        <button className=" w-24 bg-blue-500 text-white hover:bg-blue-400 py-2 px-1 font-semibold">
                          Voting Page
                        </button>
                      </Link>
                  )}
                </>
              )}
            </>

            <>
              {user.isadmin && (
                <Link to="/admin">
                  <button className=" w-24 bg-blue-500 hover:bg-blue-400 py-2 px-1 font-semibold text-white">
                    Admin
                  </button>
                </Link>
              )}
            </>
            <button
              onClick={handleLogout}
              className=" w-24 bg-slate-100 hover:bg-slate-200 py-2 px-1 font-semibold"
            >
              Logout
            </button>
          </>
        )}
      </>
    </header>
  );
}
export default Header;
