import {useMediaQueries} from '@react-hook/media-query';


const useMobileQuery = () => {

  const {matches, matchesAny, matchesAll} = useMediaQueries({
    screen: 'screen',
    width: '(min-width: 768px)'
  });

  return {matches, matchesAny, matchesAll}; 
};


export default useMobileQuery;