import MuiModal from "@mui/material/Modal";
import { modalState, movieState } from "../atoms/modalAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { Movie, Element, Genre } from "../typings";
import toast, { Toaster } from "react-hot-toast";
import { FaPlay, FaThumbsUp, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";

function Modal() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [muted, setMuted] = useState(false);
  const [addedToList, setAddedToList] = useState(false);

  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);
  const { user } = useAuth();

  const toastStyle = {
    background: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "15px",
    borderRadius: "9999px",
    maxWidth: "1000px",
  };

  useEffect(() => {
    if (!movie) return;
    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      )
        .then((response) => response.json())
        .catch((err) => console.log(err.message));

      // console.log(data);

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === "Trailer"
        );

        setTrailer(data.videos?.results[index]?.key);
      }

      if (data?.genres) {
        setGenres(data.genres);
      }
    }

    fetchMovie();
  }, [movie]);

  //----------------------> Implementing handleList

  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!)
      );

      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        {
          icon: "✔️",
          duration: 8000,
          style: toastStyle,
        }
      );
    } else {
      await setDoc(
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!),
        { ...movie }
      );
      toast.success(
        `${movie?.title || movie?.original_name} has been added to My List`,
        {
          duration: 7000,
          style: toastStyle,
        }
      );
    }
  };
  const handleClose = () => {
    setShowModal(false);
  };

  // console.log(trailer);
  // console.log(genres);

  // ------->  Find all the movies in the user's My list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, "customers", user.uid, "myList"),
        (snapshot) => setMovies(snapshot.docs)
      );
    }
  }, [db, movie?.id]);

  // -------> Check if the movie is already in the user's list

  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
      ),
    [movies]
  );
  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
        <Toaster position="bottom-center" />
        <button
          onClick={handleClose}
          className="modalButton absolute right-5 top-5 !z-40  h-9 w-9 border-none bg-[#181818] hover:bg-[#181818] "
        >
          <XMarkIcon className="h-6 w-6 " />
        </button>
        {/* ----->  fetching the real time videos  ------>*/}
        {/* ----- > react player --> MOST popular video player library */}
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={
              `https://www.youtube.com/watch?v=${trailer}` ||
              "https://www.youtube.com/watch?v=iFJ4ig7GK9Y"
            }
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            muted={muted}
          />

          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]">
                {" "}
                <FaPlay className="h-7 w-7 text-black" />
                Play
              </button>

              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <PlusIcon className="h-7 w-7" />
                )}
              </button>
              <button className="modalButton">
                <FaThumbsUp className="h-7 w-7" />
              </button>
            </div>

            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <FaVolumeMute className="h-6 w-6" />
              ) : (
                <FaVolumeUp className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie!.vote_average * 10} % Match
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>

            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres: </span>
                  {genres.map((genre) => genre.name).join(", ")}
                </div>

                <div>
                  <span className="text-[gray]">Original Language: </span>
                  {movie?.original_language}
                </div>

                <div className="">
                  <span className="text-[gray]">Total Votes: </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  );
}

export default Modal;
