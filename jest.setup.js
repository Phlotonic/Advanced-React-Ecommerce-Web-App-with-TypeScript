// jest.setup.js (require.resolve with full path)
console.log("jest.setup.js is being executed!");
try {
  const extendExpectPath = require.resolve('C:\Users\adryd\Documents\CodingTemple\Front End Specialization\advanced-e-commerce-react\node_modules');
  console.log("@testing-library/jest-dom/extend-expect resolved successfully with full path:", extendExpectPath);
  require(extendExpectPath); // Require using the full path
} catch (error) {
  console.error("Error resolving @testing-library/jest-dom/extend-expect with full path in jest.setup.js:", error.message);
}