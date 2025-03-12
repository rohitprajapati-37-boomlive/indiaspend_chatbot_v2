// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { addEntry, clearHistory } from "./chartHistorySlice"; // ✅ Correct path

// const ChartHistory = () => {
//   const history = useSelector((state) => state.chartHistory.history);
//   const dispatch = useDispatch();

//   const handleAddEntry = () => {
//     dispatch(
//       addEntry({
//         timestamp: new Date().toLocaleString(),
//         value: Math.random() * 100,
//       })
//     );
//   };

//   return (
//     <div>
//       <h2>Chart History</h2>
//       <button onClick={handleAddEntry}>Add Random Entry</button>
//       <button onClick={() => dispatch(clearHistory())}>Clear History</button>

//       <ul>
//         {history.map((entry, index) => (
//           <li key={index}>
//             {entry.timestamp}: {entry.value.toFixed(2)}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChartHistory;
