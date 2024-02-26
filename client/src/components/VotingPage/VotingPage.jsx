import { useEffect, useState } from "react";
import { useUrl } from "../../context/urlContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import toast from "react-hot-toast";

const VotingPage = () => {
  const { user, isLogged } = useUrl();

  const [candidate, setCandidate] = useState("");
  const [voteList, setVoteList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Select candidate
  const selectCandidate = (e) => {
    setCandidate(e.target.value);
  };

  // Select candidate
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!candidate) {
      toast.error("Please select candidate");
      return;
    }

    try {
      const userData = { candidate: candidate, user_email: user.email };
      const res = await axios.post(`${BASE_URL}/voting`, userData);
      window.location.reload();
    } catch (err) {
      toast.error(err.data.responseMsg);
    }
  };

  // Get all voting list
  useEffect(() => {
    axios
      .get(`${BASE_URL}/voting/list`, { withCredentials: true })
      .then((res) => {
        setVoteList(res.data.votingList);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  // Get all user list
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/list`, { withCredentials: true })
      .then((res) => {
        setUserList(res.data.userList);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {isLogged ? (
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
          {user.email ? (
            <div className=" min-h-screen flex items-center justify-center relative">
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
                    {!user?.isvoted ? (
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 sm:w-[500px] w-[95vw] pb-4 pt-4 px-2 rounded-lg shadow-[0_0_5px_gray] relative"
                      >
                        <div className="flex flex-col gap-2">
                          <h1 className="text-center font-bold text-2xl text-blue-500 mb-2">
                            Voting Form
                          </h1>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="candidate-1"
                              name="candidate"
                              value="Candidate-1"
                              checked={candidate === "Candidate-1"}
                              onChange={selectCandidate}
                            />
                            <label htmlFor="candidate-1">CANDIDATE 1</label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="candidate-2"
                              name="candidate"
                              value="Candidate-2"
                              checked={candidate === "Candidate-2"}
                              onChange={selectCandidate}
                            />
                            <label htmlFor="candidate-2">CANDIDATE 2</label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="candidate-3"
                              name="candidate"
                              value="Candidate-3"
                              checked={candidate === "Candidate-3"}
                              onChange={selectCandidate}
                            />
                            <label htmlFor="candidate-3">CANDIDATE 3</label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="candidate-4"
                              name="candidate"
                              value="Candidate-4"
                              checked={candidate === "Candidate-4"}
                              onChange={selectCandidate}
                            />
                            <label htmlFor="candidate-4">CANDIDATE 4</label>
                          </div>
                        </div>

                        <button className="bg-blue-600 text-white font-bold rounded-md p-1 hover:bg-blue-500 cursor-pointer flex items-center justify-center">
                          Vote
                        </button>
                      </form>
                    ) : (
                      <div className="min-h-screen flex items-center justify-center p-2">
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
                          <div className="w-fit overflow-x-auto bg-slate-200 p-2 text-center overflow-auto font-semibold rounded-md text-2xl text-blue-600">
                            <span>You have voted for</span>
                            <span className="text-red-500 ml-1">
                              {
                                voteList.find(
                                  (candidate) =>
                                    candidate.user_email === user?.email
                                ).candidate
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          ) : (
            <Navigate to="/" />
          )}
        </>
      )}
    </>
  );
};

export default VotingPage;
