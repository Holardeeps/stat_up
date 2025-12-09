import SearchForm from "../components/SearchForm";

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }>}) {

  // const query = (await searchParams).query;
  const { query } = await searchParams
  
  return (
    <>
    <section className="pink_container">
      <h1 className="heading">Pitch ypur startup, <br /> connect with entrpreneurs</h1>
      <p className="sub-heading max-w-3xl!">Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.</p>

      <SearchForm query={query} />
    </section>
    </>
  );
}
