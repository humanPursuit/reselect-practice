import createCachedSelector from "re-reselect";

const getWorldData = state => state.world;

const getCountryData = createCachedSelector(
  [getWorldData, (state, country) => country],
  (world, country) => world[country]
)((state, country) => country); // caches selectors by state name

const afghanistan = getCountryData(state, 'afghanistan');
const zimbabwe = getCountryData(state, 'zimbawe');
const afghanistanAgain = getCountryData(state, 'afghanistan');

// No selector factories and memoization preserved among different components
// afghanistan === afghanistanAgain
