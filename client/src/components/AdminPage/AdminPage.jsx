import { useUrl } from "../../context/urlContext";
import { BASE_URL } from "../../config/config";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const { user } = useUrl();

  const [voteCount, setVoteCount] = useState([]);
  const [votingStatus, setVotingStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winnerCandidate, setWinnerCandidate] = useState(null);

  // Get all voting list
  useEffect(() => {
    axios
      .get(`${BASE_URL}/voting/list`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setVoteCount(res.data.votingList);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  // Get voting status
  useEffect(() => {
    axios
      .get(`${BASE_URL}/voting/status`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setVotingStatus(res.data.votingStatus[0]);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

// Find Winning Candidate
useEffect(() => {
  if (voteCount.length > 0) {
    const counts = {};
    voteCount.forEach((candidateData) => {
      const candidate = candidateData.candidate;
      counts[candidate] = (counts[candidate] || 0) + 1;
    });
    let maxCount = 0;
    let winningCandidate = null;
    for (const candidate in counts) {
      if (counts[candidate] > maxCount) {
        maxCount = counts[candidate];
        winningCandidate = candidate;
      }
    }
    setWinnerCandidate(winningCandidate);
  }
}, [voteCount]);

  // Live voting result
  const liveVotingResult = () => {
    axios
      .patch(`${BASE_URL}/voting/result/live`, {
        is_voting_result_live: true,
        is_voting_on: false,
        winner_candidate: winnerCandidate,
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        // window.location.reload();
        window.location.href="/"
      })
      .catch((err) => console.log(err));
  };

  // Live voting result
  const votingRestart = () => {
    axios
      .patch(`${BASE_URL}/voting/restart`, {
        is_voting_result_live: false,
        is_voting_on: true,
        winner_candidate: "",
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        // window.location.reload();
        window.location.href="/"
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center p-2">
          <div className="flex flex-col gap-6 items-center bg-slate-200 rounded-lg border-[1px] border-gray-300 p-2 w-60">
            <div className="font-semibold">
              <span className="text-xl">Please Wait</span>
              <span className="inline-block animate-bounce ml-1 text-2xl">
                ...
              </span>
            </div>
            <span className="inline-block w-16 h-16 border-4 border-white border-b-pink-600 rounded-full animate-spin"></span>
          </div>
        </div>
      ) : (
        <>
          {user?.isadmin ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center justify-center flex-wrap gap-10 p-2">
                <div className="flex flex-col gap-4 sm:w-[500px] w-[95vw] p-4 rounded-lg shadow-[0_0_5px_gray] relative">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                      <h1 className="font-bold">Candidate 1 Vote Count:</h1>
                      <p className="max-w-20 min-w-20 overflow-x-auto bg-slate-200 p-2 text-center overflow-auto font-semibold rounded-md">
                        {
                          voteCount.filter(
                            (candidate) => candidate.candidate === "Candidate-1"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <h1 className="font-bold">Candidate 2 Vote Count:</h1>
                      <p className="max-w-20 min-w-20 overflow-x-auto bg-slate-200 p-2 text-center overflow-auto font-semibold rounded-md">
                        {
                          voteCount.filter(
                            (candidate) => candidate.candidate === "Candidate-2"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <h1 className="font-bold">Candidate 3 Vote Count:</h1>
                      <p className="max-w-20 min-w-20 overflow-x-auto bg-slate-200 p-2 text-center overflow-auto font-semibold rounded-md">
                        {
                          voteCount.filter(
                            (candidate) => candidate.candidate === "Candidate-3"
                          ).length
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <h1 className="font-bold">Candidate 4 Vote Count:</h1>
                      <p className="max-w-20 min-w-20 overflow-x-auto bg-slate-200 p-2 text-center overflow-auto font-semibold rounded-md">
                        {
                          voteCount.filter(
                            (candidate) => candidate.candidate === "Candidate-4"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={liveVotingResult}
                    disabled={votingStatus?.is_voting_result_live}
                    className={`w-fit bg-green-600 text-white p-2 font-semibold ${
                      votingStatus?.is_voting_result_live
                        ? "bg-opacity-50 cursor-not-allowed"
                        : "bg-opacity-100 cursor-pointer"
                    }`}
                  >
                    Live Voting Result
                  </button>
                  <button
                    onClick={votingRestart}
                    disabled={votingStatus?.is_voting_on}
                    className={`w-fit bg-red-600 text-white p-2 font-semibold ${
                      votingStatus?.is_voting_on
                        ? "bg-opacity-50 cursor-not-allowed"
                        : "bg-opacity-100 cursor-pointer"
                    }`}
                  >
                    Start Voting Agian
                  </button>
                </div>
                {/* {winnerCandidate && <p>The winner is: {winnerCandidate}</p>} */}
              </div>
            </div>
          ) : (
            <Navigate to="/" />
          )}
        </>
      )}
    </>
  );
};

export default AdminPage;