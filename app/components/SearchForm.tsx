import Form from "next/form"
import SearchFormReset from "./SearchFormReset";

const SearchForm = ({ query }: { query?: string}) => {

    console.log(query)

    
  return (
    <Form action={"/"} scroll={false} className="search-form">
        <input 
            name="query"
            defaultValue={query}
            className="search-input"
            placeholder="Search Startups"
         />

         <div className="flex gap-2">
            {query && <SearchFormReset />}

            <button className="search-btn text-white cursor-pointer" type="submit">S</button>
         </div>
    </Form>
  )
}

export default SearchForm
