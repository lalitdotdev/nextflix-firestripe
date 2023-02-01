import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Banner from "../components/Banner";
import requests from "../utils/requests";
import { Movie } from "../typings";
import Row from "../components/Row";
import useAuth from "../hooks/useAuth";
import { modalState, movieState } from "../atoms/modalAtom";
import Modal from "../components/Modal";
import { useRecoilValue } from "recoil";
import Plans from "../components/Plans";
import { Product, getProducts } from "@stripe/firestore-stripe-payments";
import payments from "../lib/stripe";
import useSubscription from "../hooks/useSubscription";
import useList from "../hooks/useList";

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}: Props) => {
  // console.log(products);
  const { loading, user } = useAuth();

  const showModal = useRecoilValue(modalState);
  const subscription = useSubscription(user);
  const movie = useRecoilValue(movieState);
  const list = useList(user?.uid); // we need to send uid to get exact list of particular user

  if (loading || subscription === null) return null;

  if (!subscription) return <Plans products={products} />;

  return (
    <div
      className={`relative h-screen bg-gradient-to-b lg:h-[140vh] ${
        showModal && "!h-screen overflow-hidden"
      }`}
    >
      <Head>
        <title>Home-Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* Header */}

      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        {/* Banner */}

        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />

          {/* My List */}

          {/* Displaying My List of User on the UI */}
          {list.length > 0 && <Row title="My List" movies={list} />}
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>

      {/* Modal */}

      {showModal && <Modal />}
    </div>
  );
};

export default Home;

//fetching netflix different movie type
export const getServerSideProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((error) => console.log(error.message));

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products,
    },
  };
};
