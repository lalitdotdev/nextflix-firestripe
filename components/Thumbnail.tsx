import Image from "next/image";
import { Movie } from "../typings";
import { useRecoilState } from "recoil";
import { movieState, modalState } from "../atoms/modalAtom";

interface Props {
  // When using firebase
  // movie: Movie | DocumentData;
  movie: Movie;
}

function Thumbnail({ movie }: Props) {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  return (
    <div
      className="relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 mid:min-w-[260px] md:hover:scale-105"
      onClick={() => {
        setCurrentMovie(movie); // setting the current movie as movie so that we can display it inside our modal
        setShowModal(true);
        // console.log(movie);
      }}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`}
        className="rounded-sm object-cover  md:rounded"
        layout="fill"
        alt="Thumbnail Image"
      />
    </div>
  );
}

export default Thumbnail;
