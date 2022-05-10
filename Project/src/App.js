import { Route, Routes} from 'react-router-dom';
import './App.css';
import MintAndBuy from './MintAndBuy';
import DigitalSignature from './DigitalSignature';
import Display from './Display';
import About from './About';
import Objectives from './Objectives';

const App = () => 
{

  return(
    <div className="App">
       <Routes>
          <Route path="/" element={<Display/>} />
          <Route path="/nftMarket" element={<MintAndBuy/>} />
          <Route path="/signature" element={<DigitalSignature/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/objectives" element={<Objectives/>} />
       </Routes>
    </div>
  );
}

export default App;