import './App.css';
import tanishq from './images/tanishq.png'

const About= () =>
{
    return(
        <>
        <div className="bg">
            <div id="indigo">
                <p>
                NFT – Platform is a web application based on Blockchain Technology. Main business logic is written in Smart Contracts using Solidity Programming Language, which will be stored on Ethereum Blockchain. 
                The main aim of this NFT - Platform is to get ownership of any digital art, collectibles, etc as an NFT. 
                The ownership can be transferred in replacement of an Ethereum token (ETH) and complete transaction detail will be available on the Ethereum blockchain. 
                <br></br><br></br>
                It is founded by Mr. Tanishq Porwal, and is expected to be among one of the best decentralized platform.
                </p>
            </div>
            <div id="hero">
                <h1 id="found">Founder :</h1>
                <div id="mango">
                    <img src={tanishq} id="talent"></img>
                    <h2 id="lead">Tanishq Porwal</h2>
                </div>
            </div>
        </div>
        <footer>
            <div className="about">
                    <h3>About</h3>
                    <ul>
                        <li> <a href="About" id="noline"> About Us</a></li>
                        <li> <a href="Objectives" id="noline"> Objectives</a></li>
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

export default About;