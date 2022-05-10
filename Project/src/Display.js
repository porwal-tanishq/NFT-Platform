import './App.css';
import logo from './images/logo.png';
import {useNavigate} from 'react-router-dom';
import {Button, Row, Col} from "reactstrap";
import Slides from './Slides';

const Display = () => 
{
  const navigate= useNavigate();

  return(
    <>
      <div className="second">
		    <img src={logo} id="logo"></img>
	    </div>
      <div className="body" style={{paddingTop:"10px"}}>
        <Row className="mt-6">
          <Col sm={7} style={{paddingLeft:"70px"}}>
            <Slides style={{}}></Slides>
          </Col>
        </Row>
      </div>
      <div className="body">
      <Button style={{position:"relative", left:"300px", bottom:"150px"}} color="primary" outline color="primary" className="primary lg rounded-pill pe-5 ps-5 mt-5" size="lg" onClick={()=>navigate("nftMarket")}>Go To NFT Market</Button><br/>
      <Button style={{position:"relative", left:"300px", bottom:"150px"}} color="primary" outline color="primary" className="primary lg rounded-pill pe-5 ps-5 mt-5" size="lg" onClick={()=>navigate("signature")}>Signature</Button><br/>
      </div>

      <footer>
        <div className="about">
              <h3>About</h3>
              <ul>
                  <li><a href="About" id="noline"> About Us</a></li>
                  <li><a href="Objectives" id="noline"> Objectives</a></li>
              </ul>
        </div>
        <div className="mail">
            <h3>Mail Us</h3>
            <p>nftplatform@gmail.com</p><br></br>
        </div>
        <div className="office">
          <h3>Registered Office</h3>
          <p>Computer-Science Block,<br></br> 
          Medi-Caps University <br></br>
          <br></br>
          A.B. Road, Pigdamber, Rau <br></br>
          Indore - 453331</p>
        </div>
      </footer>
    </>
  );
}

export default Display;