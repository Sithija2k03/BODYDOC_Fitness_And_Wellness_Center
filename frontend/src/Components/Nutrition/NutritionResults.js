// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import Header from '../../Login/Header';

// function NutritionResults() {
//   const location = useLocation();
//   const result = location.state?.result || null;
//   const nutritionPlan = result?.nutritionPlan || null;

//   const containerStyle = {
//     padding: '20px',
//     maxWidth: '800px',
//     margin: '0 auto',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     minHeight: '100vh',
//   };

//   const titleStyle = {
//     marginBottom: '20px',
//     color: '#333',
//     textAlign: 'center',
//   };

//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginBottom: '20px',
//   };

//   const thStyle = {
//     backgroundColor: '#f4f4f4',
//     padding: '10px',
//     border: '1px solid #ccc',
//     textAlign: 'left',
//     fontWeight: 'bold',
//   };

//   const tdStyle = {
//     padding: '10px',
//     border: '1px solid #ccc',
//     textAlign: 'left',
//   };

//   const errorStyle = {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: '20px',
//     fontSize: '16px',
//   };

//   if (!nutritionPlan || !Array.isArray(nutritionPlan)) {
//     return (
//       <div style={containerStyle}>
//         <Header />
//         <h2 style={titleStyle}>Nutrition Plan</h2>
//         <p style={errorStyle}>No nutrition plan available. Please generate a plan first.</p>
//       </div>
//     );
//   }

//   // Extract totals and meals
//   const totals = nutritionPlan.find((item) => item.Meal === '**Totals**') || {};
//   const meals = nutritionPlan.filter((item) => item.Meal !== '**Totals**');

//   // Construct the expected nutritionPlan object
//   const formattedPlan = {
//     calories: parseInt(totals.Calories?.replace('~', '') || '0'),
//     macros: {
//       protein: parseInt(totals.Protein?.replace('~', '') || '0'),
//       carbs: parseInt(totals.Carbs?.replace('~', '') || '0'),
//       fat: parseInt(totals.Fats?.replace('~', '') || '0'),
//     },
//     dailyMeals: meals.map((meal) => ({
//       title: meal.Meal.replace(/\*\*/g, ''), // Remove markdown bold
//       details: meal.Food,
//       calories: parseInt(meal.Calories?.replace('~', '') || '0'),
//     })),
//     tips: [], // Add tips if the API provides them, or leave as empty
//   };

//   return (
//     <div style={containerStyle}>
//       <Header />
//       <h2 style={titleStyle}>Your Personalized Nutrition Plan</h2>

//       {/* Daily Calorie Goal Table */}
//       <h3>Daily Calorie Goal</h3>
//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             <th style={thStyle}>Metric</th>
//             <th style={thStyle}>Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td style={tdStyle}>Total Calories</td>
//             <td style={tdStyle}>{formattedPlan.calories || 'N/A'} kcal</td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Macronutrient Breakdown Table */}
//       <h3>Macronutrient Breakdown</h3>
//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             <th style={thStyle}>Macronutrient</th>
//             <th style={thStyle}>Amount (g)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {formattedPlan.macros ? (
//             <>
//               <tr>
//                 <td style={tdStyle}>Protein</td>
//                 <td style={tdStyle}>{formattedPlan.macros.protein || 0}g</td>
//               </tr>
//               <tr>
//                 <td style={tdStyle}>Carbohydrates</td>
//                 <td style={tdStyle}>{formattedPlan.macros.carbs || 0}g</td>
//               </tr>
//               <tr>
//                 <td style={tdStyle}>Fats</td>
//                 <td style={tdStyle}>{formattedPlan.macros.fat || 0}g</td>
//               </tr>
//             </>
//           ) : (
//             <tr>
//               <td style={tdStyle} colSpan="2">
//                 No macronutrient data available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Meal Plan Table */}
//       <h3>Meal Plan</h3>
//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             <th style={thStyle}>Meal</th>
//             <th style={thStyle}>Description</th>
//             <th style={thStyle}>Calories (kcal)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {formattedPlan.dailyMeals && formattedPlan.dailyMeals.length > 0 ? (
//             formattedPlan.dailyMeals.map((meal, index) => (
//               <tr key={index}>
//                 <td style={tdStyle}>{meal.title || `Meal ${index + 1}`}</td>
//                 <td style={tdStyle}>{meal.details || 'N/A'}</td>
//                 <td style={tdStyle}>{meal.calories || 'N/A'}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td style={tdStyle} colSpan="3">
//                 No meal plan available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Recommendations Table */}
//       <h3>Additional Recommendations</h3>
//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             <th style={thStyle}>Recommendation</th>
//           </tr>
//         </thead>
//         <tbody>
//           {formattedPlan.tips && formattedPlan.tips.length > 0 ? (
//             formattedPlan.tips.map((rec, index) => (
//               <tr key={index}>
//                 <td style={tdStyle}>{rec}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td style={tdStyle}>No additional recommendations provided.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default NutritionResults;

import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Login/Header';

function NutritionResults() {
  const location = useLocation();
  const result = location.state?.result || null;
  const nutritionPlan = result?.nutritionPlan || null;

  const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '100vh',
  };

  const titleStyle = {
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  };

  const thStyle = {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'left',
    fontWeight: 'bold',
  };

  const tdStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'left',
  };

  const errorStyle = {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '16px',
  };

  if (!nutritionPlan || !Array.isArray(nutritionPlan)) {
    return (
      <div style={containerStyle}>
        <Header />
        <h2 style={titleStyle}>Nutrition Plan</h2>
        <p style={errorStyle}>No nutrition plan available. Please generate a plan first.</p>
      </div>
    );
  }

  // Filter out empty meal entries and extract totals
  const validMeals = nutritionPlan.filter((item) => item.Meal && item.Meal.trim() !== '');
  const totals = validMeals.find((item) => item.Meal === '**Totals**') || {};
  const meals = validMeals.filter((item) => item.Meal !== '**Totals**');

  // Use Food field for total calories since Calories seems incorrect
  const totalCalories = totals.Food?.replace('~', '') || totals.Calories?.replace('~', '') || '0';

  // Construct the expected nutritionPlan object
  const formattedPlan = {
    calories: parseInt(totalCalories) || 0,
    macros: {
      protein: parseInt(totals['Protein (g)']?.replace('~', '') || '0'),
      carbs: parseInt(totals['Carbs (g)']?.replace('~', '') || '0'),
      fat: parseInt(totals['Fats (g)']?.replace('~', '') || '0'),
    },
    dailyMeals: meals.map((meal) => ({
      title: meal.Meal.replace(/\*\*/g, ''),
      details: meal.Food,
      calories: parseInt(meal.Calories?.replace('~', '') || '0'),
    })),
    tips: [], // Add tips if provided by the API
  };

  return (
    <div style={containerStyle}>
      <Header />
      <h2 style={titleStyle}>Your Personalized Nutrition Plan</h2>

      {/* Daily Calorie Goal Table */}
      <h3>Daily Calorie Goal</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Metric</th>
            <th style={thStyle}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Total Calories</td>
            <td style={tdStyle}>{formattedPlan.calories ? `${formattedPlan.calories} kcal` : 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      {/* Macronutrient Breakdown Table */}
      <h3>Macronutrient Breakdown</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Macronutrient</th>
            <th style={thStyle}>Amount (g)</th>
          </tr>
        </thead>
        <tbody>
          {formattedPlan.macros ? (
            <>
              <tr>
                <td style={tdStyle}>Protein</td>
                <td style={tdStyle}>{formattedPlan.macros.protein ? `${formattedPlan.macros.protein}g` : 'N/A'}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Carbohydrates</td>
                <td style={tdStyle}>{formattedPlan.macros.carbs ? `${formattedPlan.macros.carbs}g` : 'N/A'}</td>
              </tr>
              <tr>
                <td style={tdStyle}>Fats</td>
                <td style={tdStyle}>{formattedPlan.macros.fat ? `${formattedPlan.macros.fat}g` : 'N/A'}</td>
              </tr>
            </>
          ) : (
            <tr>
              <td style={tdStyle} colSpan="2">
                No macronutrient data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Meal Plan Table */}
      <h3>Meal Plan</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Meal</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Calories (kcal)</th>
          </tr>
        </thead>
        <tbody>
          {formattedPlan.dailyMeals && formattedPlan.dailyMeals.length > 0 ? (
            formattedPlan.dailyMeals.map((meal, index) => (
              <tr key={index}>
                <td style={tdStyle}>{meal.title || `Meal ${index + 1}`}</td>
                <td style={tdStyle}>{meal.details || 'N/A'}</td>
                <td style={tdStyle}>{meal.calories ? `${meal.calories} kcal` : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan="3">
                No meal plan available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Recommendations Table */}
      <h3>Additional Recommendations</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {formattedPlan.tips && formattedPlan.tips.length > 0 ? (
            formattedPlan.tips.map((rec, index) => (
              <tr key={index}>
                <td style={tdStyle}>{rec}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle}>No additional recommendations provided.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NutritionResults;