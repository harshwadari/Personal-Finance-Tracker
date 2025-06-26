import React from "react";

import IncomeCards from "./_components/IncomeCards";
import IncomeItem from "./_components/IncomeItem";

function Income() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Income Streams</h2>
      <IncomeCards />
        <div>
          <IncomeItem/>
        </div>
    </div>
  );
}

export default Income;