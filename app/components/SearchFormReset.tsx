"use client";

import Link from "next/link";

const SearchFormReset = () => {

     const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement
        

        if(form) form.reset();
    }
    
  return (
    <button className="" onClick={reset} type="reset">
        <Link href={"/"} className="search-btn text-white uppercase">x</Link>
    </button>
  )
}

export default SearchFormReset
