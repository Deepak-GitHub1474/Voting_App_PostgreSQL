import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../config/config";

const LandingPage = () => {
  const [votingStatus, setVotingStatus] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col gap-6 items-center bg-slate-200 rounded-lg border-[1px] border-gray-300 p-2 w-60">
          <div className="font-semibold">
            <span className="text-xl">Please Wait</span>
            <span className="inline-block animate-bounce ml-1 text-2xl">
              ...
            </span>
          </div>
          <span className="inline-block w-16 h-16 border-4 border-white border-b-pink-600 rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-10">
          <div>
            <h1 className="sm:text-3xl text-2xl font-bold text-gray-950 mb-4">
              Welcome to e-Voting
            </h1>
            <p className="max-w-[48rem] w-[95vw] text-gray-500">
              Voting is a fundamental right and responsibility in any democratic
              society. It is a way for citizens to actively participate in
              shaping the future of their nation. By casting their votes, Voting
              empowers citizens to hold their leaders accountable and to express
              their preferences on various issues that affect their lives, such
              as healthcare, education, economic policies, and social justice.
            </p>
          </div>
          {!votingStatus.is_voting_on ? (
            <div className="w-fit overflow-x-auto bg-slate-200 p-2 text-center  font-semibold rounded-md text-2xl text-blue-600">
              Voting window has been closed and the winner candidate is:{" "}
              <span className="font-bold text-red-500">{votingStatus.winner_candidate}</span>
            </div>
          ) : (
            <div className="w-fit overflow-x-auto bg-slate-200 p-2 text-center  font-semibold rounded-md text-2xl text-blue-600">
              Winner candidate will live soon...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
